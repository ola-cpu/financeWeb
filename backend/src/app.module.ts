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
import { AuthModule } from './auth/auth.module';

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
        entities: [User, Asset, Transaction],
        synchronize: true, // Only for development
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    AssetsModule,
    TransactionsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
