import { Injectable } from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async create(createRegionDto: CreateRegionDto) {
    return this.prisma.region.create({ data: createRegionDto });
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

    const where: Prisma.RegionWhereInput = {
      name: name
        ? { contains: name, mode: Prisma.QueryMode.insensitive }
        : undefined,
    };

    const data = await this.prisma.region.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
      // include: { users: true },
    });

    const total = await this.prisma.region.count({ where });

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
  async findOne(id: string) {
    return this.prisma.region.findUnique({
      where: { id },
      // include: { users: true },
    });
  }

  async update(id: string, updateRegionDto: UpdateRegionDto) {
    return this.prisma.region.update({
      where: { id },
      data: updateRegionDto,
    });
  }

  async remove(id: string) {
    return this.prisma.region.delete({ where: { id } });
  }
}
