import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('badges')
export class Badge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  icon: string; // Icon name from lucide-react

  @Column({ unique: true })
  code: string; // Unique identifier for logical checks (e.g., 'SAVER_LEVEL_1')

  @ManyToMany(() => User, (user: User) => user.badges)
  users: User[];
}
