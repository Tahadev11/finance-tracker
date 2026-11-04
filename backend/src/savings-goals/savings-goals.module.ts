import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavingsGoalsController } from './savings-goals.controller.js';
import { SavingsGoalsService } from './savings-goals.service.js';
import { SavingsGoal, SavingsGoalSchema } from './schemas/savings-goal.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'SavingsGoal', schema: SavingsGoalSchema }]),
  ],
  controllers: [SavingsGoalsController],
  providers: [SavingsGoalsService],
})
export class SavingsGoalsModule {}