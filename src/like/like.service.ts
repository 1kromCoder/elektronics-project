import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}
  async create(createLikeDto: CreateLikeDto, userId: string) {
    const { productId } = createLikeDto;

    const product = await this.prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Invalid productId');
    }

    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingLike) {
      throw new BadRequestException('You have already liked this product');
    }

    return await this.prisma.like.create({
      data: {
        productId,
        userId,
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
    productId?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId,
      productId,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.LikeWhereInput = {
      userId: userId ? userId : undefined,
      productId: productId ? productId : undefined,
    };

    const likes = await this.prisma.like.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      include: {
        user: true,
        product: true,
      },
    });

    const total = await this.prisma.like.count({ where });

    return {
      data: likes,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.like.findFirst({ where: { id } });
    return one;
  }

  async update(id: string, updateColorDto: UpdateLikeDto) {
    let updated = await this.prisma.like.update({
      where: { id },
      data: updateColorDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.like.delete({ where: { id } });
    return deleted;
  }
}
