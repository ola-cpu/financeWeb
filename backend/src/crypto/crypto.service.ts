import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoAsset } from './entities/crypto-asset.entity';

@Injectable()
export class CryptoService {
  constructor(
    @InjectRepository(CryptoAsset)
    private cryptoRepository: Repository<CryptoAsset>,
  ) {}

  async create(cryptoData: Partial<CryptoAsset>): Promise<CryptoAsset> {
    const crypto = this.cryptoRepository.create(cryptoData);
    return this.cryptoRepository.save(crypto);
  }

  async findAllByUserId(userId: number): Promise<CryptoAsset[]> {
    return this.cryptoRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: number, cryptoData: Partial<CryptoAsset>): Promise<CryptoAsset | null> {
    await this.cryptoRepository.update(id, cryptoData);
    return this.cryptoRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.cryptoRepository.delete(id);
  }

  async getPortfolioValue(userId: number) {
    const cryptos = await this.findAllByUserId(userId);

    // Mocking current price as 1.2x purchase price for demo purposes
    // In a real app, this would call a crypto price API
    return cryptos.map((c) => {
      const currentPrice = c.purchasePrice * 1.2;
      const currentValue = c.quantity * currentPrice;
      const profitLoss = currentValue - (c.quantity * c.purchasePrice);
      const profitLossPercentage = ((currentPrice - c.purchasePrice) / c.purchasePrice) * 100;

      return {
        ...c,
        currentPrice,
        currentValue,
        profitLoss,
        profitLossPercentage,
      };
    });
  }
}
