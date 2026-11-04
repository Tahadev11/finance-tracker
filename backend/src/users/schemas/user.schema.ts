import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  passwordHash: string;

    @Prop({ default: false }) // <-- ADD THIS
  isAdmin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
