import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { MailService } from 'src/mail/mail.service';
import { Request } from 'express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Prisma, UserRole } from '@prisma/client';
import { AdminRole, CreateAdminDto } from './dto/create-admin.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private readonly mailer: MailService,
  ) {}

  async GetUsers(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    name?: string;
    email?: string;
    role?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      name,
      email,
      role,
    } = query;

    const skip = (page - 1) * limit;
    const parsedRole = role ? (role as UserRole) : undefined;

    const where: Prisma.UserWhereInput = {
      firstName: name
        ? { contains: name, mode: Prisma.QueryMode.insensitive }
        : undefined,
      email: email
        ? { contains: email, mode: Prisma.QueryMode.insensitive }
        : undefined,
      role: parsedRole,
    };

    const users = await this.prisma.user.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      include: {
        comments: true,
        orders: true,
        products: true,
        likes: true,
        recvChats: true,
        region: true,
        sessions: true,
      },
    });

    const total = await this.prisma.user.count({ where });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async findUserByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }
  async getUsers(id: string) {
    return this.prisma.user.findMany({
      where: { id },
      include: {
        comments: true,
        orders: true,
        products: true,
        likes: true,
        recvChats: true,
        region: true,
        sessions: true,
      },
    });
  }
  async register(data: CreateUserDto) {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const region = await this.prisma.region.findUnique({
      where: { id: data.regionId },
    });

    if (!region) {
      throw new BadRequestException('Invalid regionId');
    }
    const hash = bcrypt.hashSync(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        role: UserRole.USER,
        password: hash,
      },
    });

    return newUser;
  }
  async createAdmin(data: CreateAdminDto) {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const region = await this.prisma.region.findUnique({
      where: { id: data.regionId },
    });

    if (!region) {
      throw new BadRequestException('Invalid regionId');
    }
    let hash = bcrypt.hashSync(data.password, 10);
    let dataA = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        regionId: data.regionId,
        year: data.year,
        password: hash,
        role: AdminRole.ADMIN,
        img: data.img,
      },
    });
    return data;
  }
  async login(data: LoginUserDto, req: Request) {
    if (!data.email || !data.password) {
      throw new UnauthorizedException('Email or password is missing');
    }

    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const match = bcrypt.compareSync(data.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Wrong password');
    }
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const device = req.headers['user-agent'] || 'unknown';

    await this.prisma.session.create({
      data: {
        userId: user.id,
        ip: ip.toString(),
        device,
      },
    });

    const acsses_token = this.jwt.sign({ id: user.id, role: user.role });
    const refresh_token = this.jwt.sign({ id: user.id, role: user.role });
    return { acsses_token, refresh_token };
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
  async del(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.findUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token },
    });

    await this.mailer.sendEmail(
      data.email,
      'Password Reset Code',
      `Your password reset code is: ${token}`,
    );

    return { message: 'Reset token sent to email' };
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.findUserByEmail(data.email);
    if (!user || user.resetToken !== data.token) {
      throw new BadRequestException('Invalid token or email');
    }

    const hashed = bcrypt.hashSync(data.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
      },
    });

    return { message: 'Password reset successful' };
  }
  async refresh(data: RefreshTokenDto) {
    try {
      let user = this.jwt.verify(data.refreshToken);

      const newAccestoken = this.jwt.sign({ id: user.id, role: user.role });
      return { newAccestoken };
    } catch (error) {
      throw new InternalServerErrorException('internal server error');
    }
  }
}
