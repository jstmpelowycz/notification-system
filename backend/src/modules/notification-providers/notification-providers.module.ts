import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationProvider } from '@/entities/notification-provider';
import { NotificationProvidersController } from '@/modules/notification-providers/notification-providers.controller';
import { NotificationProvidersService } from '@/modules/notification-providers/notification-providers.service';

@Module({
    imports: [TypeOrmModule.forFeature([NotificationProvider])],
    controllers: [NotificationProvidersController],
    providers: [NotificationProvidersService],
    exports: [NotificationProvidersService],
})
export class NotificationProvidersModule {}
