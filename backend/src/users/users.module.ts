import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Badge } from './entities/badge.entity';
import { Asset } from '../assets/entities/asset.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { SavingsGoal } from '../savings/entities/savings-goal.entity';
import { Budget } from '../budget/entities/budget.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GamificationService } from './gamification.service';
import { GamificationController } from './gamification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Badge, Asset, Transaction, SavingsGoal, Budget])],
  providers: [UsersService, GamificationService],
  controllers: [UsersController, GamificationController],
  exports: [UsersService, GamificationService],
})
export class UsersModule {}
