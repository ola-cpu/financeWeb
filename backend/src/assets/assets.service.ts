import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asset } from './entities/asset.entity';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
  ) {}

  async create(assetData: Partial<Asset>): Promise<Asset> {
    const asset = this.assetsRepository.create(assetData);
    return this.assetsRepository.save(asset);
  }

  async findAllByUserId(userId: number): Promise<Asset[]> {
    return this.assetsRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number): Promise<Asset | null> {
    return this.assetsRepository.findOne({ where: { id } });
  }

  async update(id: number, assetData: Partial<Asset>): Promise<Asset | null> {
    await this.assetsRepository.update(id, assetData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
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

    return {
      currentNetWorth: netWorth,
      fireNumber,
      progress,
      isFireReached: netWorth >= fireNumber,
    };
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
