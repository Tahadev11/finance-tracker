import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/schemas/user.schema.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) { }
  // Add this method inside your AuthService class
  async registerAdmin(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Notice isAdmin is set to true
    const user = await this.userModel.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      isAdmin: true,
    });

    return this.signToken(user);
  }

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({
      email: dto.email,
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
    });

    return this.signToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signToken(user);
  }

  // Change your signToken method to this:
  private signToken(user: User) {
    const payload = { sub: user._id, email: user.email, isAdmin: user.isAdmin };
    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
    };
  }
}
