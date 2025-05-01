import { ApiProperty } from '@nestjs/swagger';
import { StatusType, Type } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsString()
  categoryId: string;
  @ApiProperty({ enum: Type })
  @IsEnum(Type)
  type: Type;
  @ApiProperty({ enum: StatusType })
  @IsEnum(StatusType)
  status: StatusType;
  @ApiProperty()
  @IsNumber()
  count: number;
  @ApiProperty()
  @IsNumber()
  discount: number;
  @ApiProperty()
  @IsString()
  description: string;
  userId: string;
  @ApiProperty()
  @IsArray()
  colorIds: string[];
}
