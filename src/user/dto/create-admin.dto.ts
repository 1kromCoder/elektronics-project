import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsString()
  regionId: string;
  @ApiProperty()
  @IsNumber()
  year: number;
  @ApiProperty()
  @IsString()
  img: string;
}
export enum AdminRole {
  ADMIN = 'ADMIN',
}
