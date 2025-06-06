import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, In, Repository } from 'typeorm';

import { Message, MessageStatus } from '@/entities/message';
import { NotificationChannel } from '@/entities/notification-channel';
import { MessageRevisionsService } from '@/modules/message-revisions/message-revisions.service';

import { MESSAGE_ERROR_MESSAGES } from './constants/error-messages';
import { CreateMessageRequestDto } from './dto/create-message.dto';
import { FindManyMessagesRequestDto } from './dto/find-many-messages.dto';
import { ManageRevisionRequestDto } from './dto/manage-revision.dto';
import { UpdateMessageRequestDto } from './dto/update-message.dto';
import { areMessageChannelIdsEqual } from './utils/are-message-channel-ids-equal';
import { areMessageContentsEqual } from './utils/are-message-contents-equal';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messagesRepository: Repository<Message>,
        @InjectRepository(NotificationChannel)
        private readonly notificationChannelsRepository: Repository<NotificationChannel>,
        private readonly messageRevisionsService: MessageRevisionsService,
        private readonly dataSource: DataSource
    ) {}

    async findByQuery(query: FindManyMessagesRequestDto): Promise<[Message[], number]> {
        const { search, status } = query;

        return this.messagesRepository.findAndCount({
            where: {
                ...(search && {
                    slug: ILike(`%${query.search}%`),
                }),
                ...(status && { status }),
            },
            relations: ['currentRevision', 'channels', 'currentRevision.content', 'revisions', 'revisions.content'],
            order: {
                createdAt: 'DESC',
                revisions: {
                    displayId: 'DESC',
                },
            },
        });
    }

    async findBySlug(slug: string): Promise<Message | null> {
        return this.messagesRepository.findOne({
            where: { slug },
            relations: ['currentRevision', 'channels', 'currentRevision.content', 'channels.provider'],
        });
    }

    async findById(id: string): Promise<Message | null> {
        const message = await this.messagesRepository.findOne({
            where: { id },
            relations: ['currentRevision', 'channels', 'currentRevision.content', 'channels.provider'],
        });

        return message;
    }

    async getById(id: string): Promise<Message> {
        const message = await this.findById(id);

        if (!message) {
            throw new Error(MESSAGE_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }

        return message;
    }

    async create(dto: CreateMessageRequestDto): Promise<Message> {
        const { slug, description, content, channelIds } = dto;

        const channels = await this.notificationChannelsRepository.findBy({
            id: In(channelIds),
        });

        if (channels.length !== channelIds.length) {
            throw new Error(MESSAGE_ERROR_MESSAGES.CHANNELS_REQUIRED);
        }

        return this.dataSource.transaction(async manager => {
            const message = manager.create(Message, {
                slug,
                channels,
                description,
                status: MessageStatus.INACTIVE,
            });

            await manager.save(message);

            const revision = await this.messageRevisionsService.create(
                {
                    messageId: message.id,
                    content,
                },
                manager
            );

            message.currentRevisionId = revision.id;
            message.currentRevision = revision;

            await manager.save(message);

            const createdMessage = await manager.findOne(Message, {
                where: { id: message.id },
                relations: {
                    currentRevision: { content: true },
                    channels: true,
                },
            });

            if (!createdMessage) {
                throw new Error(MESSAGE_ERROR_MESSAGES.MESSAGE_NOT_FOUND_IN_TRANSACTION);
            }

            return createdMessage;
        });
    }

    async update(id: string, dto: UpdateMessageRequestDto): Promise<Message> {
        const { description, content, channelIds, status } = dto;

        let shouldSaveMessage = false;

        const message = await this.getById(id);

        if (status !== undefined && status !== message.status) {
            message.status = status;
            shouldSaveMessage = true;
        }

        if (description !== undefined && description !== message.description) {
            message.description = description;
            shouldSaveMessage = true;
        }

        if (channelIds !== undefined && !areMessageChannelIdsEqual(channelIds, message)) {
            await this.updateChannels(message, channelIds);
            shouldSaveMessage = true;
        }

        if (content !== undefined && !areMessageContentsEqual(content, message)) {
            await this.updateContent(message, content);
            shouldSaveMessage = true;
        }

        if (!shouldSaveMessage) {
            return message;
        }

        return this.messagesRepository.save(message);
    }

    async activateRevision(dto: ManageRevisionRequestDto): Promise<Message> {
        const { messageId, revisionId: nextRevisionId } = dto;

        const message = await this.getById(messageId);
        const prevRevisionId = message.currentRevisionId;

        const revision = await this.messageRevisionsService.activate(nextRevisionId);

        message.currentRevisionId = revision.id;
        message.currentRevision = revision;

        await this.messagesRepository.save(message);

        if (prevRevisionId) {
            await this.messageRevisionsService.lock(prevRevisionId);
        }

        return this.getById(messageId);
    }

    private async updateChannels(message: Message, channelIds: string[]): Promise<void> {
        const channels = await this.notificationChannelsRepository.findBy({
            id: In(channelIds),
        });

        if (channels.length !== channelIds.length) {
            throw new Error(MESSAGE_ERROR_MESSAGES.CHANNELS_REQUIRED);
        }

        message.channels = channels;
    }

    private async updateContent(message: Message, content: Record<string, unknown>): Promise<void> {
        await this.messageRevisionsService.lock(message.currentRevisionId);

        const revision = await this.messageRevisionsService.create({
            messageId: message.id,
            content,
        });

        message.currentRevisionId = revision.id;
        message.currentRevision = revision;
    }
}
