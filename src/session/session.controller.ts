import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserFromToken } from 'src/user/decoration/user.decorator';
import { ApiQuery } from '@nestjs/swagger';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}
  // @Get()
  // @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  // @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  // @ApiQuery({ name: 'sortBy', required: false, example: 'createdAt' })
  // @ApiQuery({
  //   name: 'sortOrder',
  //   required: false,
  //   enum: ['asc', 'desc'],
  //   example: 'desc',
  // })
  // @ApiQuery({ name: 'ip', required: false })
  // @ApiQuery({ name: 'device', required: false })
  // async getAllSessions(
  //   @Req() req,
  //   @Query()
  //   query: {
  //     page?: string;
  //     limit?: string;
  //     sortBy?: string;
  //     sortOrder?: 'asc' | 'desc';
  //     ip?: string;
  //     device?: string;
  //   },
  // ) {
  //   const userId = req['user-id'];
  //   return this.sessionService.findAllByUser(userId, {
  //     ...query,
  //     page: query.page ? parseInt(query.page) : undefined,
  //     limit: query.limit ? parseInt(query.limit) : undefined,
  //   });
  // }
  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req) {
    let userId = req['user-id'];
    return this.sessionService.me(userId);
  }
  // @Get('/:id')
  // getOneSession(@Param('id') id: string, @UserFromToken('id') userId: string) {
  //   return this.sessionService.findOneByUser(id, userId);
  // }

  @Delete('/:id')
  deleteSession(@Param('id') id: string, @UserFromToken('id') userId: string) {
    return this.sessionService.remove(id, userId);
  }
}
