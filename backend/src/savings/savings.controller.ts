import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsGoal } from './entities/savings-goal.entity';

@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  create(@Body() goalData: Partial<SavingsGoal>) {
    return this.savingsService.create(goalData);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.savingsService.findAllByUserId(+userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() goalData: Partial<SavingsGoal>) {
    return this.savingsService.update(+id, goalData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingsService.remove(+id);
  }

  @Post(':id/deposit')
  deposit(@Param('id') id: string, @Body('amount') amount: number) {
    return this.savingsService.deposit(+id, amount);
  }

  @Post(':id/withdraw')
  withdraw(@Param('id') id: string, @Body('amount') amount: number) {
    return this.savingsService.withdraw(+id, amount);
  }

  @Post(':id/calculate-interests')
  calculateInterests(@Param('id') id: string) {
    return this.savingsService.calculateInterests(+id);
  }
}
