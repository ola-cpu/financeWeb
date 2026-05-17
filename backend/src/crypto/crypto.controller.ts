import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { CryptoAsset } from './entities/crypto-asset.entity';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post()
  create(@Body() cryptoData: Partial<CryptoAsset>) {
    return this.cryptoService.create(cryptoData);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.cryptoService.findAllByUserId(+userId);
  }

  @Get('portfolio')
  getPortfolio(@Query('userId') userId: string) {
    return this.cryptoService.getPortfolioValue(+userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() cryptoData: Partial<CryptoAsset>) {
    return this.cryptoService.update(+id, cryptoData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cryptoService.remove(+id);
  }
}
