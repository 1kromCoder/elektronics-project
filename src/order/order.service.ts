import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateOrderDto, userId: string) {
    const { colorId, productId, count } = createOrderDto;

    const validColor = await this.prisma.color.findUnique({
      where: { id: colorId },
    });
    if (!validColor) {
      throw new Error(`Invalid colorId: ${colorId}`);
    }

    const validProduct = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!validProduct) {
      throw new Error(`Invalid productId: ${productId}`);
    }

    return await this.prisma.order.create({
      data: {
        userId,
        count,
        productId,
        colors: {
          connect: { id: colorId },
        },
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
    status?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      userId: userId ? userId : undefined,
    };

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      include: {
        user: true,
        colors: true,
        _count: true,
      },
    });

    const total = await this.prisma.order.count({ where });

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: string) {
    let one = await this.prisma.order.findFirst({ where: { id } });
    return one;
  }

  async update(id: string, updateColorDto: UpdateOrderDto) {
    let updated = await this.prisma.order.update({
      where: { id },
      data: updateColorDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.order.delete({ where: { id } });
    return deleted;
  }
}
