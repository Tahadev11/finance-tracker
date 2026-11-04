
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createObserveModule } from '@nestjs/observe';
import { AuthModule } from './auth/auth.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { SavingsGoalsModule } from './savings-goals/savings-goals.module.js';
import { AdminModule } from './admin/admin.module.js';

export const { ObserveModule, ObserveInstrument } =
  createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB_URI'),
      }),
    }),

    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),

    AuthModule,
    TransactionsModule,
    DashboardModule,
    BudgetsModule,
    SavingsGoalsModule,
    AdminModule,
  ],

})
export class AppModule {}
