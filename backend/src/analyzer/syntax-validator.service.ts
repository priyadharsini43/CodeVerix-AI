import { Injectable, Logger } from '@nestjs/common';
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface SyntaxCheckResult {
  isValid: boolean;
  errors: string[];
}

@Injectable()
export class SyntaxValidatorService {
  private readonly logger = new Logger(SyntaxValidatorService.name);

  validateSyntax(language: string, sourceCode: string): SyntaxCheckResult {
    if (!sourceCode || sourceCode.trim() === '') {
      return { isValid: false, errors: ['Source code is empty.'] };
    }

    const lang = language.toLowerCase().trim();

    try {
      if (lang === 'python' || lang === 'py') {
        return this.validatePython(sourceCode);
      } else if (lang === 'javascript' || lang === 'js') {
        return this.validateJavaScript(sourceCode);
      } else if (lang === 'java') {
        return this.validateJava(sourceCode);
      } else if (lang === 'c') {
        return this.validateC(sourceCode);
      } else if (lang === 'cpp' || lang === 'c++') {
        return this.validateCpp(sourceCode);
      } else if (lang === 'typescript' || lang === 'ts') {
        return this.validateTypeScript(sourceCode);
      }
    } catch (err: any) {
      this.logger.debug(`Syntax validator fallback for '${language}': ${err.message}`);
    }

    // Default static bracket & structure sanity check
    return this.basicStaticSanityCheck(sourceCode);
  }

  private validatePython(code: string): SyntaxCheckResult {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-syntax-py-'));
    const tempFile = path.join(tempDir, 'script.py');
    try {
      fs.writeFileSync(tempFile, code, 'utf-8');
      execFileSync('python3', ['-m', 'py_compile', tempFile], {
        timeout: 2000,
        stdio: 'pipe',
      });
      return { isValid: true, errors: [] };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // Try fallback to 'python' executable
        try {
          execFileSync('python', ['-m', 'py_compile', tempFile], {
            timeout: 2000,
            stdio: 'pipe',
          });
          return { isValid: true, errors: [] };
        } catch (pyErr: any) {
          if (pyErr.code === 'ENOENT') {
            return this.basicStaticSanityCheck(code);
          }
          const stderr = pyErr.stderr ? pyErr.stderr.toString() : pyErr.message;
          return { isValid: false, errors: [stderr.trim()] };
        }
      }
      const stderr = err.stderr ? err.stderr.toString() : err.message;
      return { isValid: false, errors: [stderr.trim()] };
    } finally {
      this.cleanupTempDir(tempDir);
    }
  }

  private validateJavaScript(code: string): SyntaxCheckResult {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-syntax-js-'));
    const tempFile = path.join(tempDir, 'script.js');
    try {
      fs.writeFileSync(tempFile, code, 'utf-8');
      execFileSync(process.execPath || 'node', ['--check', tempFile], {
        timeout: 2000,
        stdio: 'pipe',
      });
      return { isValid: true, errors: [] };
    } catch (err: any) {
      const stderr = err.stderr ? err.stderr.toString() : err.message;
      return { isValid: false, errors: [stderr.trim()] };
    } finally {
      this.cleanupTempDir(tempDir);
    }
  }

  private validateJava(code: string): SyntaxCheckResult {
    const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
    const className = match ? match[1] : 'Main';
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-syntax-java-'));
    const tempFile = path.join(tempDir, `${className}.java`);

    try {
      fs.writeFileSync(tempFile, code, 'utf-8');
      execFileSync('javac', ['-nowarn', '-d', tempDir, tempFile], {
        timeout: 3000,
        stdio: 'pipe',
      });
      return { isValid: true, errors: [] };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return this.basicStaticSanityCheck(code);
      }
      const stderr = err.stderr ? err.stderr.toString() : err.message;
      return { isValid: false, errors: [stderr.trim()] };
    } finally {
      this.cleanupTempDir(tempDir);
    }
  }

  private validateC(code: string): SyntaxCheckResult {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-syntax-c-'));
    const tempFile = path.join(tempDir, 'main.c');
    try {
      fs.writeFileSync(tempFile, code, 'utf-8');
      execFileSync('gcc', ['-fsyntax-only', '-std=c11', tempFile], {
        timeout: 3000,
        stdio: 'pipe',
      });
      return { isValid: true, errors: [] };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return this.basicStaticSanityCheck(code);
      }
      const stderr = err.stderr ? err.stderr.toString() : err.message;
      return { isValid: false, errors: [stderr.trim()] };
    } finally {
      this.cleanupTempDir(tempDir);
    }
  }

  private validateCpp(code: string): SyntaxCheckResult {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cv-syntax-cpp-'));
    const tempFile = path.join(tempDir, 'main.cpp');
    try {
      fs.writeFileSync(tempFile, code, 'utf-8');
      execFileSync('g++', ['-fsyntax-only', '-std=c++17', tempFile], {
        timeout: 3000,
        stdio: 'pipe',
      });
      return { isValid: true, errors: [] };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        return this.basicStaticSanityCheck(code);
      }
      const stderr = err.stderr ? err.stderr.toString() : err.message;
      return { isValid: false, errors: [stderr.trim()] };
    } finally {
      this.cleanupTempDir(tempDir);
    }
  }

  private validateTypeScript(code: string): SyntaxCheckResult {
    // Strip simple TS types for quick Node syntax check, or do static check
    const stripped = code.replace(/:\s*[A-Za-z0-9_<>[\]|&]+/g, '');
    return this.validateJavaScript(stripped);
  }

  private basicStaticSanityCheck(code: string): SyntaxCheckResult {
    const stack: string[] = [];
    const matchingBrackets: Record<string, string> = { ')': '(', '}': '{', ']': '[' };
    const errors: string[] = [];

    let inString = false;
    let stringChar = '';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (inString) {
        if (char === stringChar && code[i - 1] !== '\\') {
          inString = false;
        }
        continue;
      }

      if (char === '"' || char === "'" || char === '`') {
        inString = true;
        stringChar = char;
        continue;
      }

      if (char === '(' || char === '{' || char === '[') {
        stack.push(char);
      } else if (char === ')' || char === '}' || char === ']') {
        const expected = matchingBrackets[char];
        if (stack.pop() !== expected) {
          errors.push(`Unmatched closing delimiter '${char}'`);
          break;
        }
      }
    }

    if (inString) {
      errors.push('Unterminated string literal.');
    }

    if (stack.length > 0) {
      errors.push(`Unclosed bracket '${stack[stack.length - 1]}'.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private cleanupTempDir(dir: string): void {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup error
    }
  }
}
