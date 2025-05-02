import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createLikeDto: CreateLikeDto, @Req() req) {
    let userId = req['user-id'];
    return this.likeService.create(createLikeDto, userId);
  }

  // @Get()
  // @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  // @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  // @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  // @ApiQuery({
  //   name: 'sortOrder',
  //   required: false,
  //   enum: ['asc', 'desc'],
  //   example: 'desc',
  // })
  // @ApiQuery({ name: 'userId', required: false })
  // @ApiQuery({ name: 'productId', required: false })
  // async findAll(
  //   @Query()
  //   query: {
  //     page?: string;
  //     limit?: string;
  //     sortBy?: string;
  //     sortOrder?: 'asc' | 'desc';
  //     userId?: string;
  //     productId?: string;
  //   },
  // ) {
  //   return this.likeService.findAll({
  //     ...query,
  //     page: query.page ? parseInt(query.page) : undefined,
  //     limit: query.limit ? parseInt(query.limit) : undefined,
  //   });
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.likeService.findOne(id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.remove(id);
  }
}
