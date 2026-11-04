import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction extends Document {
  // Changed from Types.ObjectId to string
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true, enum: ['income', 'expense'] })
  type: string;

  @Prop({ required: true, min: 1 })
  amount: number;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ required: true, index: true })
  date: Date;

  @Prop({ required: true, enum: ['cash', 'card', 'bank_transfer', 'mobile_wallet'] })
  paymentMethod: string;

  @Prop()
  description?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);