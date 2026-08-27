import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { SUPPORTED_LANGUAGES } from './create-project.dto';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Project name must be under 100 characters' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must be under 500 characters' })
  description?: string;

  @IsString()
  @IsOptional()
  @IsIn(SUPPORTED_LANGUAGES as any, {
    message: 'Default language must be one of: Python, Java, C, C++, JavaScript, TypeScript',
  })
  defaultLanguage?: string;
}
