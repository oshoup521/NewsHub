import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, username: user.username };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
      },
    };
  }

  async register(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists with this email or username');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    
    const { password: _, ...result } = savedUser;
    const payload = { email: result.email, sub: result.id, username: result.username };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: result.id,
        email: result.email,
        username: result.username,
        firstName: result.firstName,
        lastName: result.lastName,
        avatar: result.avatar,
        isAdmin: result.isAdmin,
      },
    };
  }

  async profile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['preferences', 'preferences.category'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, ...result } = user;
    return result;
  }
}
