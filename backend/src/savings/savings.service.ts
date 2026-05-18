import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsGoal } from './entities/savings-goal.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(SavingsGoal)
    private savingsGoalRepository: Repository<SavingsGoal>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(goalData: Partial<SavingsGoal>): Promise<SavingsGoal> {
    if (goalData.user) {
      const userId = typeof goalData.user === 'number' ? goalData.user : goalData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }
    const goal = this.savingsGoalRepository.create(goalData);
    return this.savingsGoalRepository.save(goal);
  }

  async findAllByUserId(userId: number): Promise<SavingsGoal[]> {
    return this.savingsGoalRepository.find({ where: { user: { id: userId } } });
  }

  async update(id: number, goalData: Partial<SavingsGoal>): Promise<SavingsGoal> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Savings goal with ID ${id} not found`);
    }
    if (goalData.user) {
      const userId = typeof goalData.user === 'number' ? goalData.user : goalData.user.id;
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
    }
    await this.savingsGoalRepository.update(id, goalData);
    const updated = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!updated) {
      throw new NotFoundException(`Savings goal with ID ${id} not found after update`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Savings goal with ID ${id} not found`);
    }
    await this.savingsGoalRepository.delete(id);
  }

  async deposit(id: number, amount: number): Promise<SavingsGoal> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Savings goal with ID ${id} not found`);
    }
    goal.currentAmount += amount;
    return this.savingsGoalRepository.save(goal);
  }

  async withdraw(id: number, amount: number): Promise<SavingsGoal> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Savings goal with ID ${id} not found`);
    }
    goal.currentAmount -= amount;
    return this.savingsGoalRepository.save(goal);
  }

  async calculateInterests(id: number): Promise<SavingsGoal> {
    const goal = await this.savingsGoalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Savings goal with ID ${id} not found`);
    }
    if (goal.interestRate <= 0) return goal;

    // Simple monthly interest calculation: (current * rate / 100) / 12
    const monthlyInterest = (goal.currentAmount * (goal.interestRate / 100)) / 12;
    goal.currentAmount += monthlyInterest;

    return this.savingsGoalRepository.save(goal);
  }
}
