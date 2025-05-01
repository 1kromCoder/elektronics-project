import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express';
import { MailService } from 'src/mail/mail.service';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from '@prisma/client';
import { AdminRole, CreateAdminDto } from './dto/create-admin.dto';
import { RoleGuard } from 'src/auth/role.guards';
import { RoleD } from './decoration/user.decoration';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to email' })
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.mailService.sendOtp(dto.email);
    return { message: 'OTP sent to email' };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP' })
  async verify(@Body() dto: VerifyOtpDto) {
    const isValid = this.mailService.verifyOtp(dto.email, dto.otp);
    if (isValid) return { success: true, message: 'OTP is correct' };
    else return { success: false, message: 'Invalid OTP' };
  }
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Req() req: Request) {
    return this.userService.login(loginUserDto, req);
  }
  @Post('refresh')
  refreshToken(@Body() dto: RefreshTokenDto) {
    return this.userService.refresh(dto);
  }
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Sahifa raqami',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Sahifadagi elementlar soni',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
    description: 'Saralash maydoni (e.g. createdAt, email)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Saralash tartibi',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Ism bo‘yicha qidirish',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    type: String,
    description: 'Email bo‘yicha qidirish',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: UserRole,
    description: 'Foydalanuvchi roli bo‘yicha filter',
  })
  async findAll(
    @Query()
    query: {
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      name?: string;
      email?: string;
      role?: UserRole;
    },
  ) {
    return this.userService.GetUsers({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    });
  }
  @Get('/:id')
  getUSers(@Param('id') id: string) {
    return this.userService.getUsers(id);
  }
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.userService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.userService.resetPassword(dto);
  }
  @RoleD(AdminRole.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post('add-Admin')
  addAdmin(@Body() dto: CreateAdminDto) {
    return this.userService.createAdmin(dto);
  }
  @Patch('/:id')
  edit(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);

    return this.userService.update(id, updateUserDto);
  }
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.del(id);
  }
}
