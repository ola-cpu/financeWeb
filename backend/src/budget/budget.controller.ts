import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { Budget } from './entities/budget.entity';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Body() budgetData: Partial<Budget>) {
    return this.budgetService.create(budgetData);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.budgetService.findAllByUserId(+userId);
  }

  @Get('status')
  getStatus(
    @Query('userId') userId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.budgetService.getBudgetStatus(+userId, +month, +year);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() budgetData: Partial<Budget>) {
    return this.budgetService.update(+id, budgetData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetService.remove(+id);
  }
}
