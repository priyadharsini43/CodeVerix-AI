import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { UniversalPromptDto } from './dto/universal-prompt.dto';
import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

describe('SubmissionsController', () => {
  let controller: SubmissionsController;
  let service: SubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionsController],
      providers: [
        {
          provide: SubmissionsService,
          useValue: {
            processUniversalPrompt: jest.fn(),
            analyzeAndSave: jest.fn(),
            getSubmissionsForUser: jest.fn(),
            getSubmissionById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<SubmissionsController>(SubmissionsController);
    service = module.get<SubmissionsService>(SubmissionsService);
  });

  it('should define the controller', () => {
    expect(controller).toBeDefined();
  });

  describe('processPrompt', () => {
    it('should call submissionsService.processUniversalPrompt with correct arguments', async () => {
      const mockUser = { userId: 'user-1', email: 'user@test.com', name: 'Test User' };
      const dto: UniversalPromptDto = {
        prompt: 'Explain this',
        language: 'python',
        projectId: 'proj-123',
      };

      const expectedResult = { intent: 'explain', language: 'python' };
      jest.spyOn(service, 'processUniversalPrompt').mockResolvedValue(expectedResult as any);

      const result = await controller.processPrompt(mockUser, dto);
      expect(service.processUniversalPrompt).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
