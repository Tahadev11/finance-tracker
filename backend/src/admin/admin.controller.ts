import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AdminGuard } from '../auth/admin.guard.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard) // Must be logged in AND be an admin
export class AdminController {
  constructor(
    @InjectModel('User') private userModel: Model<any>,
    @InjectModel('Transaction') private transactionModel: Model<any>,
  ) {}

  @Get('users')
  async getAllUsers() {
    return this.userModel.find().select('-passwordHash'); // Don't send passwords
  }

  @Get('stats')
  async getGlobalStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalTransactions = await this.transactionModel.countDocuments();
    // Aggregate global income and expense
    const result = await this.transactionModel.aggregate([
      { $group: { _id: '$type', total: { $sum: '$amount' } } }
    ]);
    
    const income = result.find(r => r._id === 'income')?.total || 0;
    const expense = result.find(r => r._id === 'expense')?.total || 0;

    return { totalUsers, totalTransactions, globalIncome: income, globalExpense: expense };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    await this.userModel.findByIdAndDelete(id);
    // Also delete their transactions
    await this.transactionModel.deleteMany({ userId: id });
    return { message: 'User and their data deleted' };
  }
}