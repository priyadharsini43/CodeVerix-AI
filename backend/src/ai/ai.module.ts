import { Module } from '@nestjs/common';
import { GeminiProvider } from './gemini.provider';
import { AI_PROVIDER } from './ai-provider.interface';

@Module({
  providers: [
    {
      provide: AI_PROVIDER,
      useClass: GeminiProvider,
    },
  ],
  exports: [AI_PROVIDER],
})
export class AIModule {}
