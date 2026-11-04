import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, min: 1 })
  monthlyLimit: number;

  @Prop({ required: true, min: 1, max: 12 })
  month: number; // 1 = Jan, 12 = Dec

  @Prop({ required: true })
  year: number;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);