import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  colorId: string;
  @ApiProperty()
  @IsString()
  productId: string;
  @ApiProperty()
  @IsNumber()
  count: number;
  userId: string;
}
