import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Type } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(createColorDto: CreateCategoryDto) {
    return await this.prisma.category.create({
      data: createColorDto,
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    name?: string;
    type?: Type;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      name,
      type,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.CategoryWhereInput = {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      type: type || undefined,
    };

    const categories = await this.prisma.category.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.category.count({
      where,
    });

    return {
      data: categories,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.category.findFirst({ where: { id } });
    return one;
  }

  async update(id: string, updateColorDto: UpdateCategoryDto) {
    let updated = await this.prisma.category.update({
      where: { id },
      data: updateColorDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.category.delete({ where: { id } });
    return deleted;
  }
}
