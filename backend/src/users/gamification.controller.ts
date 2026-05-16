import { Controller, Get, Post, Request } from '@nestjs/common';
import { GamificationService } from './gamification.service';

@Controller('gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('progress')
  async getProgress(@Request() req: any) {
    // In a production environment, we would use a proper AuthGuard
    // For now, let's use the user ID from the request if available, or default to 1
    const userId = req.user?.id || 1;
    return this.gamificationService.getProgress(userId);
  }

  @Post('check-badges')
  async checkBadges(@Request() req: any) {
    const userId = req.user?.id || 1;
    return this.gamificationService.checkAndAwardBadges(userId);
  }
}
