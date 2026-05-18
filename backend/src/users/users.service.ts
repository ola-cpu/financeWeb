import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from './entities/user.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Transaction, TransactionType } from '../transactions/entities/transaction.entity';
import { SavingsGoal } from '../savings/entities/savings-goal.entity';
import { Budget } from '../budget/entities/budget.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Asset)
    private assetsRepository: Repository<Asset>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(SavingsGoal)
    private savingsGoalRepository: Repository<SavingsGoal>,
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
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

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const transactions = await this.transactionsRepository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
    });

    const monthlyIncome = user?.monthlyIncome || transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const actualSavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? (actualSavings / monthlyIncome) * 100 : 0;
    const recommendedSavings = monthlyIncome * 0.1;

    // Rules logic
    const rulesStatus = [
      { id: 1, name: "Save 10%", completed: savingsRate >= 10 },
      { id: 2, name: "Control Expenses", completed: monthlyExpenses < monthlyIncome * 0.9 },
      { id: 3, name: "Make Gold Multiply", completed: (await this.assetsRepository.count({ where: { user: { id: userId } } })) > 0 },
      { id: 4, name: "Protect Treasure", completed: true }, // Placeholder
      { id: 5, name: "Own Your Home", completed: false }, // Placeholder
      { id: 6, name: "Ensure Future Income", completed: false }, // Placeholder
      { id: 7, name: "Increase Earning Capacity", completed: monthlyIncome > 0 }
    ];

    const score = (rulesStatus.filter(r => r.completed).length / rulesStatus.length) * 100;

    return {
      monthlyIncome,
      monthlyExpenses,
      recommendedSavings,
      actualSavings,
      savingsRate,
      score,
      rulesStatus,
      isBabylonianCompliant: savingsRate >= 10,
    };
  }

  async getDashboardSummary(userId: number) {
    const user = await this.findOne(userId);

    const assets = await this.assetsRepository.find({ where: { user: { id: userId } } });
    const netWorth = assets.reduce((sum, a) => sum + a.value, 0);

    const health = await this.calculateBabylonianHealth(userId);

    const savingsGoals = await this.savingsGoalRepository.find({ where: { user: { id: userId } } });
    const totalSavings = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

    const now = new Date();
    const budgets = await this.budgetRepository.find({
      where: { user: { id: userId }, month: now.getMonth() + 1, year: now.getFullYear() }
    });

    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const transactions = await this.transactionsRepository.find({
      where: { user: { id: userId }, date: Between(startDate, endDate) }
    });

    const totalBudgetPlanned = budgets.reduce((sum, b) => sum + b.amount, 0);
    const totalSpent = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    const budgetRemaining = Math.max(0, totalBudgetPlanned - totalSpent);

    const passiveIncomeTypes = ['passive_income', 'dividends', 'immobilier', 'revenus_passifs'];
    const passiveIncome = transactions
      .filter(t => passiveIncomeTypes.includes(t.type))
      .reduce((sum, t) => sum + t.amount, 0);

    // Chart Data
    const incomeVsExpense = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

      const monthTrans = await this.transactionsRepository.find({
        where: { user: { id: userId }, date: Between(start, end) }
      });

      incomeVsExpense.push({
        name: d.toLocaleString('default', { month: 'short' }),
        income: monthTrans.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0),
        expense: monthTrans.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0),
      });
    }

    const assetAllocation = assets.reduce((acc: any[], a) => {
      const existing = acc.find(item => item.name === a.type);
      if (existing) {
        existing.value += a.value;
      } else {
        acc.push({ name: a.type, value: a.value });
      }
      return acc;
    }, []);

    return {
      netWorth,
      monthlyChange: "+0%", // Simple placeholder
      healthScore: health.score,
      totalSavings,
      budgetRemaining,
      passiveIncome,
      savingsRate: health.savingsRate,
      rulesStatus: health.rulesStatus,
      charts: {
        incomeVsExpense,
        assetAllocation,
        wealthProgression: incomeVsExpense.map(d => ({ name: d.name, value: netWorth })) // Placeholder
      }
    };
  }

  private isFromCurrentMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
}
