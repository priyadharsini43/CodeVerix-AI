import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AssessmentsController } from './assessments.controller';
import { AssessmentsService } from './assessments.service';
import { JavaExecutionService } from './execution/java-execution.service';
import { PythonExecutionService } from './execution/python-execution.service';
import { CExecutionService } from './execution/c-execution.service';
import { CppExecutionService } from './execution/cpp-execution.service';
import { JavaScriptExecutionService } from './execution/javascript-execution.service';
import { TypeScriptExecutionService } from './execution/typescript-execution.service';

@Module({
  imports: [PrismaModule],
  controllers: [AssessmentsController],
  providers: [
    AssessmentsService,
    JavaExecutionService,
    PythonExecutionService,
    CExecutionService,
    CppExecutionService,
    JavaScriptExecutionService,
    TypeScriptExecutionService,
  ],
  exports: [
    AssessmentsService,
    JavaExecutionService,
    PythonExecutionService,
    CExecutionService,
    CppExecutionService,
    JavaScriptExecutionService,
    TypeScriptExecutionService,
  ],
})
export class AssessmentsModule {}
