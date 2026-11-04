import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

interface RequestWithUser extends Request {
  user: { userId: string; email: string };
}

@Controller('dashboard')
@UseGuards(JwtAuthGuard) // Protect all dashboard routes
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(@Req() req: RequestWithUser) {
    return this.dashboardService.getSummary(req.user.userId);
  }

  @Get('categories')
  getCategories(@Req() req: RequestWithUser) {
    return this.dashboardService.getCategoryBreakdown(req.user.userId);
  }

  @Get('trends')
  getTrends(@Req() req: RequestWithUser) {
    return this.dashboardService.getMonthlyTrends(req.user.userId);
  }
}