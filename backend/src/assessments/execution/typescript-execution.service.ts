import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { exec, spawn } from 'child_process';
import { randomUUID } from 'crypto';
import { ExecutionTestCase, TestCaseExecutionResult, FullExecutionReport } from './java-execution.service';

@Injectable()
export class TypeScriptExecutionService {
  private readonly logger = new Logger(TypeScriptExecutionService.name);

  /**
   * Execute TypeScript source code against test cases in an isolated temporary directory.
   */
  async executeTypeScriptCode(
    sourceCode: string,
    testCases: ExecutionTestCase[],
    options: { isSubmission?: boolean; timeoutMs?: number } = {},
  ): Promise<FullExecutionReport> {
    const timeoutMs = options.timeoutMs || 5000;
    const executionId = randomUUID();
    const tempDir = path.join(process.cwd(), 'scratch', `ts_exec_${executionId}`);

    try {
      // 1. Create temporary directory
      fs.mkdirSync(tempDir, { recursive: true });

      // 2. Write TypeScript source file
      const tsFilePath = path.join(tempDir, 'solution.ts');
      const jsFilePath = path.join(tempDir, 'solution.js');
      fs.writeFileSync(tsFilePath, sourceCode, 'utf8');

      // 3. Transpile TypeScript to JavaScript
      const transpileResult = ts.transpileModule(sourceCode, {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
        },
        reportDiagnostics: true,
      });

      if (transpileResult.diagnostics && transpileResult.diagnostics.length > 0) {
        const errorMessages = transpileResult.diagnostics
          .map((d) => {
            const messageText = typeof d.messageText === 'string' ? d.messageText : d.messageText.messageText;
            return `Line ${d.start !== undefined ? d.start : '?'}: ${messageText}`;
          })
          .join('\n');

        if (errorMessages.includes('error') || errorMessages.includes('expected') || errorMessages.includes('Unexpected')) {
          this.cleanupTempDir(tempDir);
          return {
            status: 'Compilation Error',
            compilerMessage: errorMessages,
            passedTests: 0,
            totalTests: testCases.length,
            totalExecutionTime: 0,
            score: 0,
            results: testCases.map((tc) => ({
              testCaseId: tc.id,
              status: 'Error',
              actualOutput: null,
              expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
              executionTime: 0,
              errorMessage: 'TypeScript Transpilation Error',
            })),
          };
        }
      }

      fs.writeFileSync(jsFilePath, transpileResult.outputText, 'utf8');

      let passedTests = 0;
      let totalTime = 0;
      let overallStatus: FullExecutionReport['status'] = 'Accepted';
      let totalMarksEarned = 0;

      const results: TestCaseExecutionResult[] = [];

      // 4. Run transpiled JavaScript via Node per testcase
      for (const tc of testCases) {
        const singleResult = await this.runSingleTestCase(tempDir, jsFilePath, tc, timeoutMs);
        results.push(singleResult);

        totalTime += singleResult.executionTime;

        if (singleResult.status === 'Passed') {
          passedTests++;
          totalMarksEarned += tc.marks || 10;
        } else {
          if (singleResult.status === 'Time Limit Exceeded') {
            overallStatus = 'Time Limit Exceeded';
          } else if (singleResult.status === 'Error' && overallStatus !== 'Time Limit Exceeded') {
            overallStatus = 'Runtime Error';
          } else if (overallStatus !== 'Time Limit Exceeded' && overallStatus !== 'Runtime Error') {
            overallStatus = 'Wrong Answer';
          }
        }
      }

      if (passedTests === testCases.length) {
        overallStatus = 'Accepted';
      }

      this.cleanupTempDir(tempDir);

      return {
        status: overallStatus,
        compilerMessage: 'TypeScript transpilation and execution successful',
        passedTests,
        totalTests: testCases.length,
        totalExecutionTime: totalTime,
        score: totalMarksEarned,
        results,
      };
    } catch (err: any) {
      this.cleanupTempDir(tempDir);
      this.logger.error(`Unexpected TypeScript execution error: ${err.message}`, err.stack);
      return {
        status: 'Runtime Error',
        compilerMessage: `Internal Execution Error: ${err.message}`,
        passedTests: 0,
        totalTests: testCases.length,
        totalExecutionTime: 0,
        score: 0,
        results: testCases.map((tc) => ({
          testCaseId: tc.id,
          status: 'Error',
          actualOutput: null,
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
          executionTime: 0,
          errorMessage: err.message,
        })),
      };
    }
  }

  private async runSingleTestCase(
    tempDir: string,
    jsFilePath: string,
    tc: ExecutionTestCase,
    timeoutMs: number,
  ): Promise<TestCaseExecutionResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdoutData = '';
      let stderrData = '';
      let isTimedOut = false;

      const nodePath = process.execPath;
      const child = spawn(nodePath, [jsFilePath], { cwd: tempDir });

      const timer = setTimeout(() => {
        isTimedOut = true;
        if (process.platform === 'win32' && child.pid) {
          exec(`taskkill /F /T /PID ${child.pid}`, () => {});
        } else {
          child.kill('SIGKILL');
        }
      }, timeoutMs);

      // Write stdin
      if (tc.input) {
        child.stdin.write(tc.input);
        if (!tc.input.endsWith('\n')) {
          child.stdin.write('\n');
        }
      }
      child.stdin.end();

      child.stdout.on('data', (chunk) => {
        stdoutData += chunk.toString();
      });

      child.stderr.on('data', (chunk) => {
        stderrData += chunk.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        const executionTime = Math.max(1, Date.now() - startTime);

        if (isTimedOut) {
          resolve({
            testCaseId: tc.id,
            status: 'Time Limit Exceeded',
            actualOutput: null,
            expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
            executionTime: timeoutMs,
            errorMessage: `Time Limit Exceeded (${timeoutMs}ms)`,
          });
          return;
        }

        if (code !== 0 || stderrData.trim().length > 0) {
          const sanitizedErr = this.sanitizeOutput(stderrData, tempDir);
          resolve({
            testCaseId: tc.id,
            status: 'Error',
            actualOutput: stdoutData ? this.sanitizeOutput(stdoutData, tempDir) : null,
            expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
            executionTime,
            errorMessage: sanitizedErr || `Process exited with code ${code}`,
          });
          return;
        }

        // Compare output
        const actualNormalized = this.normalizeOutput(stdoutData);
        const expectedNormalized = this.normalizeOutput(tc.expectedOutput);

        const isMatch = actualNormalized === expectedNormalized;

        resolve({
          testCaseId: tc.id,
          status: isMatch ? 'Passed' : 'Failed',
          actualOutput: tc.isHidden ? null : this.sanitizeOutput(stdoutData, tempDir),
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
          executionTime,
          errorMessage: isMatch ? null : 'Output does not match expected result',
        });
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        const executionTime = Math.max(1, Date.now() - startTime);
        resolve({
          testCaseId: tc.id,
          status: 'Error',
          actualOutput: null,
          expectedOutput: tc.isHidden ? undefined : tc.expectedOutput,
          executionTime,
          errorMessage: err.message,
        });
      });
    });
  }

  private normalizeOutput(output: string): string {
    if (!output) return '';
    return output
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();
  }

  private sanitizeOutput(text: string, tempDir: string): string {
    if (!text) return '';
    const normalizedTempDir = tempDir.replace(/\\/g, '/');
    return text
      .replace(new RegExp(tempDir.replace(/\\/g, '\\\\'), 'g'), '')
      .replace(new RegExp(normalizedTempDir, 'g'), '')
      .trim();
  }

  private cleanupTempDir(tempDir: string) {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) {
      this.logger.warn(`Failed to cleanup temp TS dir ${tempDir}: ${e.message}`);
    }
  }
}
