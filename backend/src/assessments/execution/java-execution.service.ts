import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

export interface ExecutionTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  marks?: number;
}

export interface TestCaseExecutionResult {
  testCaseId: string;
  status: 'Passed' | 'Failed' | 'Error' | 'Time Limit Exceeded';
  actualOutput: string | null;
  expectedOutput?: string | null; // Sanitized for public view if hidden
  executionTime: number;
  errorMessage: string | null;
}

export interface FullExecutionReport {
  status: 'Accepted' | 'Wrong Answer' | 'Compilation Error' | 'Runtime Error' | 'Time Limit Exceeded';
  compilerMessage: string | null;
  passedTests: number;
  totalTests: number;
  totalExecutionTime: number;
  score: number;
  results: TestCaseExecutionResult[];
}

@Injectable()
export class JavaExecutionService {
  private readonly logger = new Logger(JavaExecutionService.name);

  /**
   * Execute Java source code against a list of test cases in an isolated temporary directory.
   */
  async executeJavaCode(
    sourceCode: string,
    testCases: ExecutionTestCase[],
    options: { isSubmission?: boolean; timeoutMs?: number } = {},
  ): Promise<FullExecutionReport> {
    const timeoutMs = options.timeoutMs || 5000;
    const executionId = randomUUID();
    const tempDir = path.join(process.cwd(), 'scratch', `java_exec_${executionId}`);

    // Extract main class name or default to 'Main'
    const classNameMatch = sourceCode.match(/public\s+class\s+([A-Za-z0-9_]+)/);
    const className = classNameMatch ? classNameMatch[1] : 'Main';

    try {
      // 1. Create temporary directory
      fs.mkdirSync(tempDir, { recursive: true });

      // 2. Write Java source file
      const javaFilePath = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(javaFilePath, sourceCode, 'utf8');

      // 3. Compile Java code (`javac Main.java`)
      let compilerMessage = '';
      try {
        const compileResult = await execAsync(`javac ${className}.java`, {
          cwd: tempDir,
          timeout: 10000, // 10s compile limit
        });
        compilerMessage = (compileResult.stderr || compileResult.stdout || '').trim();
      } catch (compileErr: any) {
        const rawErr = (compileErr.stderr || compileErr.stdout || compileErr.message || '').toString();
        const sanitizedErr = this.sanitizeOutput(rawErr, tempDir);
        this.cleanupTempDir(tempDir);

        return {
          status: 'Compilation Error',
          compilerMessage: sanitizedErr || 'Compilation failed.',
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

      // Compilation succeeded
      let passedTests = 0;
      let totalTime = 0;
      let overallStatus: FullExecutionReport['status'] = 'Accepted';
      let totalMarksEarned = 0;

      const results: TestCaseExecutionResult[] = [];

      // 4. Run process for each test case
      for (const tc of testCases) {
        const singleResult = await this.runSingleTestCase(tempDir, className, tc, timeoutMs);
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
        compilerMessage: compilerMessage ? this.sanitizeOutput(compilerMessage, tempDir) : 'Compilation successful',
        passedTests,
        totalTests: testCases.length,
        totalExecutionTime: totalTime,
        score: totalMarksEarned,
        results,
      };
    } catch (err: any) {
      this.cleanupTempDir(tempDir);
      this.logger.error(`Unexpected Java execution error: ${err.message}`, err.stack);
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
    className: string,
    tc: ExecutionTestCase,
    timeoutMs: number,
  ): Promise<TestCaseExecutionResult> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let stdoutData = '';
      let stderrData = '';
      let isTimedOut = false;

      const child = spawn('java', ['-cp', tempDir, className], {
        cwd: tempDir,
      });

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
      .replace(/\r\n/g, '\n') // Normalize CRLF to LF
      .split('\n')
      .map((line) => line.trimEnd()) // Trim trailing spaces on each line
      .join('\n')
      .trim(); // Trim overall leading/trailing newlines
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
      this.logger.warn(`Failed to cleanup temp execution dir ${tempDir}: ${e.message}`);
    }
  }
}
