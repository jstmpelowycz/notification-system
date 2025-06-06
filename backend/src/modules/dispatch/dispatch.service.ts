import { Injectable } from '@nestjs/common';

import { Message, MessageStatus } from '@/entities/message';
import { NotificationChannel, NotificationChannelStatus } from '@/entities/notification-channel';
import { MessagesService } from '@/modules/messages/messages.service';

import { DispatchResultBuilder } from './builders/dispatch-result.builder';
import { DispatchStrategyFactory } from './factories/dispatch-strategy.factory';
import { MessageContent } from './strategies/dispatch-strategy.interface';
import { ChannelDeliveryResult, DispatchMessageResult } from './types/dispatch-message-result';

const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1000;

@Injectable()
export class DispatchService {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly dispatchStrategyFactory: DispatchStrategyFactory
    ) {}

    async dispatchMessage(messageId: string): Promise<DispatchMessageResult> {
        const message = await this.messagesService.findById(messageId);

        if (!message) {
            return DispatchResultBuilder.createMessageNotFound(messageId);
        }

        if (message.status !== MessageStatus.ACTIVE) {
            return DispatchResultBuilder.createInactiveMessage(message);
        }

        if (!message.channels.length) {
            return DispatchResultBuilder.createNoChannels(message);
        }

        const activeChannels = message.channels.filter(channel => channel.status === NotificationChannelStatus.ACTIVE);

        if (!activeChannels.length) {
            return DispatchResultBuilder.createAllChannelsInactive(message);
        }

        const channelResults = await this.dispatchToChannels(message, activeChannels);

        return new DispatchResultBuilder(message.id).withMessage(message).withChannelResults(channelResults).build();
    }

    private async dispatchToChannels(
        message: Message,
        channels: NotificationChannel[]
    ): Promise<ChannelDeliveryResult[]> {
        return Promise.all(
            channels.map(async channel => {
                try {
                    await this.dispatchToChannelWithRetry(message, channel);

                    return {
                        channelName: channel.name,
                        providerType: channel.provider.type,
                        status: 'success',
                    };
                } catch (error) {
                    return {
                        channelName: channel.name,
                        providerType: channel.provider.type,
                        status: 'failure',
                        error: error instanceof Error ? error.message : 'Unknown error',
                        retriesAttempted: RETRY_ATTEMPTS,
                    };
                }
            })
        );
    }

    private async dispatchToChannelWithRetry(message: Message, channel: NotificationChannel): Promise<void> {
        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
            try {
                const content = JSON.parse(message.currentRevision.content.content) as MessageContent;
                const strategy = this.dispatchStrategyFactory.getStrategy(channel.provider.type);

                await strategy.dispatch(channel.config.webhookUrl as string, content);

                return;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('Unknown error');

                if (attempt < RETRY_ATTEMPTS) {
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                    continue;
                }
            }
        }

        throw lastError;
    }
}
