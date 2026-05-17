import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from './entities/savings-goal.entity';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private savingsGoalRepository: Repository<SavingsGoal>,
  ) {}

  async create(goalData: Partial<SavingsGoal>): Promise<SavingsGoal> {
    const goal = this.savingsGoalRepository.create(goalData);
    return this.savingsGoalRepository.save(goal);
  }

  async findAllByUserId(userId: number): Promise<SavingsGoal[]> {
    return this.savingsGoalRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: number, goalData: Partial<SavingsGoal>): Promise<SavingsGoal | null> {
    await this.savingsGoalRepository.update(id, goalData);
    return this.savingsGoalRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.savingsGoalRepository.delete(id);
  }

  async deposit(id: number, amount: number): Promise<SavingsGoal | null> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) return null;
    goal.currentAmount += amount;
    return this.savingsGoalRepository.save(goal);
  }

  async withdraw(id: number, amount: number): Promise<SavingsGoal | null> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) return null;
    goal.currentAmount -= amount;
    return this.savingsGoalRepository.save(goal);
  }

  async calculateInterests(id: number): Promise<SavingsGoal | null> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal || goal.interestRate <= 0) return goal;

    // Simple monthly interest calculation: (current * rate / 100) / 12
    const monthlyInterest = (goal.currentAmount * (goal.interestRate / 100)) / 12;
    goal.currentAmount += monthlyInterest;

    return this.savingsGoalRepository.save(goal);
  }
}
