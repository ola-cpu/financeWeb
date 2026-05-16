import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id }, relations: ['assets', 'transactions'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async calculateBabylonianHealth(userId: number) {
    const user = await this.findOne(userId);
    if (!user) throw new Error('User not found');

    const monthlyIncome = user.monthlyIncome;
    const recommendedSavings = monthlyIncome * 0.1; // 10% rule

    const recentTransactions = user.transactions || [];
    const monthlyExpenses = recentTransactions
      .filter(t => t.type === 'expense' && this.isFromCurrentMonth(t.date))
      .reduce((sum, t) => sum + t.amount, 0);

    const actualSavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (actualSavings / monthlyIncome) * 100 : 0;

    return {
      monthlyIncome,
      recommendedSavings,
      actualSavings,
      savingsRate,
      isBabylonianCompliant: actualSavings >= recommendedSavings,
      message: actualSavings >= recommendedSavings
        ? "You are following the first law of Babylon: 'A part of all you earn is yours to keep.'"
        : "Try to save at least 10% of your income as the wise men of Babylon advised."
    };
  }

  private isFromCurrentMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
}
