import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Asset } from '../../assets/entities/asset.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'float', default: 0 })
  monthlyIncome: number;

  @Column({ type: 'float', default: 10 })
  savingsRate: number; // Percentage, inspired by Richest Man in Babylon (min 10%)

  @OneToMany(() => Asset, (asset: Asset) => asset.user)
  assets: Asset[];

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.user)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
