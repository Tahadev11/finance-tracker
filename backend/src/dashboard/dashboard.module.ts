import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema.js';

@Module({
  imports: [
    // We need access to the Transaction model to do the math
    MongooseModule.forFeature([{ name: 'Transaction', schema: TransactionSchema }]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}