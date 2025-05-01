import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProductController],
  providers: [ProductService, JwtModule],
})
export class ProductModule {}
