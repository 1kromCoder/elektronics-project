import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty({ enum: Type })
  @IsEnum(Type)
  type: Type;
}
