import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavingsGoal } from './schemas/savings-goal.schema.js';
import { ContributeDto } from './dto/contribute.dto.js';
import { CreateGoalDto } from './dto/create-goal.dot.js';

@Injectable()
export class SavingsGoalsService {
  constructor(
    @InjectModel('SavingsGoal') private savingsGoalModel: Model<SavingsGoal>,
  ) {}

  async create(userId: string, dto: CreateGoalDto) {
    return this.savingsGoalModel.create({
      ...dto,
      userId,
      targetDate: new Date(dto.targetDate),
    });
  }

  async findAll(userId: string) {
    return this.savingsGoalModel.find({ userId }).sort({ targetDate: 1 }).exec();
  }

  async contribute(userId: string, goalId: string, dto: ContributeDto) {
    const goal = await this.savingsGoalModel.findOne({ _id: goalId, userId });
    if (!goal) throw new NotFoundException('Savings goal not found');

    goal.savedAmount += dto.amount;
    return goal.save();
  }
}