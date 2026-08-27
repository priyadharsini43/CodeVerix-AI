import { Injectable } from '@nestjs/common';

@Injectable()
export class FixerService {
  computeLineChanges(originalCode: string, fixedCode?: string | null): {
    originalLinesCount: number;
    fixedLinesCount: number;
    hasChanges: boolean;
  } {
    const originalLinesCount = originalCode.trim() ? originalCode.split('\n').length : 0;
    const fixedLinesCount = fixedCode && fixedCode.trim() ? fixedCode.split('\n').length : 0;
    const hasChanges = Boolean(fixedCode && originalCode.trim() !== fixedCode.trim());

    return {
      originalLinesCount,
      fixedLinesCount,
      hasChanges,
    };
  }
}
