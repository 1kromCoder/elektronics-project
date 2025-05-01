import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CreateMEssageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(data: CreateChatDto, userId: string) {
    return this.prisma.chat.create({ data: { ...data, fromId: userId } });
  }

  async getChat(myId: string) {
    return this.prisma.chat.findMany({
      where: {
        OR: [{ fromId: myId }, { toId: myId }],
      },
      include: {
        from: true,
        to: true,
      },
    });
  }

  async deleteChat(id: string) {
    return this.prisma.chat.delete({ where: { id } });
  }
  async createMessage(data: CreateMEssageDto, userId: string) {
    let message = await this.prisma.chatMessage.create({
      data: { ...data, fromId: userId },
    });
    return message;
  }
  async getMessages(chatId: string) {
    let messages = await this.prisma.chatMessage.findMany({
      where: {
        chatId,
      },
    });
    return messages;
  }
  async getAllMessages() {
    return this.prisma.chatMessage.findMany({
      include: {
        chat: true,
      },
    });
  }
  async getMessagesByChatIds(chatIds: string[]) {
    return this.prisma.chatMessage.findMany({
      where: {
        chatId: {
          in: chatIds,
        },
      },
      include: {
        chat: true,
      },
    });
  }
}
