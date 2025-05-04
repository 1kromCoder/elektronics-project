import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiQuery } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/role.guards';
import { RoleD } from 'src/user/decoration/user.decoration';
import { UserRole } from '@prisma/client';

@Controller('order')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    let userId = req['user-id'];
    return this.orderService.create(createOrderDto, userId);
  }

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
  @ApiQuery({ name: 'userId', required: false })
  async findAll(
    @Query()
    query: {
      page?: string;
      limit?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      userId?: string;
      status?: string;
    },
  ) {
    return this.orderService.findAll({
      ...query,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    });
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  // @Patch('/:id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(id, updateOrderDto);
  // }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
