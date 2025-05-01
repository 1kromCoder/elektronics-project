import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, StatusType, Type } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto, userId: string) {
    const { colorIds, categoryId, discount, price, ...data } = createProductDto;

    const categoryExists = await this.prisma.category.findFirst({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new BadRequestException('Invalid categoryId');
    }

    const existingColors = await this.prisma.color.findMany({
      where: { id: { in: colorIds } },
      select: { id: true },
    });

    const existingColorIds = existingColors.map((c) => c.id);
    const invalidColorIds = colorIds.filter(
      (id) => !existingColorIds.includes(id),
    );

    if (invalidColorIds.length > 0) {
      throw new BadRequestException(
        `Invalid color IDs: ${invalidColorIds.join(', ')}`,
      );
    }
    const discountNum = Number(discount) || 0;
    const disFinal =
      discountNum > 0 ? price - (price * discountNum) / 100 : price;
    return await this.prisma.product.create({
      data: {
        ...data,
        price: disFinal,
        discount: discountNum,
        userId,
        categoryId,
        colors: {
          connect: colorIds.map((id) => ({ id })),
        },
      },
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    name?: string;
    categoryId?: string;
    type?: Type;
    status?: StatusType;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      name,
      categoryId,
      type,
      status,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      name: name
        ? { contains: name, mode: Prisma.QueryMode.insensitive }
        : undefined,
      categoryId: categoryId || undefined,
      type: type || undefined,
      status: status || undefined,
    };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      include: {
        user: true,
        likes: true,
        colors: true,
        comments: true,
        category: true,
        // views: true,
      },
    });

    const total = await this.prisma.product.count({ where });

    const data = products.map((product) => {
      const stars = product.comments.map((c) => c.star);
      const averageStar =
        stars.length > 0
          ? stars.reduce((sum, s) => sum + s, 0) / stars.length
          : null;

      return {
        ...product,
        // averageStar,
        // viewsCount: product.views.length,
      };
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId?: string) {
    const product = await this.prisma.product.findFirst({
      where: { id },
      include: {
        category: true,
        colors: true,
        comments: true,
        likes: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (userId) {
      const alreadyViewed = await this.prisma.view.findFirst({
        where: {
          userId,
          productId: id,
        },
      });

      if (!alreadyViewed) {
        await this.prisma.view.create({
          data: {
            userId,
            productId: id,
          },
        });
      }
    }

    const comments = product.comments;
    const totalStars = comments.reduce(
      (sum, comment) => sum + (comment.star || 0),
      0,
    );
    const averageStar = comments.length > 0 ? totalStars / comments.length : 0;

    const viewCount = await this.prisma.view.count({
      where: { productId: id },
    });

    return {
      ...product,
      viewCount,
      averageStar: +averageStar.toFixed(1),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.product.delete({ where: { id } });
    return deleted;
  }
}
