import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from '@/entities/message';
import { NotificationChannel } from '@/entities/notification-channel';
import { MessageRevisionsModule } from '@/modules/message-revisions/message-revisions.module';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
    imports: [TypeOrmModule.forFeature([Message, NotificationChannel]), MessageRevisionsModule],
    controllers: [MessagesController],
    providers: [MessagesService],
    exports: [MessagesService],
})
export class MessagesModule {}
