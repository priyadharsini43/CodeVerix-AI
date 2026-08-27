import { Controller, Get, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, UserPayload } from '../common/decorators/current-user.decorator';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('dashboard')
  async getDashboardStats(@CurrentUser() user: UserPayload) {
    return this.historyService.getUserDashboardStats(user.userId);
  }
}
