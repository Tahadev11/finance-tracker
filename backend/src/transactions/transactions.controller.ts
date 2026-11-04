import { Controller, Get, Post, Body, Delete, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

// We define a custom type so TypeScript knows 'req.user' exists
interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.transactionsService.findAll(req.user.userId);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.userId, id);
  }
}