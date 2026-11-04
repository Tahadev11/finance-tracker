import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../transactions/schemas/transaction.schema.js';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel('Transaction') private transactionModel: Model<Transaction>,
  ) {}

  async getSummary(userId: string) {
    // Look for the string directly
    const result = await this.transactionModel.aggregate([
      { $match: { userId: userId } }, 
      { $group: { _id: '$type', total: { $sum: '$amount' } } },
    ]);

    const income = result.find((r) => r._id === 'income')?.total || 0;
    const expenses = result.find((r) => r._id === 'expense')?.total || 0;

    return {
      totalIncome: income,
      totalExpenses: expenses,
      currentBalance: income - expenses,
    };
  }

  async getCategoryBreakdown(userId: string) {
    return this.transactionModel.aggregate([
      { $match: { userId: userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]);
  }

  async getMonthlyTrends(userId: string) {
    return this.transactionModel.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }
}