import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Budget } from './schemas/budget.schema.js';
import { Transaction } from '../transactions/schemas/transaction.schema.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectModel('Budget') private budgetModel: Model<Budget>,
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
  ) {}

  async create(userId: string, dto: CreateBudgetDto) {
    // Upsert: Update if it exists, create if it doesn't
    return this.budgetModel.findOneAndUpdate(
      { userId, category: dto.category, month: dto.month, year: dto.year },
      { ...dto, userId },
      { upsert: true, new: true },
    );
  }

  async findAllForMonth(userId: string, month: number, year: number) {
    const budgets = await this.budgetModel.find({ userId, month, year }).lean();

    // For each budget, calculate how much has been spent
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const spentResult = await this.transactionModel.aggregate([
          {
            $match: {
              userId,
              category: budget.category,
              type: 'expense',
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        const spent = spentResult[0]?.total || 0;
        
        return {
          ...budget,
          spent,
          remaining: Math.max(0, budget.monthlyLimit - spent),
          percentage: Math.round((spent / budget.monthlyLimit) * 100),
        };
      })
    );

    return budgetsWithSpent;
  }
}