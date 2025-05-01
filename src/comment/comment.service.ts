import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}
  async create(createOrderDto: CreateCommentDto, userId: string) {
    const { productId, ...data } = createOrderDto;

    const productExists = await this.prisma.product.findFirst({
      where: { id: productId },
    });

    if (!productExists) {
      throw new BadRequestException('Invalid productId');
    }
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return await this.prisma.comment.create({
      data: {
        ...data,
        userId,
        productId,
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

    const where: Prisma.CommentWhereInput = {
      userId: userId ? userId : undefined,
      productId: productId ? productId : undefined,
    };

    const comments = await this.prisma.comment.findMany({
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

    const total = await this.prisma.comment.count({
      where,
    });

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.comment.findFirst({ where: { id } });
    return one;
  }

  async update(id: string, updateColorDto: UpdateCommentDto) {
    let updated = await this.prisma.comment.update({
      where: { id },
      data: updateColorDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.comment.delete({ where: { id } });
    return deleted;
  }
}
