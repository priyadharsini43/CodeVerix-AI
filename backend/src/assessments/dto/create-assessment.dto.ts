import { IsString, IsNotEmpty, IsOptional, IsInt, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTestCaseDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  expectedOutput: string;

  @IsBoolean()
  @IsOptional()
  isHidden?: boolean;

  @IsInt()
  @IsOptional()
  marks?: number;
}

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsOptional()
  questionType?: string;

  @IsInt()
  @IsOptional()
  totalMarks?: number;

  @IsString()
  @IsOptional()
  allowedLanguages?: string;

  @IsOptional()
  starterCode?: Record<string, string>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTestCaseDto)
  testCases: CreateTestCaseDto[];
}
