import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum SavingsGoalType {
  VOITURE = 'voiture',
  MAISON = 'maison',
  URGENCE = 'urgence',
  RETRAITE = 'retraite',
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

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
