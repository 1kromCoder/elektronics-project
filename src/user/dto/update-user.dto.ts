import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  firstName?: string;
  @ApiProperty()
  @IsString()
  lastName?: string;
  @ApiProperty()
  @IsString()
  password?: string;
  @ApiProperty()
  @IsEmail()
  email?: string;
  @ApiProperty()
  @IsString()
  regionId?: string;
  @ApiProperty()
  @IsNumber()
  year?: number;
  @ApiProperty()
  @IsString()
  img?: string;
}
