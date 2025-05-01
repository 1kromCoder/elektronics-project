import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  text: string;
  userId: string;
  @ApiProperty()
  @IsString()
  productId: string;
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;
}
