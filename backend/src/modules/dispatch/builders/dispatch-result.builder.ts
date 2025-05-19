import { Message } from '@/entities/message';
import { DISPATCH_INFO_MESSAGES } from '@/modules/dispatch/constants/info-messages';

import { DeliveryStats, ChannelDeliveryResult, DispatchMessageResult } from '../types/dispatch-message-result';

export class DispatchResultBuilder {
    private readonly result: DispatchMessageResult;

    constructor(messageId: string, messageSlug: string = '') {
        this.result = {
            messageId,
            messageSlug,
            status: 'failure',
            stats: { successfullySent: 0, failedToSend: 0 },
            channelResults: [],
        };
    }

    withMessage(message: Message): this {
        this.result.messageSlug = message.slug;

        return this;
    }

    withFailureReason(reason: string): this {
        this.result.reason = reason;

        return this;
    }

    withChannelResults(results: ChannelDeliveryResult[]): this {
        this.result.channelResults = results;
        this.result.stats = this.calculateStats(results);
        this.result.status = this.result.stats.failedToSend === 0 ? 'success' : 'failure';

        return this;
    }

    build(): DispatchMessageResult {
        return this.result;
    }

    static createMessageNotFound(messageId: string): DispatchMessageResult {
        return new DispatchResultBuilder(messageId).withFailureReason(DISPATCH_INFO_MESSAGES.MESSAGE_NOT_FOUND).build();
    }

    static createInactiveMessage(message: Message): DispatchMessageResult {
        return new DispatchResultBuilder(message.id)
            .withMessage(message)
            .withFailureReason(DISPATCH_INFO_MESSAGES.INACTIVE_MESSAGE)
            .build();
    }

    static createNoChannels(message: Message): DispatchMessageResult {
        return new DispatchResultBuilder(message.id)
            .withMessage(message)
            .withFailureReason(DISPATCH_INFO_MESSAGES.MESSAGE_HAS_NO_CHANNELS)
            .build();
    }

    static createAllChannelsInactive(message: Message): DispatchMessageResult {
        return new DispatchResultBuilder(message.id)
            .withMessage(message)
            .withFailureReason(DISPATCH_INFO_MESSAGES.ALL_CHANNELS_INACTIVE)
            .build();
    }

    private calculateStats(results: ChannelDeliveryResult[]): DeliveryStats {
        return {
            successfullySent: results.filter(result => result.status === 'success').length,
            failedToSend: results.filter(result => result.status === 'failure').length,
        };
    }
}
