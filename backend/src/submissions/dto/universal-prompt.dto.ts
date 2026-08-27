import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UniversalPromptDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsOptional()
  sourceCode?: string;
}
