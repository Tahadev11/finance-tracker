import { Injectable, ForbiddenException } from '@nestjs/common';
// Use 'import type' for the interfaces
import type { CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    // Check if user exists and is an admin
    if (request.user && request.user.isAdmin) {
      return true;
    }
    
    throw new ForbiddenException('Admin access required');
  }
}