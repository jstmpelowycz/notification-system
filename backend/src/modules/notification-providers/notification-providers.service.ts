import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NotificationProvider } from '@/entities/notification-provider';

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

    async findById(id: string): Promise<NotificationProvider | null> {
        return this.notificationProvidersRepository.findOne({
            where: { id },
        });
    }
}
