import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { AIProvider, AnalysisResult, PromptResult } from './ai-provider.interface';

/**
 * Allowed bug categories used by the frontend.
 *
 * IMPORTANT:
 * Keep these categories language-independent.
 * For example:
 * - C array out-of-bounds -> runtime
 * - C division by zero -> runtime
 * - Python ZeroDivisionError -> runtime
 * - TypeScript wrong type -> type
 */
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

/**
 * Complexity can be null when it cannot be determined.
 */
const ComplexitySchema = z
  .object({
    time: z.string().optional(),
    space: z.string().optional(),
  })
  .nullable()
  .optional();

/**
 * Main AI response schema.
 */
const AnalysisResultSchema = z.object({
  language: z.string(),

  status: z.enum([
    'bug_found',
    'no_bug_found',
    'analysis_failed',
  ]),

  bugs: z.array(BugSchema),

  fixedCode: z.string().nullable().optional(),

  explanation: z.string(),

  complexity: ComplexitySchema,

  confidence: z.number(),
});

const PromptResultSchema = z.object({
  intent: z.enum(['solve', 'fix', 'explain', 'optimize', 'convert', 'generate_tests', 'debug', 'review']),
  language: z.string(),
  problemExplanation: z.string().optional(),
  solution: z.string().optional(),
  complexity: ComplexitySchema,
  testCases: z.array(z.any()).optional(),
  warnings: z.array(z.string()).optional(),
  learningExplanation: z.string().optional(),
});

@Injectable()
export class GeminiProvider implements AIProvider {
  private readonly logger = new Logger(GeminiProvider.name);

  async analyzeCode(params: {
    language: string;
    sourceCode: string;
  }): Promise<AnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    /**
     * ------------------------------------------------------------
     * 1. Check Gemini API key
     * ------------------------------------------------------------
     */
    if (
      !apiKey ||
      apiKey.trim() === '' ||
      apiKey === 'your-gemini-api-key'
    ) {
      this.logger.warn(
        'GEMINI_API_KEY is not configured in backend environment',
      );

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

    /**
     * ------------------------------------------------------------
     * 2. Validate source code
     * ------------------------------------------------------------
     */
    if (!params.sourceCode || params.sourceCode.trim() === '') {
      return {
        language: params.language,
        status: 'analysis_failed',
        bugs: [],
        fixedCode: null,
        explanation:
          'No source code was provided for analysis.',
        complexity: null,
        confidence: 0,
      };
    }

    try {
      /**
       * ----------------------------------------------------------
       * 3. Initialize Gemini
       * ----------------------------------------------------------
       */
      const ai = new GoogleGenAI({
        apiKey,
      });

      /**
       * ----------------------------------------------------------
       * 4. Strong system prompt
       * ----------------------------------------------------------
       *
       * The important part here is that Gemini MUST use only
       * the six frontend-supported bug categories.
       */
      const systemPrompt = `
You are an expert software debugging assistant for CodeVerix AI.

Your job is to analyze the user's submitted source code accurately and, when real bugs exist, generate a CORRECTED VERSION of the user's code.

IMPORTANT: The submitted language is exactly:

"${params.language}"

==================================================

1. BUG DETECTION RULES
   ==================================================

Analyze the ENTIRE submitted source code.

Detect REAL bugs only.

Do NOT invent bugs.

Do NOT report:

* stylistic preferences
* formatting preferences
* naming preferences
* optional refactoring
* code that is merely unconventional
* theoretical problems that cannot occur from the submitted code

Supported bug types MUST be exactly:

"syntax"
"runtime"
"logical"
"type"
"performance"
"security"

Severity MUST be exactly:

"high"
"medium"
"low"

If one or more real bugs are found:

"status": "bug_found"

If the submitted code is correct:

"status": "no_bug_found"

Only use:

"status": "analysis_failed"

when the code genuinely cannot be analyzed.

==================================================
2. ANALYZE THE ACTUAL SOURCE CODE
=================================

Base every finding ONLY on the source code provided by the user.

Do not assume missing code.

Do not invent variables, functions, inputs, outputs, libraries, or requirements.

Understand the program's apparent purpose before deciding that something is a bug.

Trace:

* variable values
* conditions
* loops
* array indexes
* string operations
* function calls
* return values
* recursion
* null/undefined values
* arithmetic operations
* collection access
* type compatibility

Check the COMPLETE program before generating the result.

==================================================
3. BUG TYPE CLASSIFICATION
==========================

Use only these categories.

"syntax":
The source code cannot be parsed or compiled because of invalid language syntax.

"runtime":
The code can compile/run but can fail during execution.

Examples:

* array index out of bounds
* null pointer dereference
* division by zero
* invalid collection access
* infinite recursion
* invalid memory access
* unhandled runtime exception

"logical":
The program runs but produces an incorrect result because the algorithm or condition is wrong.

"type":
A type mismatch or invalid type operation causes a real problem.

"performance":
The program is functionally correct but has a significant avoidable performance problem.

"security":
The code contains a real security vulnerability.

Never create a new bug category.

==================================================
4. LINE NUMBER RULE
===================

For every bug, report the actual source-code line where the bug occurs.

Use 1-based line numbering.

If the exact line cannot be determined reliably, use:

"line": null

Never invent a line number.

==================================================
5. FIXED CODE REQUIREMENTS
==========================

If bugs are found:

"fixedCode" MUST contain the COMPLETE corrected source code.

The fixedCode MUST:

1. Use the SAME programming language as the submitted code.
2. Preserve the original program's purpose.
3. Preserve existing functionality that is unrelated to the bug.
4. Fix ALL bugs reported in the "bugs" array.
5. Not introduce new syntax errors.
6. Not introduce new runtime errors.
7. Not introduce new logical errors.
8. Not remove required functionality.
9. Not replace the program with an unrelated solution.
10. Include required imports/includes.
11. Be directly compilable/executable whenever possible.
12. Make the SMALLEST reliable changes necessary.

Do NOT rewrite correct code unnecessarily.

==================================================
6. FIXED CODE VERIFICATION
==========================

CRITICAL:

Before returning fixedCode, perform a SECOND internal verification of the ENTIRE corrected program.

Check:

* syntax
* variable declarations
* variable usage
* imports/includes
* brackets
* braces
* parentheses
* semicolons
* operators
* method/function names
* method calls
* array access
* collection access
* string operations
* null handling
* undefined values
* loops
* loop boundaries
* conditions
* return statements
* type compatibility
* recursion base cases
* arithmetic operations
* division operations
* input handling
* output behavior

Then verify that:

1. Every reported bug is actually fixed.
2. The fixed code still performs the original task.
3. The fix did not create a different bug.
4. The fixed code is internally consistent.

If you discover a problem during this verification, FIX IT before returning the JSON.

==================================================
7. JAVA-SPECIFIC SAFETY RULES
=============================

When the submitted language is Java, follow these rules strictly.

Java arrays use:

array.length

Java Strings use:

string.length()

Correct:

for (int i = 0; i < array.length; i++)

Correct:

for (int i = 0; i < string.length(); i++)

Incorrect:

string.length

Incorrect:

array.length()

Never confuse arrays and Strings.

For multiple conditions, use:

||

or

&&

Correct:

if (current == '(' || current == '[' || current == '{')

Incorrect:

if (current == '(', current == '[', current == '{')

For null-safe String comparison prefer:

"PASS".equals(result)

instead of:

result.equals("PASS")

Array indexes are valid from:

0

through:

array.length - 1

Therefore:

i < array.length

is normally correct.

Avoid:

i <= array.length

Do NOT access:

array[array.length]

For recursion, ensure the base case occurs before invalid array access.

Example:

if (index >= arr.length) {
return 0;
}

Never intentionally generate division by zero.

==================================================
8. LOGICAL FIX VALIDATION
=========================

Fixing a runtime exception is NOT necessarily the complete fix.

Example:

Original:

String topper = null;

if (topper.equals("Priya")) {
System.out.println("Topper found");
}

Changing only the comparison to:

if ("Priya".equals(topper)) {
System.out.println("Topper found");
}

may remove the NullPointerException, but it does not automatically prove that the program's intended logic is correct.

Therefore:

Do not merely silence exceptions.

Understand WHY the invalid value exists and preserve the intended behavior.

If the submitted code has an uninitialized, invalid, or incorrectly calculated value, correct the underlying logic when it is clear from the source code.

==================================================
9. COMMON OFF-BY-ONE ERRORS
===========================

For arrays and collections, carefully check loop boundaries.

Example:

for (int i = 0; i <= arr.length; i++)

is usually incorrect because arr[arr.length] is invalid.

Correct:

for (int i = 0; i < arr.length; i++)

Do not change a boundary unless the original code actually has an indexing problem.

==================================================
10. DIVISION BY ZERO
====================

Detect real division-by-zero risks.

Do not simply remove the calculation.

Preserve the intended behavior.

If the divisor can be zero, safely handle the zero case according to the apparent purpose of the program.

Do not introduce arbitrary behavior without evidence from the source code.

==================================================
11. RECURSION SAFETY
====================

For recursive functions verify:

* base case exists
* base case is reachable
* recursive call progresses toward the base case
* array/string indexes remain valid
* recursion does not continue indefinitely

Do not fix recursion by simply deleting the recursive functionality.

==================================================
12. PRESERVE PROGRAM INTENT
===========================

The goal is:

SMALLEST CORRECT FIX.

Do not rewrite an entire program when a small correction is enough.

Examples:

If Java has:

i <= array.length

and the intended loop is normal array traversal:

change it to:

i < array.length

If Java has:

string.length

change it to:

string.length()

If a condition incorrectly uses comma-separated comparisons:

replace it with the correct logical operator.

If a divisor may be zero:

guard the operation while preserving the intended calculation.

==================================================
13. NO-BUG DECISION
===================

Do not report a bug simply because code could be improved.

If the program is valid and its logic is correct:

"status": "no_bug_found"

"bugs": []

"fixedCode": null

Do not generate unnecessary fixes.

==================================================
14. COMPLEXITY
==============

Estimate time and space complexity based on the actual submitted algorithm.

Do NOT guess.

If complexity can be determined:

"complexity": {
"time": "O(n)",
"space": "O(1)"
}

If it genuinely cannot be determined:

"complexity": null

==================================================
15. CONFIDENCE
==============

Return a number between 0 and 1.

Confidence should represent how certain you are about the analysis.

Do not always return 0.98.

Use lower confidence when:

* requirements are ambiguous
* program intent is unclear
* the exact behavior depends on missing external code
* the bug cannot be determined reliably

==================================================
16. STRICT JSON OUTPUT
======================

Return ONLY ONE valid JSON object.

Do NOT return Markdown.

Do NOT use triple backticks.

Do NOT add explanations outside the JSON.

Do NOT add text before the JSON.

Do NOT add text after the JSON.

Do NOT add trailing commas.

The response MUST be directly parseable by:

JSON.parse()

The fixedCode field MUST contain the complete corrected source code as a valid JSON string.

Preserve the source code correctly inside the JSON string.

==================================================
17. EXACT OUTPUT STRUCTURE
==========================

When bugs are found:

{
"language": "${params.language}",
"status": "bug_found",
"bugs": [
{
"line": 7,
"type": "runtime",
"severity": "high",
"message": "Array index out of bounds",
"explanation": "The code accesses an index equal to the array length, which is outside the valid array range."
}
],
"fixedCode": "complete corrected source code",
"explanation": "The detected bugs were corrected while preserving the original program's purpose.",
"complexity": {
"time": "O(n)",
"space": "O(1)"
},
"confidence": 0.95
}

When no bugs exist:

{
"language": "${params.language}",
"status": "no_bug_found",
"bugs": [],
"fixedCode": null,
"explanation": "No significant bugs were detected in the submitted code.",
"complexity": {
"time": "O(n)",
"space": "O(1)"
},
"confidence": 0.95
}

When the code genuinely cannot be analyzed:

{
"language": "${params.language}",
"status": "analysis_failed",
"bugs": [],
"fixedCode": null,
"explanation": "The submitted code could not be analyzed reliably.",
"complexity": null,
"confidence": 0
}

==================================================
18. FINAL INTERNAL CHECK
========================

Before returning the JSON:

[ ] Did I analyze the entire submitted source code?
[ ] Are all reported bugs real?
[ ] Are bug types one of the six supported categories?
[ ] Are severity values valid?
[ ] Are line numbers accurate?
[ ] Does fixedCode use the same language?
[ ] Is fixedCode complete?
[ ] Is fixedCode syntactically valid?
[ ] Are array and String operations correct?
[ ] Are loop boundaries safe?
[ ] Are null values handled safely?
[ ] Are divisions protected where necessary?
[ ] Are recursion base cases safe?
[ ] Are all imports/includes present?
[ ] Did I preserve the original program's purpose?
[ ] Did I fix every reported bug?
[ ] Did I introduce any new bug?
[ ] Is the JSON valid?

If ANY answer is NO:

Fix the problem internally before returning the response.

Return ONLY the final JSON object.
`;

      /**
       * ----------------------------------------------------------
       * 5. User prompt
       * ----------------------------------------------------------
       */
      const prompt = `
Language: ${params.language}

Source Code:

${params.sourceCode}
`;

      this.logger.log(
        `[AI Pipeline Step 1/8] Language: ${params.language}, Code Length: ${params.sourceCode.length} chars`,
      );

      const primaryModel = process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.6-flash';
      const fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.5-flash';

      let geminiResult: { text: string; modelUsed: string } | null = null;
      let lastError: any = null;

      try {
        geminiResult = await this.generateWithRetry(
          ai,
          primaryModel,
          prompt,
          systemPrompt,
          3,
        );
      } catch (primaryErr: any) {
        lastError = primaryErr;
        const isTemp = this.isTemporaryError(primaryErr);

        if (isTemp && fallbackModel && fallbackModel !== primaryModel) {
          this.logger.warn(
            `[Gemini] Primary model '${primaryModel}' failed with temporary availability error. Attempting fallback model '${fallbackModel}'...`,
          );

          try {
            geminiResult = await this.generateWithRetry(
              ai,
              fallbackModel,
              prompt,
              systemPrompt,
              3,
            );
          } catch (fallbackErr: any) {
            lastError = fallbackErr;
            this.logger.error(
              `[Gemini] Fallback model '${fallbackModel}' also failed: ${
                fallbackErr?.message || 'Unknown error'
              }`,
            );
          }
        }
      }

      if (!geminiResult || !geminiResult.text) {
        const isTemp = this.isTemporaryError(lastError);
        const errStr =
          (lastError?.message || '') + JSON.stringify(lastError || {});
        const isDailyQuotaExhausted =
          errStr.toLowerCase().includes('quota') &&
          (errStr.toLowerCase().includes('exceeded') ||
            errStr.toLowerCase().includes('daily') ||
            errStr.includes('GenerateRequestsPerDay'));

        const userExplanation = isDailyQuotaExhausted
          ? 'Gemini API quota has been exhausted. Please try again later or use a project/API key with available quota.'
          : isTemp
          ? 'AI analysis is temporarily unavailable because the Gemini service is experiencing high demand. Please try again in a few moments.'
          : `Gemini API Error: ${
              lastError?.message ||
              'Unknown error occurred while contacting AI service.'
            }`;

        this.logger.error(
          `[AI Pipeline Final Failure] Temporary: ${isTemp}, Daily Quota Exhausted: ${isDailyQuotaExhausted}, Internal Error: ${
            lastError?.message || 'Unknown error'
          }`,
        );

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
      this.logger.log(
        `[AI Pipeline Step 3/8] Gemini API Call: SUCCESS (using model '${geminiResult.modelUsed}')`,
      );

      this.logger.log(
        `[AI Pipeline Step 4/8] Gemini Raw Response:\n${responseText}`,
      );

      /**
       * ----------------------------------------------------------
       * 8. Clean JSON response
       * ----------------------------------------------------------
       */
      let cleanedText = responseText.trim();

      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText
          .replace(/^```json\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
      }

      /**
       * ----------------------------------------------------------
       * 9. Parse JSON
       * ----------------------------------------------------------
       */
      let rawJson: any;

      try {
        rawJson = JSON.parse(cleanedText);
        this.logger.log(
          `[AI Pipeline Step 5/8] JSON Parsing Result: SUCCESS`,
        );
      } catch (jsonError) {
        this.logger.error(
          `[AI Pipeline Step 5/8] JSON Parsing Result: FAILED (${cleanedText})`,
        );

        return {
          language: params.language,
          status: 'analysis_failed',
          bugs: [],
          fixedCode: null,
          explanation:
            'Gemini returned an invalid JSON response. The code could not be analyzed safely.',
          complexity: null,
          confidence: 0,
        };
      }

      /**
       * ----------------------------------------------------------
       * 10. Normalize AI response before Zod validation
       * ----------------------------------------------------------
       */
      const normalizedResult = this.normalizeGeminiResponse(
        rawJson,
        params.language,
      );

      this.logger.log(
        `[AI Pipeline Step 7/8] Normalized Result:\n${JSON.stringify(normalizedResult, null, 2)}`,
      );

      /**
       * ----------------------------------------------------------
       * 11. Validate normalized response
       * ----------------------------------------------------------
       */
      const parsedResult =
        AnalysisResultSchema.safeParse(normalizedResult);

      if (!parsedResult.success) {
        this.logger.warn(
          `[AI Pipeline Step 6/8] Zod Validation Result: WARNING/FAILED (${JSON.stringify(
            parsedResult.error.format(),
          )})`,
        );

        const safeResult = this.createSafeFallback(
          normalizedResult,
          params.language,
        );

        this.logger.log(
          `[AI Pipeline Step 8/8] Final Result Returned to Frontend: status='${safeResult.status}', bugs=${safeResult.bugs.length}`,
        );

        return safeResult;
      }

      this.logger.log(
        `[AI Pipeline Step 6/8] Zod Validation Result: SUCCESS`,
      );
      this.logger.log(
        `[AI Pipeline Step 8/8] Final Result Returned to Frontend: status='${parsedResult.data.status}', bugs=${parsedResult.data.bugs.length}`,
      );

      return parsedResult.data;
    } catch (error: any) {
      this.logger.error(
        `[AI Pipeline Step Unexpected Exception]: ${
          error?.message || 'Unknown error'
        }`,
        error?.stack,
      );

      return {
        language: params.language,
        status: 'analysis_failed',
        bugs: [],
        fixedCode: null,
        explanation:
          'AI analysis is temporarily unavailable because the Gemini service experienced an unexpected error. Please try again.',
        complexity: null,
        confidence: 0,
      };
    }
  }

  /**
   * Helper method to classify temporary/retryable errors vs permanent errors.
   */
  private isTemporaryError(error: any): boolean {
    if (!error) return false;

    const statusCode =
      error.status || error.code || error.statusCode || error.response?.status;
    const message = (error.message || '').toLowerCase();
    const statusStr = (error.status || '').toString().toLowerCase();

    const temporaryCodes = [
      429, 503, 408, 500, 502, 504,
      '429', '503', '408', '500', '502', '504',
    ];
    if (temporaryCodes.includes(statusCode)) {
      return true;
    }

    if (
      statusStr.includes('unavailable') ||
      statusStr.includes('resource_exhausted') ||
      message.includes('503') ||
      message.includes('429') ||
      message.includes('500') ||
      message.includes('502') ||
      message.includes('504') ||
      message.includes('408') ||
      message.includes('unavailable') ||
      message.includes('resource_exhausted') ||
      message.includes('high demand') ||
      message.includes('overloaded') ||
      message.includes('rate limit') ||
      message.includes('quota') ||
      message.includes('try again later') ||
      message.includes('temporary')
    ) {
      return true;
    }

    return false;
  }

  /**
   * Helper method to parse server-provided retry delay (in ms) from Gemini API errors.
   */
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

    if (typeof error.retryDelay === 'string') {
      const match = error.retryDelay.match(/(\d+(?:\.\d+)?)\s*s?/i);
      if (match) {
        const sec = parseFloat(match[1]);
        if (!isNaN(sec) && sec > 0) return Math.round(sec * 1000);
      }
    }

    const textSources = [
      typeof error.message === 'string' ? error.message : '',
      typeof error.status === 'string' ? error.status : '',
      JSON.stringify(error),
    ];

    for (const text of textSources) {
      if (!text) continue;
      const match = text.match(
        /retry\s*(?:in|after|delay[:=]?\s*")?\s*(\d+(?:\.\d+)?)\s*s/i,
      );
      if (match) {
        const sec = parseFloat(match[1]);
        if (!isNaN(sec) && sec > 0) return Math.round(sec * 1000);
      }
    }

    return null;
  }

  /**
   * Random jitter between 0 and 1000ms to avoid thundering herd.
   */
  private getJitter(): number {
    return Math.floor(Math.random() * 1000);
  }

  /**
   * Helper method to call Gemini API with server-provided delay or bounded exponential backoff.
   */
  private async generateWithRetry(
    ai: GoogleGenAI,
    modelName: string,
    prompt: string,
    systemPrompt: string,
    maxRetries: number = 3,
  ): Promise<{ text: string; modelUsed: string }> {
    const fallbackDelays = [2000, 5000, 10000, 20000];

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.logger.log(
        `[Gemini] Attempt ${attempt}/${maxRetries} using model '${modelName}'`,
      );

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
          this.logger.log(
            `[Gemini] Model '${modelName}' succeeded on attempt ${attempt}`,
          );
          return { text, modelUsed: modelName };
        }

        this.logger.warn(
          `[Gemini] Model '${modelName}' returned an empty response on attempt ${attempt}`,
        );
      } catch (error: any) {
        const isRetryable = this.isTemporaryError(error);
        const statusCode =
          error.status || error.code || error.statusCode || 'UNKNOWN';
        const errorMsg = error?.message || 'Unknown error';

        if (!isRetryable) {
          this.logger.error(
            `[Gemini] Permanent error on model '${modelName}' (${statusCode}): ${errorMsg}. Halting retries.`,
          );
          throw error;
        }

        this.logger.warn(
          `[Gemini] Temporary error ${statusCode} on model '${modelName}' (Attempt ${attempt}/${maxRetries}): ${errorMsg}`,
        );

        if (attempt < maxRetries) {
          const serverDelay = this.extractServerRetryDelay(error);
          let baseDelayMs: number;

          if (serverDelay !== null && serverDelay > 0) {
            baseDelayMs = serverDelay;
            const sec = Math.round(serverDelay / 1000);
            this.logger.log(`[Gemini] ${statusCode} RESOURCE_EXHAUSTED received.`);
            this.logger.log(`[Gemini] Server requested retry after ${sec}s.`);
          } else {
            baseDelayMs = fallbackDelays[attempt - 1] || 10000;
          }

          const totalDelayMs = baseDelayMs + this.getJitter();
          this.logger.log(`[Gemini] Waiting ${totalDelayMs}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, totalDelayMs));
        } else {
          this.logger.error(
            `[Gemini] All ${maxRetries} attempts exhausted for model '${modelName}'.`,
          );
          throw error;
        }
      }
    }

    throw new Error(
      `Failed to generate content with model '${modelName}' after ${maxRetries} attempts.`,
    );
  }

  /**
   * Normalize Gemini response into the exact structure expected
   * by the frontend/backend.
   */
  private normalizeGeminiResponse(
    rawJson: any,
    language: string,
  ): any {
    /**
     * -----------------------------
     * Normalize status
     * -----------------------------
     */
    let status:
      | 'bug_found'
      | 'no_bug_found'
      | 'analysis_failed';

    if (
      rawJson?.status === 'bug_found' ||
      rawJson?.status === 'no_bug_found' ||
      rawJson?.status === 'analysis_failed'
    ) {
      status = rawJson.status;
    } else if (
      Array.isArray(rawJson?.bugs) &&
      rawJson.bugs.length > 0
    ) {
      /**
       * If Gemini forgot status but returned bugs,
       * infer bug_found.
       */
      status = 'bug_found';
    } else {
      status = 'analysis_failed';
    }

    /**
     * -----------------------------
     * Normalize bugs
     * -----------------------------
     */
    const bugs = Array.isArray(rawJson?.bugs)
      ? rawJson.bugs
          .map((bug: any) =>
            this.normalizeBug(bug),
          )
          .filter(Boolean)
      : [];

    /**
     * If Gemini says no bugs but somehow returns bugs,
     * trust the actual bug list.
     */
    if (
      status === 'no_bug_found' &&
      bugs.length > 0
    ) {
      status = 'bug_found';
    }

    /**
     * -----------------------------
     * Normalize complexity
     * -----------------------------
     */
    let complexity: { time?: string; space?: string } | null = null;

    if (
      rawJson?.complexity &&
      typeof rawJson.complexity === 'object'
    ) {
      complexity = {
        time:
          typeof rawJson.complexity.time === 'string'
            ? rawJson.complexity.time
            : undefined,

        space:
          typeof rawJson.complexity.space === 'string'
            ? rawJson.complexity.space
            : undefined,
      };
    }

    /**
     * -----------------------------
     * Normalize confidence
     * -----------------------------
     */
    let confidence = 0;

    if (
      typeof rawJson?.confidence === 'number' &&
      Number.isFinite(rawJson.confidence)
    ) {
      confidence = Math.max(
        0,
        Math.min(1, rawJson.confidence),
      );
    }

    /**
     * -----------------------------
     * Normalize fixedCode
     * -----------------------------
     */
    const fixedCode =
      typeof rawJson?.fixedCode === 'string' &&
      rawJson.fixedCode.trim() !== ''
        ? rawJson.fixedCode
        : null;

    /**
     * -----------------------------
     * Normalize explanation
     * -----------------------------
     */
    const explanation =
      typeof rawJson?.explanation === 'string' &&
      rawJson.explanation.trim() !== ''
        ? rawJson.explanation
        : status === 'bug_found'
          ? 'One or more issues were detected in the submitted code.'
          : status === 'no_bug_found'
            ? 'No significant bugs were detected in the submitted code.'
            : 'The code could not be analyzed successfully.';

    return {
      language:
        typeof rawJson?.language === 'string' &&
        rawJson.language.trim() !== ''
          ? rawJson.language
          : language,

      status,

      bugs,

      fixedCode,

      explanation,

      complexity,

      confidence,
    };
  }

  /**
   * Normalize individual bug objects.
   */
  private normalizeBug(bug: any): any | null {
    if (!bug || typeof bug !== 'object') {
      return null;
    }

    /**
     * -----------------------------
     * Normalize line
     * -----------------------------
     */
    let line: number | null = null;

    if (typeof bug.line === 'number') {
      line = bug.line;
    } else if (
      typeof bug.line === 'string' &&
      /^\d+$/.test(bug.line.trim())
    ) {
      line = Number(bug.line.trim());
    }

    /**
     * -----------------------------
     * Normalize type
     * -----------------------------
     *
     * Gemini may occasionally return:
     * - undefined_behavior
     * - out_of_bounds
     * - compilation
     * - null_pointer
     *
     * Map them into our supported frontend categories.
     */
    const type = this.normalizeBugType(bug.type);

    /**
     * -----------------------------
     * Normalize severity
     * -----------------------------
     */
    const severity = this.normalizeSeverity(
      bug.severity,
    );

    /**
     * -----------------------------
     * Normalize message
     * -----------------------------
     */
    const message =
      typeof bug.message === 'string' &&
      bug.message.trim() !== ''
        ? bug.message
        : 'Bug detected';

    /**
     * -----------------------------
     * Normalize explanation
     * -----------------------------
     */
    const explanation =
      typeof bug.explanation === 'string' &&
      bug.explanation.trim() !== ''
        ? bug.explanation
        : 'An issue was detected in the submitted code.';

    return {
      line,
      type,
      severity,
      message,
      explanation,
    };
  }

  /**
   * Convert language-specific bug categories into
   * the six categories supported by the application.
   */
  private normalizeBugType(
    type: any,
  ):
    | 'syntax'
    | 'runtime'
    | 'logical'
    | 'type'
    | 'performance'
    | 'security' {
    if (typeof type !== 'string') {
      return 'runtime';
    }

    const normalized = type
      .toLowerCase()
      .trim()
      .replace(/[\s-]+/g, '_');

    switch (normalized) {
      case 'syntax':
      case 'syntax_error':
      case 'parse':
      case 'parsing':
        return 'syntax';

      case 'runtime':
      case 'runtime_error':
      case 'undefined_behavior':
      case 'out_of_bounds':
      case 'array_out_of_bounds':
      case 'index_out_of_bounds':
      case 'null_pointer':
      case 'null_pointer_dereference':
      case 'division_by_zero':
      case 'memory':
      case 'memory_error':
      case 'segmentation_fault':
      case 'segfault':
      case 'crash':
        return 'runtime';

      case 'logical':
      case 'logic':
      case 'logic_error':
        return 'logical';

      case 'type':
      case 'type_error':
      case 'type_mismatch':
      case 'typing':
        return 'type';

      case 'performance':
      case 'performance_error':
      case 'optimization':
      case 'inefficient':
        return 'performance';

      case 'security':
      case 'security_error':
      case 'vulnerability':
      case 'vulnerable':
        return 'security';

      case 'compilation':
      case 'compile':
      case 'compile_error':
      case 'compiler':
        return 'syntax';

      default:
        /**
         * Unknown categories are safest as runtime
         * instead of crashing the entire analysis.
         */
        return 'runtime';
    }
  }

  /**
   * Normalize severity.
   */
  private normalizeSeverity(
    severity: any,
  ): 'high' | 'medium' | 'low' {
    if (typeof severity !== 'string') {
      return 'medium';
    }

    const normalized = severity
      .toLowerCase()
      .trim();

    if (normalized === 'high') {
      return 'high';
    }

    if (normalized === 'low') {
      return 'low';
    }

    return 'medium';
  }

  /**
   * Safe fallback for partially malformed Gemini responses.
   *
   * IMPORTANT:
   * Never show "No bugs detected" when the analysis actually failed.
   */
  private createSafeFallback(
    result: any,
    language: string,
  ): AnalysisResult {
    const bugs = Array.isArray(result?.bugs)
      ? result.bugs
      : [];

    const status =
      result?.status === 'bug_found' &&
      bugs.length > 0
        ? 'bug_found'
        : result?.status === 'no_bug_found' &&
            bugs.length === 0
          ? 'no_bug_found'
          : 'analysis_failed';

    /**
     * If we have real bugs, keep them.
     */
    if (status === 'bug_found') {
      return {
        language:
          typeof result?.language === 'string'
            ? result.language
            : language,

        status: 'bug_found',

        bugs,

        fixedCode:
          typeof result?.fixedCode === 'string'
            ? result.fixedCode
            : null,

        explanation:
          typeof result?.explanation === 'string'
            ? result.explanation
            : 'Bugs were detected in the submitted code.',

        complexity:
          result?.complexity || null,

        confidence:
          typeof result?.confidence === 'number'
            ? result.confidence
            : 0.7,
      };
    }

    /**
     * Valid no-bug result.
     */
    if (status === 'no_bug_found') {
      return {
        language:
          typeof result?.language === 'string'
            ? result.language
            : language,

        status: 'no_bug_found',

        bugs: [],

        fixedCode: null,

        explanation:
          typeof result?.explanation === 'string'
            ? result.explanation
            : 'No significant bugs were detected in the submitted code.',

        complexity:
          result?.complexity || null,

        confidence:
          typeof result?.confidence === 'number'
            ? result.confidence
            : 0.8,
      };
    }

    /**
     * Actual analysis failure.
     */
    return {
      language,
      status: 'analysis_failed',
      bugs: [],
      fixedCode: null,
      explanation:
        'The AI response could not be validated safely. Please try the analysis again.',
      complexity: null,
      confidence: 0,
    };
  }

  async processPrompt(params: {
    prompt: string;
    language: string;
    sourceCode?: string;
  }): Promise<PromptResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your-gemini-api-key') {
      throw new Error('GEMINI_API_KEY is not configured in backend environment');
    }

    const ai = new GoogleGenAI({ apiKey });
    const primaryModel = process.env.GEMINI_PRIMARY_MODEL || 'gemini-3.6-flash';

    const systemPrompt = `
You are the CodeVerix AI coding assistant.
Analyze the user's prompt and determine the correct intent.

The supported intents are: "solve", "fix", "explain", "optimize", "convert", "generate_tests", "debug", "review".

Based on the intent, supply the relevant fields in the JSON.
The language is "${params.language}".

Return strictly a JSON object matching this schema:
{
  "intent": "solve",
  "language": "java",
  "problemExplanation": "...",
  "solution": "...",
  "complexity": { "time": "O(n)", "space": "O(1)" },
  "testCases": [{"input": "...", "expected": "..."}],
  "warnings": ["..."],
  "learningExplanation": "..."
}

CRITICAL: Return ONLY ONE valid JSON object, without Markdown, backticks, or outside text.
`;

    const userPrompt = `
Language: ${params.language}
User Prompt: ${params.prompt}
${params.sourceCode ? `\nSource Code:\n${params.sourceCode}` : ''}
`;

    const result = await this.generateWithRetry(ai, primaryModel, userPrompt, systemPrompt, 3);
    const cleanedText = result.text.trim().replace(/^\s*```(json)?/i, '').replace(/```\s*$/i, '').trim();

    try {
      const rawJson = JSON.parse(cleanedText);
      const parsed = PromptResultSchema.parse(rawJson);
      return parsed as PromptResult;
    } catch (err: any) {
      this.logger.error(`Failed to parse PromptResult: ${err.message}\nRaw JSON: ${cleanedText}`);
      throw new Error('Invalid JSON response from AI.');
    }
  }
}