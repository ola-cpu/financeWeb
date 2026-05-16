import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { GamificationService } from '../users/gamification.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private gamificationService: GamificationService,
  ) {}

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = await this.transactionsRepository.save(this.transactionsRepository.create(transactionData));

    if (transaction.user) {
      const userId = typeof transaction.user === 'number' ? transaction.user : transaction.user.id;
      await this.gamificationService.addXP(userId, 10);
      await this.gamificationService.checkAndAwardBadges(userId);
    }

    return transaction;
  }

  async findAllByUserId(userId: number): Promise<Transaction[]> {
    return this.transactionsRepository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Transaction | null> {
    return this.transactionsRepository.findOne({ where: { id } });
  }

  async update(id: number, transactionData: Partial<Transaction>): Promise<Transaction | null> {
    await this.transactionsRepository.update(id, transactionData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.transactionsRepository.delete(id);
  }

  async getExpenseCategorization(userId: number) {
    const transactions = await this.transactionsRepository.find({
      where: { user: { id: userId }, type: TransactionType.EXPENSE },
    });

    const categories = transactions.reduce((acc, t) => {
      acc[t.category || 'Other'] = (acc[t.category || 'Other'] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }
}
