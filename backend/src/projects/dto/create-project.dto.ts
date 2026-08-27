import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export const SUPPORTED_LANGUAGES = ['Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name is required' })
  @MaxLength(100, { message: 'Project name must be under 100 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must be under 500 characters' })
  description?: string;

  @IsString()
  @IsNotEmpty({ message: 'Default language is required' })
  @IsIn(SUPPORTED_LANGUAGES as any, {
    message: 'Default language must be one of: Python, Java, C, C++, JavaScript, TypeScript',
  })
  defaultLanguage: string;
}
