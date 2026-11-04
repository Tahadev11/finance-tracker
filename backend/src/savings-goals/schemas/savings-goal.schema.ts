import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SavingsGoal extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, min: 1 })
  targetAmount: number;

  @Prop({ default: 0, min: 0 })
  savedAmount: number;

  @Prop({ required: true })
  targetDate: Date;
}

export const SavingsGoalSchema = SchemaFactory.createForClass(SavingsGoal);