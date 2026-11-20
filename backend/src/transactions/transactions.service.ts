import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  // Helper: compute balance EXCLUDING a specific transaction (for edits)
  private async computeBalance(userId: string, excludeId?: string) {
    const match: any = { userId };
    if (excludeId) match._id = { $ne: excludeId };

    const agg = await this.transactionModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          income:  { $sum: { $cond: [{ $eq: ['$type', 'income'] },  '$amount', 0] } },
          expense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
    ]);
    const income  = agg[0]?.income  ?? 0;
    const expense = agg[0]?.expense ?? 0;
    return income - expense;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    if (dto.type === 'expense') {
      const balance = await this.computeBalance(userId);
      if (dto.amount > balance) {
        throw new BadRequestException(
          `Insufficient balance. Current: Rs. ${balance}, cannot spend Rs. ${dto.amount}.`,
        );
      }
    }
    const created = new this.transactionModel({
      ...dto,
      userId,
      date: new Date(dto.date),
    });
    return created.save();
  }

  async findAll(userId: string) {
    return this.transactionModel.find({ userId }).sort({ date: -1 }).exec();
  }

  // ✅ NEW: update a transaction
  async update(userId: string, id: string, dto: Partial<CreateTransactionDto>) {
    const existing = await this.transactionModel.findOne({ _id: id, userId }).exec();
    if (!existing) throw new NotFoundException('Transaction not found');

    // If resulting type is expense, verify balance after applying the edit
    const resultingType   = dto.type   ?? existing.type;
    const resultingAmount = dto.amount ?? existing.amount;

    if (resultingType === 'expense') {
      // balance excluding THIS transaction
      const balanceWithoutThis = await this.computeBalance(userId, id);
      if (resultingAmount > balanceWithoutThis) {
        throw new BadRequestException(
          `Insufficient balance after edit. Available: Rs. ${balanceWithoutThis}, expense would be Rs. ${resultingAmount}.`,
        );
      }
    }

    Object.assign(existing, dto);
    if (dto.date) existing.date = new Date(dto.date);
    return existing.save();
  }

  async remove(userId: string, id: string) {
    const deleted = await this.transactionModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!deleted) throw new NotFoundException('Transaction not found');
    return { message: 'Transaction deleted successfully' };
  }
}