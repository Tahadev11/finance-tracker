import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BudgetsController } from './budgets.controller.js';
import { BudgetsService } from './budgets.service.js';
import { Budget, BudgetSchema } from './schemas/budget.schema.js';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Budget', schema: BudgetSchema },
      { name: 'Transaction', schema: TransactionSchema }, // Needed to calculate spent amount
    ]),
  ],
  controllers: [BudgetsController],
  providers: [BudgetsService],
})
export class BudgetsModule {}