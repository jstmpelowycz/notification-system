import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { DispatchStrategy, MessageContent } from './dispatch-strategy.interface';

@Injectable()
export class MSTeamsDispatchStrategy implements DispatchStrategy {
    async dispatch(webhookUrl: string, content: MessageContent): Promise<void> {
        await axios.post(webhookUrl, {
            type: 'message',
            attachments: [
                {
                    contentType: 'application/vnd.microsoft.card.adaptive',
                    content: {
                        type: 'AdaptiveCard',
                        $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                        version: '1.2',
                        body: [
                            {
                                type: 'TextBlock',
                                text: content.title,
                                weight: 'bolder',
                                size: 'medium',
                            },
                            {
                                type: 'TextBlock',
                                text: content.body,
                                wrap: true,
                            },
                        ],
                    },
                },
            ],
        });
    }
}
