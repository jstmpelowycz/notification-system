import { Injectable } from '@nestjs/common';

import { Message, MessageStatus } from '@/entities/message';
import { NotificationChannel } from '@/entities/notification-channel';
import { MessagesService } from '@/modules/messages/messages.service';

import { DISPATCH_ERROR_MESSAGES } from './constants/error-messages';
import { DispatchStrategyFactory } from './factories/dispatch-strategy.factory';
import { MessageContent } from './strategies/dispatch-strategy.interface';
import { BaseDeliveryStats, DispatchMessageResult } from './types/dispatch-message-result';

@Injectable()
export class DispatchService {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly dispatchStrategyFactory: DispatchStrategyFactory
    ) {}

    async dispatchMessage(messageId: string): Promise<DispatchMessageResult> {
        const message = await this.messagesService.getById(messageId, {
            status: MessageStatus.ACTIVE,
        });

        if (!message.channels.length) {
            throw new Error(DISPATCH_ERROR_MESSAGES.NO_CHANNELS);
        }

        const results = await Promise.allSettled(
            message.channels.map(channel => this.dispatchToChannel(message, channel))
        );

        return {
            messageId: message.id,
            stats: {
                totallyProcessed: message.channels.length,
                ...this.getBaseDeliveryStats(results),
            },
        };
    }

    private async dispatchToChannel(message: Message, channel: NotificationChannel): Promise<void> {
        const content = JSON.parse(message.currentRevision.content.content) as MessageContent;
        const strategy = this.dispatchStrategyFactory.getStrategy(channel.provider.type);

        await strategy.dispatch(channel.config.webhookUrl as string, content);
    }

    private getBaseDeliveryStats(results: PromiseSettledResult<void>[]): BaseDeliveryStats {
        return {
            successfullySent: results.filter(result => result.status === 'fulfilled').length,
            failedToSend: results.filter(result => result.status === 'rejected').length,
        };
    }
}
