import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { BudgetsService } from './budgets.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Req() req: RequestWithUser,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.budgetsService.findAllForMonth(
      req.user.userId,
      parseInt(month),
      parseInt(year),
    );
  }
}