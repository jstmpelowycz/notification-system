import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationChannel } from '@/entities/notification-channel';
import { NotificationProviderIntegrationType } from '@/entities/notification-provider';
import { NOTIFICATION_CHANNEL_ERROR_MESSAGES } from '@/modules/notification-channels/constants/error-messages';
import { CreateChannelRequestDto } from '@/modules/notification-channels/dto/create-channel.dto';
import { UpdateChannelRequestDto } from '@/modules/notification-channels/dto/update-channel.dto';
import { NotificationProvidersService } from '@/modules/notification-providers/notification-providers.service';

@Injectable()
export class NotificationChannelsService {
    constructor(
        @InjectRepository(NotificationChannel)
        private readonly notificationChannelRepository: Repository<NotificationChannel>,
        private readonly notificationProviderService: NotificationProvidersService
    ) {}

    async findById(id: string): Promise<NotificationChannel | null> {
        return this.notificationChannelRepository.findOne({
            where: { id },
            relations: ['provider'],
        });
    }

    async findAll(): Promise<NotificationChannel[]> {
        return this.notificationChannelRepository.find({
            relations: ['provider'],
        });
    }

    async create(dto: CreateChannelRequestDto): Promise<NotificationChannel> {
        const provider = await this.notificationProviderService.getById(dto.providerId);

        if (provider.integrationType === NotificationProviderIntegrationType.WEBHOOK) {
            if (!dto.config.webhookUrl) {
                throw new Error(NOTIFICATION_CHANNEL_ERROR_MESSAGES.WEBHOOK_URL_REQUIRED);
            }
        }

        const channel = this.notificationChannelRepository.create({
            ...dto,
            provider,
        });

        return this.notificationChannelRepository.save(channel);
    }

    async update(id: string, dto: UpdateChannelRequestDto): Promise<NotificationChannel> {
        const channel = await this.notificationChannelRepository.findOne({
            where: { id },
            relations: ['provider'],
        });

        if (!channel) {
            throw new Error(NOTIFICATION_CHANNEL_ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        }

        if (
            dto.config &&
            channel.provider.integrationType === NotificationProviderIntegrationType.WEBHOOK &&
            !dto.config.webhookUrl
        ) {
            throw new Error(NOTIFICATION_CHANNEL_ERROR_MESSAGES.WEBHOOK_URL_REQUIRED);
        }

        Object.assign(channel, dto);

        return this.notificationChannelRepository.save(channel);
    }
}
