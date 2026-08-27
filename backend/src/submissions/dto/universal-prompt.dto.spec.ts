import { validate } from 'class-validator';
import { UniversalPromptDto } from './universal-prompt.dto';

describe('UniversalPromptDto', () => {
  it('should pass validation with valid data', async () => {
    const dto = new UniversalPromptDto();
    dto.projectId = 'proj-123';
    dto.prompt = 'Fix this code';
    dto.language = 'java';
    dto.sourceCode = 'public class Main {}';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation without optional sourceCode', async () => {
    const dto = new UniversalPromptDto();
    dto.projectId = 'proj-123';
    dto.prompt = 'General question';
    dto.language = 'python';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation when prompt is missing (empty string)', async () => {
    const dto = new UniversalPromptDto();
    dto.projectId = 'proj-123';
    dto.prompt = ''; // Empty string
    dto.language = 'java';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('prompt');
  });

  it('should fail validation when language is missing', async () => {
    const dto = new UniversalPromptDto();
    dto.projectId = 'proj-123';
    dto.prompt = 'Fix this';
    
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toEqual('language');
  });
});
