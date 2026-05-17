import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { Asset } from './assets/entities/asset.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { Badge } from './users/entities/badge.entity';
import { BudgetModule } from './budget/budget.module';
import { SavingsModule } from './savings/savings.module';
import { TontinesModule } from './tontines/tontines.module';
import { CryptoModule } from './crypto/crypto.module';
import { Budget } from './budget/entities/budget.entity';
import { SavingsGoal } from './savings/entities/savings-goal.entity';
import { Tontine } from './tontines/entities/tontine.entity';
import { TontineMember } from './tontines/entities/tontine-member.entity';
import { CryptoAsset } from './crypto/entities/crypto-asset.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'babylon'),
        password: configService.get<string>('DB_PASSWORD', 'babylon'),
        database: configService.get<string>('DB_NAME', 'babylon_db'),
        entities: [
          User,
          Asset,
          Transaction,
          Badge,
          Budget,
          SavingsGoal,
          Tontine,
          TontineMember,
          CryptoAsset,
        ],
        synchronize: true, // Only for development
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AssetsModule,
    TransactionsModule,
    AiModule,
    BudgetModule,
    SavingsModule,
    TontinesModule,
    CryptoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
