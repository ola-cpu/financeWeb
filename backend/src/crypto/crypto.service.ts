import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoAsset } from './entities/crypto-asset.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CryptoService {
  constructor(
    @InjectRepository(CryptoAsset)
    private cryptoRepository: Repository<CryptoAsset>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(cryptoData: Partial<CryptoAsset>): Promise<CryptoAsset> {
    if (cryptoData.user) {
      const userId = typeof cryptoData.user === 'number' ? cryptoData.user : cryptoData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }
    const crypto = this.cryptoRepository.create(cryptoData);
    return this.cryptoRepository.save(crypto);
  }

  async findAllByUserId(userId: number): Promise<CryptoAsset[]> {
    return this.cryptoRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: number, cryptoData: Partial<CryptoAsset>): Promise<CryptoAsset> {
    const crypto = await this.cryptoRepository.findOne({ where: { id } });
    if (!crypto) {
      throw new NotFoundException(`Crypto asset with ID ${id} not found`);
    }
    if (cryptoData.user) {
      const userId = typeof cryptoData.user === 'number' ? cryptoData.user : cryptoData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }
    await this.cryptoRepository.update(id, cryptoData);
    const updated = await this.cryptoRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Crypto asset with ID ${id} not found after update`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const crypto = await this.cryptoRepository.findOne({ where: { id } });
    if (!crypto) {
      throw new NotFoundException(`Crypto asset with ID ${id} not found`);
    }
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
