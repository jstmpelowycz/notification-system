import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageContent } from '@/entities/message-content';
import { MessageRevision } from '@/entities/message-revision';

import { MessageRevisionsService } from './message-revisions.service';

@Module({
    imports: [TypeOrmModule.forFeature([MessageRevision, MessageContent])],
    providers: [MessageRevisionsService],
    exports: [MessageRevisionsService],
})
export class MessageRevisionsModule {}
