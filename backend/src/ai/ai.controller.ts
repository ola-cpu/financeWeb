import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('advice')
  getAdvice(@Body() body: { userData: any; userQuestion: string }) {
    return this.aiService.getFinancialAdvice(body.userData, body.userQuestion);
  }

  @Post('analyze-habits')
  analyzeHabits(@Body() body: { transactions: any[] }) {
    return this.aiService.analyzeHabits(body.transactions);
  }

  @Post('psychological-advice')
  getPsychologicalAdvice(@Body() body: { userData: any }) {
    return this.aiService.getPsychologicalAdvice(body.userData);
  }

  @Post('analyze-expenses')
  analyzeExpenses(@Body() body: { transactions: any[] }) {
    return this.aiService.analyzeExpenses(body.transactions);
  }

  @Post('budget-alerts')
  getBudgetAlerts(@Body() body: { budgetStatus: any[] }) {
    return this.aiService.getBudgetAlerts(body.budgetStatus);
  }
}
