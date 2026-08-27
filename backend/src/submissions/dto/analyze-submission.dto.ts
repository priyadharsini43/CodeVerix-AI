import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '../../projects/dto/create-project.dto';

export class AnalyzeSubmissionDto {
  @IsString()
  @IsNotEmpty({ message: 'ProjectId is required' })
  projectId: string;

  @IsString()
  @IsNotEmpty({ message: 'Language is required' })
  @IsIn(SUPPORTED_LANGUAGES as any, {
    message: 'Language must be one of: Python, Java, C, C++, JavaScript, TypeScript',
  })
  language: string;

  @IsString()
  @IsNotEmpty({ message: 'Source code cannot be empty' })
  sourceCode: string;
}
