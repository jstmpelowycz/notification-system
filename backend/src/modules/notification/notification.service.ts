import { Injectable } from '@nestjs/common';
import { DiscordProvider } from '@/modules/discord/discord.provider';

@Injectable()
export class NotificationService {
    constructor(private readonly discordProvider: DiscordProvider) {}

    async sendNotification(channelId: string, content: string): Promise<void> {
        await this.discordProvider.sendMessage(channelId, content);
    }
}
