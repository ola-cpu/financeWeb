import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Budget } from './entities/budget.entity';
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(budgetData: Partial<Budget>): Promise<Budget> {
    if (budgetData.user) {
      const userId = typeof budgetData.user === 'number' ? budgetData.user : budgetData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }
    }
    const budget = this.budgetRepository.create(budgetData);
    return this.budgetRepository.save(budget);
  }

  async findAllByUserId(userId: number): Promise<Budget[]> {
    return this.budgetRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: number, budgetData: Partial<Budget>): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
    if (budgetData.user) {
      const userId = typeof budgetData.user === 'number' ? budgetData.user : budgetData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException(`User with ID ${userId} not found`);
      }
    }
    await this.budgetRepository.update(id, budgetData);
    const updated = await this.budgetRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Budget with ID ${id} not found after update`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const budget = await this.budgetRepository.findOne({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }
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
