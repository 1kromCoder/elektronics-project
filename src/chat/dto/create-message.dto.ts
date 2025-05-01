import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMEssageDto {
  @ApiProperty()
  @IsString()
  toId: string;
  @ApiProperty()
  @IsString()
  chatId: string;
  @ApiProperty()
  @IsString()
  message: string;
}
