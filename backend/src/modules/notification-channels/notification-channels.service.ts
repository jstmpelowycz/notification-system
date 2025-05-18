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

    async create(createChannelDto: CreateChannelRequestDto): Promise<NotificationChannel> {
        const provider = await this.notificationProviderService.getById(createChannelDto.providerId);

        if (provider.integrationType === NotificationProviderIntegrationType.WEBHOOK) {
            if (!createChannelDto.config.webhookUrl) {
                throw new Error(NOTIFICATION_CHANNEL_ERROR_MESSAGES.WEBHOOK_URL_REQUIRED);
            }
        }

        const channel = this.notificationChannelRepository.create({
            ...createChannelDto,
            provider,
        });

        return this.notificationChannelRepository.save(channel);
    }

    async update(id: string, updateChannelDto: UpdateChannelRequestDto): Promise<NotificationChannel> {
        const channel = await this.notificationChannelRepository.findOne({
            where: { id },
            relations: ['provider'],
        });

        if (!channel) {
            throw new Error(NOTIFICATION_CHANNEL_ERROR_MESSAGES.CHANNEL_NOT_FOUND);
        }

        if (
            updateChannelDto.config &&
            channel.provider.integrationType === NotificationProviderIntegrationType.WEBHOOK &&
            !updateChannelDto.config.webhookUrl
        ) {
            throw new Error(NOTIFICATION_CHANNEL_ERROR_MESSAGES.WEBHOOK_URL_REQUIRED);
        }

        Object.assign(channel, updateChannelDto);

        return this.notificationChannelRepository.save(channel);
    }
}
