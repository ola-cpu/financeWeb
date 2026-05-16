import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() transactionData: Partial<Transaction>) {
    return this.transactionsService.create(transactionData);
  }

  @Get('user/:userId')
  findAll(@Param('userId') userId: string) {
    return this.transactionsService.findAllByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() transactionData: Partial<Transaction>) {
    return this.transactionsService.update(+id, transactionData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }

  @Get('user/:userId/categorization')
  getCategorization(@Param('userId') userId: string) {
    return this.transactionsService.getExpenseCategorization(+userId);
  }
}
