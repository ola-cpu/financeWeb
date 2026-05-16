import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset } from './entities/asset.entity';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  create(@Body() assetData: Partial<Asset>) {
    return this.assetsService.create(assetData);
  }

  @Get('user/:userId')
  findAll(@Param('userId') userId: string) {
    return this.assetsService.findAllByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assetsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() assetData: Partial<Asset>) {
    return this.assetsService.update(+id, assetData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assetsService.remove(+id);
  }

  @Get('user/:userId/net-worth')
  getNetWorth(@Param('userId') userId: string) {
    return this.assetsService.calculateNetWorth(+userId);
  }

  @Post('user/:userId/fire-status')
  getFIREStatus(@Param('userId') userId: string, @Body('annualExpenses') annualExpenses: number) {
    return this.assetsService.calculateFIREStatus(+userId, annualExpenses);
  }

  @Post('simulate-dca')
  simulateDCA(
    @Body() body: { initialAmount: number; monthlyContribution: number; annualReturn: number; years: number }
  ) {
    return this.assetsService.simulateDCA(body.initialAmount, body.monthlyContribution, body.annualReturn, body.years);
  }
}
