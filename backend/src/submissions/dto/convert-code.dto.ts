import { IsString, IsNotEmpty } from 'class-validator';

export class ConvertCodeDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  sourceLanguage: string;

  @IsString()
  @IsNotEmpty()
  targetLanguage: string;

  @IsString()
  @IsNotEmpty()
  sourceCode: string;
}
