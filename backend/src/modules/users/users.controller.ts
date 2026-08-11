import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UsersService, UpdateUserDto } from './users.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() body: UpdateUserDto) {
    return this.usersService.update(req.user.userId, body);
  }

  @Patch('password')
  async updatePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
    // This will be implemented in auth service
    throw new BadRequestException('Password change must be done through auth endpoint');
  }

  @Delete('account')
  async deleteAccount(@Request() req) {
    await this.usersService.delete(req.user.userId);
    return { success: true, message: 'Account deleted successfully' };
  }
}
