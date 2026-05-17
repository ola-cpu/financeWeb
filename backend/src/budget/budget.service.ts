import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(budgetData: Partial<Budget>): Promise<Budget> {
    const budget = this.budgetRepository.create(budgetData);
    return this.budgetRepository.save(budget);
  }

  async findAllByUserId(userId: number): Promise<Budget[]> {
    return this.budgetRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: number, budgetData: Partial<Budget>): Promise<Budget | null> {
    await this.budgetRepository.update(id, budgetData);
    return this.budgetRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.budgetRepository.delete(id);
  }

  async getBudgetStatus(userId: number, month: number, year: number) {
    const budgets = await this.budgetRepository.find({
      where: { user: { id: userId }, month, year },
    });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await this.transactionRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
    });

    return budgets.map((budget) => {
      const spent = transactions
        .filter((t) => t.category === budget.category || (t.type as string) === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        category: budget.category,
        planned: budget.amount,
        actual: spent,
        remaining: budget.amount - spent,
        percentage: budget.amount > 0 ? (spent / budget.amount) * 100 : 0,
      };
    });
  }
}
