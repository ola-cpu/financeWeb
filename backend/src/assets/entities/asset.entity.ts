import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AssetType {
  CASH = 'cash',
  SAVINGS = 'savings',
  STOCKS = 'stocks',
  ETF = 'etf',
  CRYPTO = 'crypto',
  REAL_ESTATE = 'real_estate',
  BUSINESS = 'business',
  PRECIOUS_METALS = 'precious_metals',
  INVESTMENT_FUNDS = 'investment_funds',
}

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
  })
  type: AssetType;

  @Column({ type: 'float' })
  value: number;

  @Column({ type: 'float', default: 0 })
  expectedYield: number; // Annual percentage

  @Column({ type: 'int', default: 1 })
  riskLevel: number; // 1 (low) to 10 (high)

  @ManyToOne(() => User, (user) => user.assets)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
