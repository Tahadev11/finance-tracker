import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // --- ADD THIS NEW ENDPOINT ---
  @Post('register-admin')
  registerAdmin(@Body() dto: RegisterDto & { secretKey: string }) {
    // You should put ADMIN_SECRET=my-super-secret-key in your .env file
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'my-super-secret-key';
    
    if (dto.secretKey !== ADMIN_SECRET) {
      throw new Error('Unauthorized: Invalid secret key');
    }
    
    return this.authService.registerAdmin(dto);
  }
}