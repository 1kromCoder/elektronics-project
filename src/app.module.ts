import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RegionModule } from './region/region.module';
import { ProductModule } from './product/product.module';
import { MailModule } from './mail/mail.module';
import { ColorModule } from './color/color.module';
import { OrderModule } from './order/order.module';
import { LikeModule } from './like/like.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { SessionModule } from './session/session.module';
import { ViewModule } from './view/view.module';
import { ChatModule } from './chat/chat.module';
import { MulterController } from './multer/multer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    RegionModule,
    ProductModule,
    MailModule,
    ColorModule,
    OrderModule,
    LikeModule,
    CategoryModule,
    CommentModule,
    SessionModule,
    ViewModule,
    ChatModule,
    MulterModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
  ],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule {}
