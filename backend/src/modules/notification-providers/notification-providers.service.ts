import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationProvider } from '@/entities/notification-provider';
import { NOTIFICATION_PROVIDER_ERROR_MESSAGES } from '@/modules/notification-providers/constants/error-messages';

@Injectable()
export class NotificationProvidersService {
    constructor(
        @InjectRepository(NotificationProvider)
        private readonly notificationProvidersRepository: Repository<NotificationProvider>
    ) {}

    async findAll(): Promise<NotificationProvider[]> {
        return this.notificationProvidersRepository.find({
            order: {
                name: 'desc',
            },
        });
    }

    async getById(id: string): Promise<NotificationProvider> {
        const provider = await this.notificationProvidersRepository.findOne({
            where: { id },
        });

        if (!provider) {
            throw new Error(NOTIFICATION_PROVIDER_ERROR_MESSAGES.PROVIDER_NOT_FOUND);
        }

        return provider;
    }
}
