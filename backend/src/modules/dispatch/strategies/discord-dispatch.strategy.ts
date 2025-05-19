import { Injectable } from '@nestjs/common';
import { WebhookClient } from 'discord.js';

import { DispatchStrategy, MessageContent } from './dispatch-strategy.interface';

@Injectable()
export class DiscordDispatchStrategy implements DispatchStrategy {
    async dispatch(webhookUrl: string, content: MessageContent): Promise<void> {
        const webhook = new WebhookClient({ url: webhookUrl });

        await webhook.send({
            username: 'Notification System',
            embeds: [
                {
                    title: content.title,
                    description: content.body,
                },
            ],
        });
    }
}
