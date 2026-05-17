import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TontineMember } from './tontine-member.entity';

@Entity('tontines')
export class Tontine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float' })
  contributionAmount: number;

  @Column()
  frequency: string; // weekly, monthly

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => TontineMember, (member) => member.tontine)
  members: TontineMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
