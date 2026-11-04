import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller.js';
import { User, UserSchema } from '../users/schemas/user.schema.js';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema }
    ]),
  ],
  controllers: [AdminController],
})
export class AdminModule {}