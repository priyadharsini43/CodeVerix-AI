import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec, execFile, spawn } from 'child_process';
import { randomUUID } from 'crypto';
import { ExecutionTestCase, TestCaseExecutionResult, FullExecutionReport } from './java-execution.service';

@Injectable()
export class CppExecutionService {
  private readonly logger = new Logger(CppExecutionService.name);
  private gppPath = 'g++';

  constructor() {
    this.detectGppCommand();
  }

  private detectGppCommand() {
    exec('g++ --version', (err) => {
      if (!err) {
        this.gppPath = 'g++';
      } else {
        const octaveGpp = 'C:\\Program Files\\GNU Octave\\Octave-11.1.0\\mingw64\\bin\\g++.exe';
        if (fs.existsSync(octaveGpp)) {
          this.gppPath = octaveGpp;
        }
      }
    });
  }

  private getExecutionEnv(): NodeJS.ProcessEnv {
    const gppDir = path.dirname(this.gppPath);
    return {
      ...process.env,
      PATH: fs.existsSync(gppDir) ? `${gppDir};${process.env.PATH || ''}` : process.env.PATH,
    };
  }

  /**
   * Execute C++ source code against test cases in an isolated temporary directory.
   */
  async executeCppCode(
    sourceCode: string,
    testCases: ExecutionTestCase[],
    options: { isSubmission?: boolean; timeoutMs?: number } = {},
  ): Promise<FullExecutionReport> {
    const timeoutMs = options.timeoutMs || 5000;
    const executionId = randomUUID();
    const tempDir = path.join(process.cwd(), 'scratch', `cpp_exec_${executionId}`);

    try {
      // 1. Create temporary directory
      fs.mkdirSync(tempDir, { recursive: true });

      // 2. Write C++ source file
      const cppFilePath = path.join(tempDir, 'solution.cpp');
      const exeFilePath = path.join(tempDir, process.platform === 'win32' ? 'solution.exe' : 'solution');
      fs.writeFileSync(cppFilePath, sourceCode, 'utf8');

      // 3. Compile C++ file using g++
      const compileResult = await this.compileCppCode(tempDir, cppFilePath, exeFilePath);
      if (!compileResult.success) {
        this.cleanupTempDir(tempDir);
        return {
          status: 'Compilation Error',
          compilerMessage: compileResult.output,
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
            errorMessage: 'Compilation Error',
          })),
        };
      }

      let passedTests = 0;
      let totalTime = 0;
      let overallStatus: FullExecutionReport['status'] = 'Accepted';
      let totalMarksEarned = 0;

      const results: TestCaseExecutionResult[] = [];

      // 4. Run compiled executable per testcase
      for (const tc of testCases) {
        const singleResult = await this.runSingleTestCase(tempDir, exeFilePath, tc, timeoutMs);
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
        compilerMessage: 'Compilation successful',
        passedTests,
        totalTests: testCases.length,
        totalExecutionTime: totalTime,
        score: totalMarksEarned,
        results,
      };
    } catch (err: any) {
      this.cleanupTempDir(tempDir);
      this.logger.error(`Unexpected C++ execution error: ${err.message}`, err.stack);
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

  private compileCppCode(
    tempDir: string,
    cppFilePath: string,
    exeFilePath: string,
  ): Promise<{ success: boolean; output: string }> {
    return new Promise((resolve) => {
      const env = this.getExecutionEnv();
      execFile(this.gppPath, [cppFilePath, '-o', exeFilePath], { cwd: tempDir, env, timeout: 10000 }, (error, stdout, stderr) => {
        if (error) {
          const combinedErr = stderr || stdout || error.message;
          resolve({
            success: false,
            output: this.sanitizeOutput(combinedErr, tempDir),
          });
        } else {
          resolve({
            success: true,
            output: 'Compilation successful',
          });
        }
      });
    });
  }

  private async runSingleTestCase(
    tempDir: string,
    exeFilePath: string,
    tc: ExecutionTestCase,
    timeoutMs: number,
  ): Promise<TestCaseExecutionResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdoutData = '';
      let stderrData = '';
      let isTimedOut = false;

      const env = this.getExecutionEnv();
      const child = spawn(exeFilePath, [], { cwd: tempDir, env });

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
      this.logger.warn(`Failed to cleanup temp C++ dir ${tempDir}: ${e.message}`);
    }
  }
}
