import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsGoal } from './entities/savings-goal.entity';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsGoal, User])],
  providers: [SavingsService],
  controllers: [SavingsController],
  exports: [SavingsService],
})
export class SavingsModule {}
