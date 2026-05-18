import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(assetData: Partial<Asset>): Promise<Asset> {
    if (assetData.user) {
      const userId = typeof assetData.user === 'number' ? assetData.user : assetData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }
    const asset = this.assetsRepository.create(assetData);
    return this.assetsRepository.save(asset);
  }

  async findAllByUserId(userId: number): Promise<Asset[]> {
    return this.assetsRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    return asset;
  }

  async update(id: number, assetData: Partial<Asset>): Promise<Asset> {
    const asset = await this.assetsRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    if (assetData.user) {
      const userId = typeof assetData.user === 'number' ? assetData.user : assetData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }
    await this.assetsRepository.update(id, assetData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const asset = await this.assetsRepository.findOne({ where: { id } });
    if (!asset) {
      throw new NotFoundException(`Asset with ID ${id} not found`);
    }
    await this.assetsRepository.delete(id);
  }

  async calculateNetWorth(userId: number): Promise<number> {
    const assets = await this.findAllByUserId(userId);
    return assets.reduce((sum, asset) => sum + asset.value, 0);
  }

  async calculateFIREStatus(userId: number, annualExpenses: number) {
    const netWorth = await this.calculateNetWorth(userId);
    const fireNumber = annualExpenses * 25; // 4% rule
    const progress = (netWorth / fireNumber) * 100;

    const safeWithdrawalRate = 0.04;
    const requiredPassiveIncome = annualExpenses / 12;

    // Estimate retirement age (simple calculation)
    const user = await this.assetsRepository.manager.findOne('User', { where: { id: userId } }) as any;
    const monthlySavings = (user?.monthlyIncome || 0) * ((user?.savingsRate || 0) / 100);
    const monthsToFIRE = monthlySavings > 0 ? (fireNumber - netWorth) / monthlySavings : Infinity;

    return {
      currentNetWorth: netWorth,
      fireNumber,
      progress,
      isFireReached: netWorth >= fireNumber,
      requiredPassiveIncome,
      safeWithdrawalRate,
      estimatedMonthsToRetire: monthsToFIRE !== Infinity ? Math.round(monthsToFIRE) : 'N/A',
    };
  }

  async getOptimalAllocation(userId: number) {
    const user = await this.assetsRepository.manager.findOne('User', { where: { id: userId } }) as any;
    const riskLevel = user?.riskLevel || 5; // 1-10

    // Simplified optimal allocation logic
    let allocation;
    if (riskLevel <= 3) {
      allocation = [
        { type: 'Bonds', value: 50 },
        { type: 'ETF', value: 30 },
        { type: 'Cash', value: 20 },
      ];
    } else if (riskLevel <= 7) {
      allocation = [
        { type: 'Stocks', value: 40 },
        { type: 'ETF', value: 30 },
        { type: 'Real Estate', value: 20 },
        { type: 'Bonds', value: 10 },
      ];
    } else {
      allocation = [
        { type: 'Stocks', value: 40 },
        { type: 'Crypto', value: 20 },
        { type: 'Business', value: 20 },
        { type: 'Real Estate', value: 15 },
        { type: 'Cash', value: 5 },
      ];
    }

    return allocation;
  }

  async simulateDCA(initialAmount: number, monthlyContribution: number, annualReturn: number, years: number) {
    let total = initialAmount;
    const monthlyReturn = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
    const months = years * 12;
    const history = [];

    for (let i = 1; i <= months; i++) {
      total = total * (1 + monthlyReturn) + monthlyContribution;
      if (i % 12 === 0) {
        history.push({ year: i / 12, value: Math.round(total) });
      }
    }

    return {
      finalValue: Math.round(total),
      totalInvested: initialAmount + (monthlyContribution * months),
      gain: Math.round(total - (initialAmount + (monthlyContribution * months))),
      history,
    };
  }
}
