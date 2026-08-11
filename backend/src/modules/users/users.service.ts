import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  language?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  language?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        language: createUserDto.language || 'ar',
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async markEmailVerified(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
