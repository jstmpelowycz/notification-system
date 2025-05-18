import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationChannel } from '@/entities/notification-channel';
import { NotificationProvidersModule } from '@/modules/notification-providers/notification-providers.module';

import { NotificationChannelsController } from './notification-channels.controller';
import { NotificationChannelsService } from './notification-channels.service';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationChannel]), NotificationProvidersModule],
    controllers: [NotificationChannelsController],
    providers: [NotificationChannelsService],
})
export class NotificationChannelsModule {}
