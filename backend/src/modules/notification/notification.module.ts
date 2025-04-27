import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DiscordProvider } from '@/modules/discord/discord.provider';

@Module({
    providers: [NotificationService, DiscordProvider],
    controllers: [NotificationController],
})
export class NotificationModule {}
