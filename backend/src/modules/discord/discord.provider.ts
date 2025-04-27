import { Injectable } from '@nestjs/common';
import { Client, TextChannel } from 'discord.js';
import { NotificationProvider } from '@/modules/notification/notification.provider';

@Injectable()
export class DiscordProvider implements NotificationProvider {
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: ['Guilds', 'GuildMessages', 'MessageContent'],
        });

        this.client.login(process.env.DISCORD_BOT_TOKEN).catch((error) => {
            console.error('Failed to login to Discord:', error);
        });

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}`);
        });
    }

    async sendMessage(channelId: string, content: string): Promise<void> {
        try {
            const channel = (await this.client.channels.fetch(
                channelId
            )) as TextChannel;
            if (!channel) {
                throw new Error(`Channel ${channelId} not found`);
            }
            await channel.send(content);
        } catch (error) {
            console.error('Error sending message to Discord:', error);
            throw error;
        }
    }
}
