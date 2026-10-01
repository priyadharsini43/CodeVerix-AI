import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import {
  AIProvider,
  AnalysisResult,
  ConversionResult,
  PromptResult,
  BugDetail,
  AnalysisIssue,
} from './ai-provider.interface';

/**
 * Utility function to strip accidental markdown fences from code fields
 */
export function cleanCodeFence(code: string | null | undefined): string | null {
  if (!code || typeof code !== 'string') return null;
  let trimmed = code.trim();
  if (trimmed.startsWith('```')) {
    trimmed = trimmed
      .replace(/^```[a-zA-Z0-9_-]*\n?/, '')
      .replace(/\n?```$/, '')
      .trim();
  }
  return trimmed || null;
}

const BugSchema = z.object({
  line: z.number().nullable().optional(),
  type: z.enum([
    'syntax',
    'runtime',
    'logical',
    'type',
    'performance',
    'security',
  ]),
  severity: z.enum(['high', 'medium', 'low']),
  message: z.string(),
  explanation: z.string(),
});

const ComplexitySchema = z
  .object({
    time: z.string().optional(),
    space: z.string().optional(),
  })
  .nullable()
  .optional();

const AnalysisResultSchema = z.object({
  language: z.string(),
  status: z.enum(['bug_found', 'no_bug_found', 'analysis_failed']),
  bugs: z.array(BugSchema),
  fixedCode: z.string().nullable().optional(),
  explanation: z.string(),
  complexity: ComplexitySchema,
  confidence: z.number(),
});

const ConversionResultSchema = z.object({
  success: z.boolean(),
  sourceLanguage: z.string(),
  targetLanguage: z.string(),
  convertedCode: z.string(),
  explanation: z.string(),
  notes: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});

const PromptResultSchema = z.object({
  intent: z.enum([
    'solve',
    'fix',
    'explain',
    'optimize',
    'convert',
    'generate_tests',
    'debug',
    'review',
  ]),
  language: z.string(),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string().optional(),
  problemExplanation: z.string().optional(),
  solution: z.string().optional(),
  convertedCode: z.string().optional(),
  explanation: z.string().optional(),
  complexity: ComplexitySchema,
  testCases: z.array(z.any()).optional(),
  warnings: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  learningExplanation: z.string().optional(),
});

@Injectable()
export class GeminiProvider implements AIProvider {
  private readonly logger = new Logger(GeminiProvider.name);

  async analyzeCode(params: {
    language: string;
    sourceCode: string;
  }): Promise<AnalysisResult> {
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : '';

    if (!apiKey || apiKey === 'your-gemini-api-key') {
      this.logger.warn('GEMINI_API_KEY is not configured in backend environment');
      return {
        language: params.language,
        status: 'analysis_failed',
        bugs: [],
        fixedCode: null,
        explanation:
          'Gemini API Key is missing or unconfigured. Please add GEMINI_API_KEY to your backend .env file.',
        complexity: null,
        confidence: 0,
      };
    }

    if (!params.sourceCode || params.sourceCode.trim() === '') {
      return {
        language: params.language,
        status: 'analysis_failed',
        bugs: [],
        fixedCode: null,
        explanation: 'No source code was provided for analysis.',
        complexity: null,
        confidence: 0,
      };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `
You are a compiler-aware senior software engineer analyzing code for CodeVerix AI.
Analyze the supplied code as a compiler-aware senior engineer. Identify concrete syntax, type, runtime, and logical problems. Return corrected code that preserves the intended behavior. Do not invent missing requirements.

SUBMITTED LANGUAGE: "${params.language}"

==================================================
1. BUG DETECTION & ANALYSIS RULES
==================================================

Analyze the ENTIRE submitted source code.
Detect REAL bugs only. Do NOT report code style, formatting, naming preferences, or theoretical problems.

Supported bug categories MUST be one of:
"syntax" | "runtime" | "logical" | "type" | "performance" | "security"

Severity MUST be one of: "high" | "medium" | "low"

If one or more real bugs exist:
"status": "bug_found"

If the code is correct:
"status": "no_bug_found"

"fixedCode" MUST contain the complete, corrected source code in "${params.language}".
Do NOT wrap fixedCode inside markdown backticks.

==================================================
2. STRICT JSON OUTPUT FORMAT
==================================================

Return strictly a single JSON object matching this schema:

{
  "success": true,
  "language": "${params.language}",
  "status": "bug_found",
  "bugs": [
    {
      "line": 7,
      "type": "runtime",
      "severity": "high",
      "message": "Short description of bug",
      "explanation": "Detailed explanation"
    }
  ],
  "issues": [
    {
      "line": 7,
      "type": "runtime",
      "severity": "error",
      "description": "Short description of bug"
    }
  ],
  "fixedCode": "complete corrected source code",
  "correctedCode": "complete corrected source code",
  "explanation": "Summary of changes made",
  "complexity": {
    "time": "O(n)",
    "space": "O(1)"
  },
  "confidence": 0.95
}

When no bugs exist:
{
  "success": true,
  "language": "${params.language}",
  "status": "no_bug_found",
  "bugs": [],
  "issues": [],
  "fixedCode": null,
  "correctedCode": null,
  "explanation": "No significant bugs were detected in the submitted code.",
  "complexity": {
    "time": "O(n)",
    "space": "O(1)"
  },
  "confidence": 0.95
}

Return ONLY valid JSON. No markdown fences, no extra text.
`;

      const prompt = `Language: ${params.language}\n\nSource Code:\n${params.sourceCode}`;
      const primaryModel = (process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.6-flash').trim().replace(/^["']|["']$/g, '');
      const fallbackModel = (process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash').trim().replace(/^["']|["']$/g, '');

      let geminiResult: { text: string; modelUsed: string } | null = null;
      let lastError: any = null;

      try {
        geminiResult = await this.generateWithRetry(ai, primaryModel, prompt, systemPrompt, 2);
      } catch (primaryErr: any) {
        lastError = primaryErr;
        if (!this.isQuotaExhausted(primaryErr) && this.isTemporaryError(primaryErr)) {
          if (fallbackModel && fallbackModel !== primaryModel) {
            this.logger.warn(
              `[Gemini] Primary model '${primaryModel}' temporary error. Trying fallback '${fallbackModel}'...`,
            );
            try {
              geminiResult = await this.generateWithRetry(ai, fallbackModel, prompt, systemPrompt, 1);
            } catch (fallbackErr: any) {
              lastError = fallbackErr;
            }
          }
        }
      }

      if (!geminiResult || !geminiResult.text) {
        const isQuota = this.isQuotaExhausted(lastError);
        const userExplanation = isQuota
          ? 'Gemini API quota has been exhausted. Please try again later or use an API key with available quota.'
          : 'AI analysis is temporarily unavailable due to high service demand. Please try again in a moment.';

        return {
          language: params.language,
          status: 'analysis_failed',
          bugs: [],
          fixedCode: null,
          explanation: userExplanation,
          complexity: null,
          confidence: 0,
        };
      }

      const responseText = geminiResult.text;
      const cleanedText = responseText.trim().replace(/^\s*```(json)?/i, '').replace(/```\s*$/i, '').trim();

      let rawJson: any;
      try {
        rawJson = JSON.parse(cleanedText);
      } catch (jsonError) {
        return {
          language: params.language,
          status: 'analysis_failed',
          bugs: [],
          fixedCode: null,
          explanation: 'Gemini returned an invalid JSON response. The code could not be analyzed safely.',
          complexity: null,
          confidence: 0,
        };
      }

      const normalized = this.normalizeGeminiResponse(rawJson, params.language);
      const parsed = AnalysisResultSchema.safeParse(normalized);

      if (!parsed.success) {
        return this.createSafeFallback(normalized, params.language);
      }

      return parsed.data;
    } catch (error: any) {
      this.logger.error(`[analyzeCode Exception] ${error?.message || 'Unknown error'}`);
      return {
        language: params.language,
        status: 'analysis_failed',
        bugs: [],
        fixedCode: null,
        explanation: 'AI analysis is temporarily unavailable. Please try again.',
        complexity: null,
        confidence: 0,
      };
    }
  }

  async convertCode(params: {
    sourceLanguage: string;
    targetLanguage: string;
    sourceCode: string;
  }): Promise<ConversionResult> {
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : '';

    if (!apiKey || apiKey === 'your-gemini-api-key') {
      throw new BadRequestException('GEMINI_API_KEY is not configured in backend environment.');
    }

    if (!params.sourceCode || params.sourceCode.trim() === '') {
      throw new BadRequestException('Source code cannot be empty.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const primaryModel = (process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.6-flash').trim().replace(/^["']|["']$/g, '');
    const fallbackModel = (process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash').trim().replace(/^["']|["']$/g, '');

    const systemPrompt = `
You are a senior software engineer performing semantics-preserving source-code translation. Do not merely translate syntax. Preserve behavior, input/output contract, edge cases, and algorithmic intent. Produce idiomatic code in the target language.

SOURCE LANGUAGE: "${params.sourceLanguage}"
TARGET LANGUAGE: "${params.targetLanguage}"

==================================================
LANGUAGE CONVERSION & CONSTRAINTS MATRIX
==================================================
- Idiomatic Syntax: Use standard practices and native conventions for "${params.targetLanguage}".
- Data Structures:
  * Map Python list/dict/set to Java ArrayList/HashMap/HashSet, C++ vector/unordered_map, C arrays/structs, JS Array/Object/Map/Set, TS typed equivalents.
  * Map Java classes/interfaces/generics to C++ class/struct, Python class/dataclass, JS/TS class.
  * Map C/C++ pointer operations & dynamic memory to standard GC collections or clean C/C++ memory management (malloc/free, new/delete, RAII, headers).
  * Map JS/TS async/promises/objects to target language async or synchronous equivalents.
  * Preserve TS interfaces, types, generics when target is TS, Java, or C++; adapt for JS/Python.
- I/O & Streams: Maintain standard I/O behavior (Scanner/System.out, sys.stdin/print, scanf/printf, cin/cout, console.log/fs.readFileSync).
- Edge Cases & Safety: Maintain boundary conditions, null/undefined handling, division-by-zero protection.

==================================================
STRICT JSON OUTPUT REQUIREMENT
==================================================
Return ONLY ONE valid JSON object:

{
  "success": true,
  "sourceLanguage": "${params.sourceLanguage}",
  "targetLanguage": "${params.targetLanguage}",
  "convertedCode": "COMPLETE CONVERTED SOURCE CODE IN TARGET LANGUAGE",
  "explanation": "Summary of key architectural and translation changes.",
  "notes": [
    "Library or pattern mapping details..."
  ],
  "warnings": []
}

CRITICAL:
1. "convertedCode" MUST contain valid, complete source code in "${params.targetLanguage}".
2. Do NOT wrap "convertedCode" inside markdown fences.
3. Return ONLY valid JSON.
`;

    const userPrompt = `Source Language: ${params.sourceLanguage}\nTarget Language: ${params.targetLanguage}\n\nOriginal Code:\n${params.sourceCode}`;

    let geminiResult: { text: string; modelUsed: string } | null = null;
    let lastError: any = null;

    try {
      geminiResult = await this.generateWithRetry(ai, primaryModel, userPrompt, systemPrompt, 2);
    } catch (primaryErr: any) {
      lastError = primaryErr;
      if (!this.isQuotaExhausted(primaryErr) && this.isTemporaryError(primaryErr)) {
        if (fallbackModel && fallbackModel !== primaryModel) {
          this.logger.warn(
            `[Gemini Convert] Primary model '${primaryModel}' temporary error. Trying fallback '${fallbackModel}'...`,
          );
          try {
            geminiResult = await this.generateWithRetry(ai, fallbackModel, userPrompt, systemPrompt, 1);
          } catch (fallbackErr: any) {
            lastError = fallbackErr;
          }
        }
      }
    }

    if (!geminiResult || !geminiResult.text) {
      const isQuota = this.isQuotaExhausted(lastError);
      const userMessage = isQuota
        ? 'Gemini API quota has been exhausted. Please try again later.'
        : 'Code conversion is temporarily unavailable due to high service demand. Please try again.';
      throw new BadRequestException(userMessage);
    }

    const cleanedText = geminiResult.text.trim().replace(/^\s*```(json)?/i, '').replace(/```\s*$/i, '').trim();

    try {
      const rawJson = JSON.parse(cleanedText);
      if (rawJson.convertedCode) {
        rawJson.convertedCode = cleanCodeFence(rawJson.convertedCode);
      }
      const parsed = ConversionResultSchema.parse(rawJson);
      return parsed as ConversionResult;
    } catch (err: any) {
      this.logger.error(`[Convert Parsing Error] ${err.message}\nRaw Output: ${cleanedText}`);
      throw new BadRequestException('Invalid response format returned during code conversion.');
    }
  }

  async processPrompt(params: {
    prompt: string;
    language: string;
    sourceCode?: string;
  }): Promise<PromptResult> {
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : '';
    if (!apiKey || apiKey === 'your-gemini-api-key') {
      throw new BadRequestException('GEMINI_API_KEY is not configured in backend environment.');
    }

    // Detect explicit convert intent from user prompt text
    const isConvertPrompt = /convert|translate|switch to|rewrite in/i.test(params.prompt);

    if (isConvertPrompt && params.sourceCode && params.sourceCode.trim() !== '') {
      // Determine target language from prompt
      const targetMatch = params.prompt.match(/(java|python|javascript|typescript|c\+\+|cpp|\bc\b)/i);
      let targetLang = params.language;
      if (targetMatch) {
        const rawMatch = targetMatch[1].toLowerCase();
        if (rawMatch === 'python' || rawMatch === 'py') targetLang = 'Python';
        else if (rawMatch === 'java') targetLang = 'Java';
        else if (rawMatch === 'c') targetLang = 'C';
        else if (rawMatch === 'cpp' || rawMatch === 'c++') targetLang = 'C++';
        else if (rawMatch === 'javascript' || rawMatch === 'js') targetLang = 'JavaScript';
        else if (rawMatch === 'typescript' || rawMatch === 'ts') targetLang = 'TypeScript';
      }

      const conversion = await this.convertCode({
        sourceLanguage: params.language,
        targetLanguage: targetLang,
        sourceCode: params.sourceCode,
      });

      return {
        intent: 'convert',
        language: targetLang,
        sourceLanguage: params.language,
        targetLanguage: targetLang,
        solution: conversion.convertedCode,
        convertedCode: conversion.convertedCode,
        problemExplanation: conversion.explanation,
        learningExplanation: conversion.explanation,
        warnings: conversion.warnings || [],
        notes: conversion.notes || [],
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const primaryModel = (process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.6-flash').trim().replace(/^["']|["']$/g, '');

    const systemPrompt = `
You are the CodeVerix AI coding assistant.
Analyze the user's prompt and determine the correct intent.

Supported intents: "solve", "fix", "explain", "optimize", "convert", "generate_tests", "debug", "review".

The current language is "${params.language}".

Return strictly a single JSON object matching this schema:
{
  "intent": "solve",
  "language": "${params.language}",
  "problemExplanation": "Explanation of the solution or answer",
  "solution": "Complete code solution if code is requested",
  "convertedCode": "Converted code if intent is convert",
  "complexity": { "time": "O(n)", "space": "O(1)" },
  "testCases": [{"input": "...", "expected": "..."}],
  "warnings": ["..."],
  "learningExplanation": "Educational concepts explanation"
}

CRITICAL: Return ONLY ONE valid JSON object without markdown fences. Do NOT wrap solution or convertedCode in backticks inside the JSON strings.
`;

    const userPrompt = `Language: ${params.language}\nUser Prompt: ${params.prompt}${
      params.sourceCode ? `\n\nSource Code:\n${params.sourceCode}` : ''
    }`;

    let result: { text: string; modelUsed: string };
    try {
      result = await this.generateWithRetry(ai, primaryModel, userPrompt, systemPrompt, 2);
    } catch (err: any) {
      const isQuota = this.isQuotaExhausted(err);
      const errMsg = isQuota
        ? 'Gemini API quota has been exhausted. Please try again later.'
        : `AI Prompt Error: ${err?.message || 'AI service error.'}`;
      throw new BadRequestException(errMsg);
    }

    const cleanedText = result.text.trim().replace(/^\s*```(json)?/i, '').replace(/```\s*$/i, '').trim();

    try {
      const rawJson = JSON.parse(cleanedText);
      if (rawJson.solution) rawJson.solution = cleanCodeFence(rawJson.solution);
      if (rawJson.convertedCode) rawJson.convertedCode = cleanCodeFence(rawJson.convertedCode);
      const parsed = PromptResultSchema.parse(rawJson);
      return parsed as PromptResult;
    } catch (err: any) {
      this.logger.error(`Failed to parse PromptResult: ${err.message}\nRaw JSON: ${cleanedText}`);
      throw new BadRequestException('Invalid JSON response returned from AI service.');
    }
  }

  private isQuotaExhausted(error: any): boolean {
    if (!error) return false;
    const msg = (error.message || '').toLowerCase();
    const statusStr = (error.status || '').toString().toLowerCase();
    const errStr = JSON.stringify(error).toLowerCase();

    return (
      msg.includes('quota') ||
      msg.includes('generaterequestsperday') ||
      msg.includes('daily_limit') ||
      statusStr.includes('resource_exhausted') ||
      errStr.includes('quota exceeded') ||
      errStr.includes('resource_exhausted')
    );
  }

  private isTemporaryError(error: any): boolean {
    if (!error) return false;
    const statusCode = error.status || error.code || error.statusCode || error.response?.status;
    const msg = (error.message || '').toLowerCase();
    const statusStr = (error.status || '').toString().toLowerCase();

    if (
      statusCode === 400 ||
      statusCode === '400' ||
      msg.includes('api_key_invalid') ||
      msg.includes('invalid_argument')
    ) {
      return false;
    }

    return (
      statusCode === 503 ||
      statusCode === '503' ||
      statusCode === 500 ||
      statusCode === '500' ||
      statusCode === 502 ||
      statusCode === '502' ||
      statusCode === 504 ||
      statusCode === '504' ||
      statusStr.includes('unavailable') ||
      msg.includes('503') ||
      msg.includes('unavailable') ||
      msg.includes('high demand') ||
      msg.includes('overloaded')
    );
  }

  private extractServerRetryDelay(error: any): number | null {
    if (!error) return null;
    if (Array.isArray(error.details)) {
      for (const item of error.details) {
        if (item && typeof item.retryDelay === 'string') {
          const match = item.retryDelay.match(/(\d+(?:\.\d+)?)\s*s?/i);
          if (match) {
            const sec = parseFloat(match[1]);
            if (!isNaN(sec) && sec > 0) return Math.round(sec * 1000);
          }
        }
      }
    }
    return null;
  }

  private async generateWithRetry(
    ai: GoogleGenAI,
    modelName: string,
    prompt: string,
    systemPrompt: string,
    maxRetries: number = 2,
  ): Promise<{ text: string; modelUsed: string }> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.logger.log(`[Gemini] Attempt ${attempt}/${maxRetries} on model '${modelName}'`);

      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const text = response.text;
        if (text && text.trim() !== '') {
          return { text, modelUsed: modelName };
        }
      } catch (error: any) {
        if (this.isQuotaExhausted(error)) {
          this.logger.error(`[Gemini] Quota exhausted on model '${modelName}': ${error?.message || 'Quota exceeded'}`);
          throw error;
        }

        const isRetryable = this.isTemporaryError(error);
        if (!isRetryable || attempt >= maxRetries) {
          throw error;
        }

        const serverDelay = this.extractServerRetryDelay(error);
        const delayMs = serverDelay ? Math.min(serverDelay, 3000) : 1500 + Math.floor(Math.random() * 500);
        this.logger.warn(`[Gemini] Temporary error on model '${modelName}'. Retrying in ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    throw new Error(`Failed to generate content with model '${modelName}' after ${maxRetries} attempts.`);
  }

  private normalizeGeminiResponse(rawJson: any, language: string): any {
    let status: 'bug_found' | 'no_bug_found' | 'analysis_failed';

    if (rawJson?.status === 'bug_found' || rawJson?.status === 'no_bug_found' || rawJson?.status === 'analysis_failed') {
      status = rawJson.status;
    } else if (Array.isArray(rawJson?.bugs) && rawJson.bugs.length > 0) {
      status = 'bug_found';
    } else {
      status = 'analysis_failed';
    }

    const bugs: BugDetail[] = Array.isArray(rawJson?.bugs)
      ? rawJson.bugs.map((bug: any) => this.normalizeBug(bug)).filter(Boolean)
      : [];

    const issues: AnalysisIssue[] = Array.isArray(rawJson?.issues)
      ? rawJson.issues.map((i: any) => ({
          line: typeof i?.line === 'number' ? i.line : null,
          type: i?.type || 'runtime',
          severity: i?.severity || 'error',
          description: i?.description || i?.message || 'Issue detected',
        }))
      : bugs.map((b) => ({
          line: b.line,
          type: b.type,
          severity: b.severity === 'high' ? 'error' : 'warning',
          description: b.message,
        }));

    if (status === 'no_bug_found' && bugs.length > 0) {
      status = 'bug_found';
    }

    let complexity: { time?: string; space?: string } | null = null;
    if (rawJson?.complexity && typeof rawJson.complexity === 'object') {
      complexity = {
        time: typeof rawJson.complexity.time === 'string' ? rawJson.complexity.time : undefined,
        space: typeof rawJson.complexity.space === 'string' ? rawJson.complexity.space : undefined,
      };
    }

    let confidence = 0.9;
    if (typeof rawJson?.confidence === 'number' && Number.isFinite(rawJson.confidence)) {
      confidence = Math.max(0, Math.min(1, rawJson.confidence));
    }

    const fixedCode = cleanCodeFence(rawJson?.fixedCode || rawJson?.correctedCode);
    const explanation =
      typeof rawJson?.explanation === 'string' && rawJson.explanation.trim() !== ''
        ? rawJson.explanation
        : status === 'bug_found'
        ? 'Issues detected and resolved in the submitted code.'
        : 'No significant bugs detected in the code.';

    return {
      success: status !== 'analysis_failed',
      language: typeof rawJson?.language === 'string' ? rawJson.language : language,
      status,
      bugs,
      issues,
      fixedCode,
      correctedCode: fixedCode,
      explanation,
      complexity,
      confidence,
    };
  }

  private normalizeBug(bug: any): BugDetail | null {
    if (!bug || typeof bug !== 'object') return null;
    let line: number | null = null;
    if (typeof bug.line === 'number') line = bug.line;
    else if (typeof bug.line === 'string' && /^\d+$/.test(bug.line.trim())) line = Number(bug.line.trim());

    const type = this.normalizeBugType(bug.type);
    const severity = this.normalizeSeverity(bug.severity);
    const message = typeof bug.message === 'string' && bug.message.trim() !== '' ? bug.message : 'Bug detected';
    const explanation =
      typeof bug.explanation === 'string' && bug.explanation.trim() !== ''
        ? bug.explanation
        : 'Issue detected in code.';

    return { line, type, severity, message, explanation };
  }

  private normalizeBugType(type: any): BugDetail['type'] {
    if (typeof type !== 'string') return 'runtime';
    const norm = type.toLowerCase().trim().replace(/[\s-]+/g, '_');
    switch (norm) {
      case 'syntax':
      case 'syntax_error':
      case 'parse':
        return 'syntax';
      case 'runtime':
      case 'runtime_error':
      case 'null_pointer':
      case 'out_of_bounds':
        return 'runtime';
      case 'logical':
      case 'logic':
        return 'logical';
      case 'type':
      case 'type_error':
        return 'type';
      case 'performance':
        return 'performance';
      case 'security':
        return 'security';
      default:
        return 'runtime';
    }
  }

  private normalizeSeverity(severity: any): 'high' | 'medium' | 'low' {
    if (typeof severity !== 'string') return 'medium';
    const norm = severity.toLowerCase().trim();
    if (norm === 'high' || norm === 'error') return 'high';
    if (norm === 'low') return 'low';
    return 'medium';
  }

  private createSafeFallback(result: any, language: string): AnalysisResult {
    const bugs = Array.isArray(result?.bugs) ? result.bugs : [];
    const status =
      result?.status === 'bug_found' && bugs.length > 0
        ? 'bug_found'
        : result?.status === 'no_bug_found'
        ? 'no_bug_found'
        : 'analysis_failed';

    const fixedCode = cleanCodeFence(result?.fixedCode || result?.correctedCode);

    return {
      success: status !== 'analysis_failed',
      language,
      status,
      bugs,
      issues: result?.issues || [],
      fixedCode,
      correctedCode: fixedCode,
      explanation: result?.explanation || 'Analysis completed.',
      complexity: result?.complexity || null,
      confidence: typeof result?.confidence === 'number' ? result.confidence : 0.8,
    };
  }
}