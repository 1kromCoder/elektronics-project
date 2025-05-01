import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ViewService {
  constructor(private prisma: PrismaService) {}
  async create(createViewDto: CreateViewDto, userId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: createViewDto.productId },
    });

    if (!product) {
      throw new BadRequestException('Invalid productId');
    }

    return this.prisma.view.create({
      data: {
        userId,
        productId: createViewDto.productId,
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    productId?: string;
    userId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      productId,
      userId,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ViewWhereInput = {
      productId: productId ? productId : undefined,
      userId: userId ? userId : undefined,
    };

    const views = await this.prisma.view.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      include: {
        product: true,
        user: true,
      },
    });

    const total = await this.prisma.view.count({
      where,
    });

    return {
      data: views,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.view.findFirst({ where: { id } });
    return one;
  }

  async update(id: string, updateColorDto: UpdateViewDto) {
    let updated = await this.prisma.view.update({
      where: { id },
      data: updateColorDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.view.delete({ where: { id } });
    return deleted;
  }
}
