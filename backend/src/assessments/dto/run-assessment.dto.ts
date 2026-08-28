import { IsString, IsNotEmpty } from 'class-validator';

export class RunAssessmentDto {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  sourceCode: string;
}
