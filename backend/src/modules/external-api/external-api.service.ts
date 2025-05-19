import { Injectable } from '@nestjs/common';

import { MessageStatus } from '@/entities/message';
import { DispatchService } from '@/modules/dispatch/dispatch.service';
import { DispatchMessageResult } from '@/modules/dispatch/types/dispatch-message-result';
import { EXTERNAL_API_ERROR_MESSAGES } from '@/modules/external-api/constants/error-messages';
import { MessagesService } from '@/modules/messages/messages.service';

@Injectable()
export class ExternalApiService {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly dispatchService: DispatchService
    ) {}

    async dispatchMessageBySlug(slug: string): Promise<DispatchMessageResult> {
        const message = await this.messagesService.findBySlug(slug);

        if (!message) {
            throw new Error(EXTERNAL_API_ERROR_MESSAGES.MESSAGE_NOT_FOUND);
        }

        if (message.status !== MessageStatus.ACTIVE) {
            throw new Error(EXTERNAL_API_ERROR_MESSAGES.MESSAGE_INACTIVE);
        }

        return this.dispatchService.dispatchMessage(message.id);
    }
}
