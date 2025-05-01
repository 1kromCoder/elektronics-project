import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'hello',
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, MailModule],
})
export class UserModule {}
