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
import { ViewService } from './view.service';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  // @Post()
  // @UseGuards(AuthGuard)
  // create(@Body() createViewDto: CreateViewDto, @Req() req) {
  //   let userId = req['user-id'];
  //   return this.viewService.create(createViewDto, userId);
  // }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  async findAll(
    @Query()
    query: {
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      productId?: string;
      userId?: string;
    },
  ) {
    return this.viewService.findAll({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    });
  }

  // @Get('/:id')
  // findOne(@Param('id') id: string) {
  //   return this.viewService.findOne(id);
  // }

  // @Delete('/:id')
  // remove(@Param('id') id: string) {
  //   return this.viewService.remove(id);
  // }
}
