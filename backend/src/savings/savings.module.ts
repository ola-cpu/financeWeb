import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavingsGoal } from './entities/savings-goal.entity';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SavingsGoal])],
  providers: [SavingsService],
  controllers: [SavingsController],
  exports: [SavingsService],
})
export class SavingsModule {}
