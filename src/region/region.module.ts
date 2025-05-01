import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [RegionController],
  providers: [RegionService, JwtModule],
})
export class RegionModule {}
