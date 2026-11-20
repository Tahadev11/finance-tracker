import {
  Controller, Get, Post, Patch, Body, Delete, Param, Req, UseGuards,
} from '@nestjs/common';
import { type Request } from 'express';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

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

  // ✅ NEW: update
  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: Partial<CreateTransactionDto>,
  ) {
    return this.transactionsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.transactionsService.remove(req.user.userId, id);
  }
}