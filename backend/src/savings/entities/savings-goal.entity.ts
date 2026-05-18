import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SavingsGoalType {
  EMERGENCY_FUND = 'emergency_fund',
  INVESTMENT = 'investment',
  PURCHASE = 'purchase',
  RETIREMENT = 'retirement',
  OTHER = 'other',
}

@Entity('savings_goals')
export class SavingsGoal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
  })
  type: SavingsGoalType;

  @Column({ type: 'float' })
  targetAmount: number;

  @Column({ type: 'float', default: 0 })
  currentAmount: number;

  @Column({ type: 'float', default: 0 })
  interestRate: number; // Annual percentage

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
