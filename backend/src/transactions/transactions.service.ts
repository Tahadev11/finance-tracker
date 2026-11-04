import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionSchema } from './schemas/transaction.schema.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  // Create a transaction for the logged-in user
  async create(userId: string, dto: CreateTransactionDto) {
    const createdTransaction = new this.transactionModel({
      ...dto,
      userId, 
      date: new Date(dto.date),
    });
    return createdTransaction.save();
  }

  // Get all transactions belonging ONLY to the logged-in user
  async findAll(userId: string) {
    return this.transactionModel.find({ userId }).sort({ date: -1 }).exec();
  }

  // Delete a transaction (only if it belongs to the user)
  async remove(userId: string, id: string) {
    const deleted = await this.transactionModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deleted) throw new NotFoundException('Transaction not found');
    return { message: 'Transaction deleted successfully' };
  }
}