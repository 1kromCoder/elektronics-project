import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMEssageDto } from './dto/create-message.dto';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto, @Req() req) {
    let userId = req['user-id'];
    return this.chatService.createChat(createChatDto, userId);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const myId = req['user-id'];
    return this.chatService.getChat(myId);
  }

  @Delete()
  deleteChat(@Body('id') id: string) {
    return this.chatService.deleteChat(id);
  }
  @Post('message')
  createMessage(@Body() data: CreateMEssageDto, @Req() req) {
    let userId = req['user-id'];
    return this.chatService.createMessage(data, userId);
  }
  @Get('message/:id')
  getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }
  @Get('messages')
  async getAllMessages(@Req() req: Request) {
    const myId = req['user-id'];
    const chats = await this.chatService.getChat(myId);
    const chatIds = chats.map((c) => c.id);

    return this.chatService.getMessagesByChatIds(chatIds);
  }
}
