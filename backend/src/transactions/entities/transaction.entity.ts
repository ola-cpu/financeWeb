import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  INVESTMENT = 'investment',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({ type: 'float' })
  amount: number;

  @Column({
    type: 'varchar',
  })
  type: TransactionType;

  @Column({ nullable: true })
  category: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @CreateDateColumn()
  date: Date;
}
