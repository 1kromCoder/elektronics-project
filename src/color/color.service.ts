import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}
  async create(createColorDto: CreateColorDto) {
    return await this.prisma.color.create({
      data: createColorDto,
    });
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    name?: string;
  }) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      name,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ColorWhereInput = {
      name: name
        ? { contains: name, mode: Prisma.QueryMode.insensitive }
        : undefined,
    };

    const colors = await this.prisma.color.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    });

    const total = await this.prisma.color.count({ where });

    return {
      data: colors,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    let one = await this.prisma.color.findFirst({ where: { id } });
    return one;
  }

  async update(id: string, updateColorDto: UpdateColorDto) {
    let updated = await this.prisma.color.update({
      where: { id },
      data: updateColorDto,
    });
    return updated;
  }

  async remove(id: string) {
    let deleted = await this.prisma.color.delete({ where: { id } });
    return deleted;
  }
}
