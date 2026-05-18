import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AssetType {
  CASH = 'CASH',
  SAVINGS = 'SAVINGS',
  STOCKS = 'STOCKS',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO',
  REAL_ESTATE = 'REAL_ESTATE',
  BUSINESS = 'BUSINESS',
  PRECIOUS_METALS = 'PRECIOUS_METALS',
  INVESTMENT_FUNDS = 'INVESTMENT_FUNDS',
  BONDS = 'BONDS',
  GOLD = 'GOLD',
  MOBILE_MONEY = 'MOBILE_MONEY',
  TONTINE = 'TONTINE',
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
