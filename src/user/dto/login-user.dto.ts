import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  email: string;
  @ApiProperty()
  @IsString()
  password: string;
}
