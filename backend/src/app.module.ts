import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { AnalyzerModule } from './analyzer/analyzer.module';
import { AIModule } from './ai/ai.module';
import { FixerModule } from './fixer/fixer.module';
import { HistoryModule } from './history/history.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    SubmissionsModule,
    AnalyzerModule,
    AIModule,
    FixerModule,
    HistoryModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
