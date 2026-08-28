import { Injectable, NotFoundException, BadRequestException, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JavaExecutionService, ExecutionTestCase, FullExecutionReport } from './execution/java-execution.service';
import { PythonExecutionService } from './execution/python-execution.service';
import { CExecutionService } from './execution/c-execution.service';
import { CppExecutionService } from './execution/cpp-execution.service';
import { JavaScriptExecutionService } from './execution/javascript-execution.service';
import { TypeScriptExecutionService } from './execution/typescript-execution.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { RunAssessmentDto } from './dto/run-assessment.dto';
import { SEED_ASSESSMENTS } from './assessments-seed.data';

@Injectable()
export class AssessmentsService implements OnModuleInit {
  private readonly logger = new Logger(AssessmentsService.name);

  constructor(
    private prisma: PrismaService,
    private javaExecutionService: JavaExecutionService,
    private pythonExecutionService: PythonExecutionService,
    private cExecutionService: CExecutionService,
    private cppExecutionService: CppExecutionService,
    private javaScriptExecutionService: JavaScriptExecutionService,
    private typeScriptExecutionService: TypeScriptExecutionService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAssessment();
  }

  /**
   * Seed default & catalog assessments if missing
   */
  async seedDefaultAssessment() {
    try {
      const existingList = await this.prisma.assessment.findMany({
        select: { title: true },
      });
      const existingTitles = new Set(existingList.map((a) => a.title));

      if (!existingTitles.has('Find Maximum Element')) {
        this.logger.log('Seeding default assessment: Find Maximum Element...');
        await this.prisma.assessment.create({
          data: {
            title: 'Find Maximum Element',
            description: `Given an array of integers provided via standard input (formatted as space-separated numbers on a single line), find and print the maximum integer in the array.

### Input Format:
A single line containing space-separated integers.
Example: \`10 20 5 30 15\`

### Output Format:
Print the maximum integer value on a single line.
Example: \`30\``,
            difficulty: 'Easy',
            subject: 'Programming',
            topic: 'Arrays',
            questionType: 'Single File Programming',
            totalMarks: 100,
            allowedLanguages: 'Java, Python, C, C++, JavaScript, TypeScript',
            starterCode: {
              Java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (!scanner.hasNextInt()) return;\n        int max = Integer.MIN_VALUE;\n        while (scanner.hasNextInt()) {\n            int num = scanner.nextInt();\n            if (num > max) max = num;\n        }\n        System.out.println(max);\n    }\n}`,
              Python: `import sys\n\ndef main():\n    input_data = sys.stdin.read().split()\n    if not input_data: return\n    numbers = [int(x) for x in input_data]\n    print(max(numbers))\n\nif __name__ == '__main__':\n    main()`,
              C: `#include <stdio.h>\n#include <limits.h>\n\nint main() {\n    int num, max = INT_MIN;\n    while (scanf("%d", &num) == 1) {\n        if (num > max) max = num;\n    }\n    printf("%d\\n", max);\n    return 0;\n}`,
              'C++': `#include <iostream>\n#include <climits>\n\nint main() {\n    int num, maxVal = INT_MIN;\n    while (std::cin >> num) {\n        if (num > maxVal) maxVal = num;\n    }\n    std::cout << maxVal << std::endl;\n    return 0;\n}`,
              JavaScript: `const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);\nif (input.length && !isNaN(input[0])) {\n    console.log(Math.max(...input));\n}`,
              TypeScript: `import * as fs from 'fs';\nconst input: number[] = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/).map(Number);\nif (input.length && !isNaN(input[0])) {\n    console.log(Math.max(...input));\n}`,
            },
            testCases: {
              create: [
                { input: '10 20 5 30 15', expectedOutput: '30', isHidden: false, marks: 30 },
                { input: '-5 -10 -2 -50', expectedOutput: '-2', isHidden: false, marks: 30 },
                { input: '100 500 200 999 400', expectedOutput: '999', isHidden: true, marks: 40 },
              ],
            },
          },
        });
      }

      for (const item of SEED_ASSESSMENTS) {
        if (!existingTitles.has(item.title)) {
          this.logger.log(`Seeding catalog assessment: ${item.title}...`);
          await this.prisma.assessment.create({
            data: {
              title: item.title,
              description: item.description,
              difficulty: item.difficulty,
              subject: item.subject,
              topic: item.topic,
              questionType: item.questionType,
              totalMarks: item.totalMarks,
              allowedLanguages: item.allowedLanguages,
              starterCode: item.starterCode as any,
              testCases: {
                create: item.testCases,
              },
            },
          });
        }
      }

      this.logger.log('Assessment catalog check and seed completed.');
    } catch (err: any) {
      this.logger.error(`Failed to seed assessments: ${err.message}`);
    }
  }

  async getAllAssessments(userId?: string) {
    const assessments = await this.prisma.assessment.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        _count: {
          select: { testCases: true, submissions: true },
        },
        submissions: userId
          ? {
              where: { userId },
              select: { status: true },
            }
          : false,
      },
    });

    return assessments.map((a) => {
      let userStatus = 'Not Started';
      if (userId && a.submissions && a.submissions.length > 0) {
        const hasAccepted = a.submissions.some((s) => s.status === 'Accepted');
        userStatus = hasAccepted ? 'Solved' : 'Attempted';
      }

      return {
        id: a.id,
        title: a.title,
        description: a.description,
        difficulty: a.difficulty,
        subject: a.subject,
        topic: a.topic,
        questionType: a.questionType,
        totalMarks: a.totalMarks,
        allowedLanguages: a.allowedLanguages,
        starterCode: a.starterCode,
        createdAt: a.createdAt,
        totalTestCases: a._count.testCases,
        submissionCount: a._count.submissions,
        status: userStatus,
      };
    });
  }

  async getAssessmentById(userId: string, id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        testCases: {
          orderBy: { createdAt: 'asc' },
        },
        submissions: {
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID '${id}' not found.`);
    }

    const timesSubmitted = await this.prisma.assessmentSubmission.count({
      where: { assessmentId: id, userId },
    });

    const sanitizedTestCases = assessment.testCases.map((tc, idx) => ({
      id: tc.id,
      testCaseNumber: idx + 1,
      isHidden: tc.isHidden,
      marks: tc.marks,
      input: tc.isHidden ? null : tc.input,
      expectedOutput: tc.isHidden ? null : tc.expectedOutput,
    }));

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      difficulty: assessment.difficulty,
      subject: assessment.subject,
      topic: assessment.topic,
      questionType: assessment.questionType,
      totalMarks: assessment.totalMarks,
      allowedLanguages: assessment.allowedLanguages,
      starterCode: assessment.starterCode,
      createdAt: assessment.createdAt,
      timesSubmitted,
      testCases: sanitizedTestCases,
      recentSubmissions: assessment.submissions,
    };
  }

  async createAssessment(dto: CreateAssessmentDto) {
    return this.prisma.assessment.create({
      data: {
        title: dto.title,
        description: dto.description,
        difficulty: dto.difficulty,
        subject: dto.subject,
        topic: dto.topic,
        questionType: dto.questionType || 'Single File Programming',
        totalMarks: dto.totalMarks || 100,
        allowedLanguages: dto.allowedLanguages || 'Java, Python, C',
        starterCode: dto.starterCode as any,
        testCases: {
          create: dto.testCases.map((tc) => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            isHidden: tc.isHidden ?? false,
            marks: tc.marks ?? 10,
          })),
        },
      },
      include: {
        testCases: true,
      },
    });
  }

  private async dispatchExecution(
    language: string,
    sourceCode: string,
    testCases: ExecutionTestCase[],
    options: { isSubmission?: boolean } = {},
  ): Promise<FullExecutionReport> {
    const lang = language.toLowerCase().trim();
    if (lang === 'java') {
      return this.javaExecutionService.executeJavaCode(sourceCode, testCases, options);
    } else if (lang === 'python') {
      return this.pythonExecutionService.executePythonCode(sourceCode, testCases, options);
    } else if (lang === 'c') {
      return this.cExecutionService.executeCCode(sourceCode, testCases, options);
    } else if (lang === 'c++' || lang === 'cpp') {
      return this.cppExecutionService.executeCppCode(sourceCode, testCases, options);
    } else if (lang === 'javascript' || lang === 'js') {
      return this.javaScriptExecutionService.executeJavaScriptCode(sourceCode, testCases, options);
    } else if (lang === 'typescript' || lang === 'ts') {
      return this.typeScriptExecutionService.executeTypeScriptCode(sourceCode, testCases, options);
    } else {
      throw new BadRequestException(`Language '${language}' is not supported for execution yet.`);
    }
  }

  /**
   * Run code against VISIBLE test cases only (Do NOT save submission)
   */
  async runAssessment(id: string, userId: string, dto: RunAssessmentDto) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        testCases: {
          where: { isHidden: false },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID '${id}' not found.`);
    }

    if (assessment.testCases.length === 0) {
      throw new BadRequestException('No visible test cases available for this assessment.');
    }

    const executionTestCases: ExecutionTestCase[] = assessment.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: false,
      marks: tc.marks,
    }));

    const report = await this.dispatchExecution(dto.language, dto.sourceCode, executionTestCases);

    return {
      status: report.status,
      compilerMessage: report.compilerMessage,
      passedTests: report.passedTests,
      totalTests: report.totalTests,
      results: report.results.map((r, idx) => {
        const tc = assessment.testCases.find((t) => t.id === r.testCaseId);
        return {
          testCaseNumber: idx + 1,
          testCaseId: r.testCaseId,
          status: r.status,
          input: tc?.input || '',
          expectedOutput: tc?.expectedOutput || '',
          actualOutput: r.actualOutput,
          executionTime: r.executionTime,
          message: r.errorMessage || (r.status === 'Passed' ? 'Passed' : 'Failed'),
        };
      }),
    };
  }

  /**
   * Submit code against ALL test cases (visible & hidden) and save submission + test case results
   */
  async submitAssessment(id: string, userId: string, dto: RunAssessmentDto) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
      include: {
        testCases: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID '${id}' not found.`);
    }

    const executionTestCases: ExecutionTestCase[] = assessment.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: tc.isHidden,
      marks: tc.marks,
    }));

    const report = await this.dispatchExecution(dto.language, dto.sourceCode, executionTestCases, {
      isSubmission: true,
    });

    let calculatedScore = 0;
    assessment.testCases.forEach((tc) => {
      const res = report.results.find((r) => r.testCaseId === tc.id);
      if (res && res.status === 'Passed') {
        calculatedScore += tc.marks;
      }
    });

    if (report.passedTests === report.totalTests && report.totalTests > 0) {
      calculatedScore = assessment.totalMarks;
    }

    const submission = await this.prisma.assessmentSubmission.create({
      data: {
        assessmentId: id,
        userId,
        language: dto.language,
        sourceCode: dto.sourceCode,
        status: report.status,
        score: calculatedScore,
        passedTests: report.passedTests,
        totalTests: report.totalTests,
        executionTime: report.totalExecutionTime,
        compilerMessage: report.compilerMessage,
        testCaseResults: {
          create: report.results.map((r) => ({
            testCaseId: r.testCaseId,
            status: r.status,
            actualOutput: r.actualOutput,
            executionTime: r.executionTime,
            errorMessage: r.errorMessage,
          })),
        },
      },
      include: {
        testCaseResults: true,
      },
    });

    const timesSubmitted = await this.prisma.assessmentSubmission.count({
      where: { assessmentId: id, userId },
    });

    const sanitizedResults = report.results.map((r, idx) => {
      const tc = assessment.testCases.find((t) => t.id === r.testCaseId);
      const isHidden = tc?.isHidden ?? false;

      return {
        testCaseNumber: idx + 1,
        testCaseId: r.testCaseId,
        isHidden,
        status: r.status,
        input: isHidden ? null : tc?.input || null,
        expectedOutput: isHidden ? null : tc?.expectedOutput || null,
        actualOutput: isHidden ? null : r.actualOutput,
        executionTime: r.executionTime,
        message: r.errorMessage || (r.status === 'Passed' ? 'Passed' : 'Failed'),
      };
    });

    return {
      submissionId: submission.id,
      assessmentId: id,
      status: submission.status,
      score: submission.score,
      totalMarks: assessment.totalMarks,
      passedTests: submission.passedTests,
      totalTests: submission.totalTests,
      executionTime: submission.executionTime,
      compilerMessage: submission.compilerMessage,
      timesSubmitted,
      createdAt: submission.createdAt,
      results: sanitizedResults,
    };
  }
}
