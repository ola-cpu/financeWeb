import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Tontine } from './tontine.entity';

@Entity('tontine_members')
export class TontineMember {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: 0 })
  position: number; // For rotation

  @Column({ default: false })
  hasReceivedPayout: boolean;

  @ManyToOne(() => Tontine, (tontine) => tontine.members)
  tontine: Tontine;

  @CreateDateColumn()
  joinedAt: Date;
}
