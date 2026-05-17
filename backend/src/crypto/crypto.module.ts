import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoAsset } from './entities/crypto-asset.entity';
import { CryptoService } from './crypto.service';
import { CryptoController } from './crypto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CryptoAsset])],
  providers: [CryptoService],
  controllers: [CryptoController],
  exports: [CryptoService],
})
export class CryptoModule {}
