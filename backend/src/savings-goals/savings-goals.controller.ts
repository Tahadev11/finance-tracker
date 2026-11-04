import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { SavingsGoalsService } from './savings-goals.service.js';
import { ContributeDto } from './dto/contribute.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CreateGoalDto } from './dto/create-goal.dot.js';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('savings-goals')
@UseGuards(JwtAuthGuard)
export class SavingsGoalsController {
  constructor(private readonly savingsGoalsService: SavingsGoalsService) {}

  @Post()
  create(@Req() req: RequestWithUser, @Body() dto: CreateGoalDto) {
    return this.savingsGoalsService.create(req.user.userId, dto);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.savingsGoalsService.findAll(req.user.userId);
  }

  @Post(':id/contribute')
  contribute(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: ContributeDto,
  ) {
    return this.savingsGoalsService.contribute(req.user.userId, id, dto);
  }
}