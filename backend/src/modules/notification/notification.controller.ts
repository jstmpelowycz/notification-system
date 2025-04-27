import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post('send')
    async sendNotification(
        @Body() body: { channelId: string; content: string }
    ) {
        const { channelId, content } = body;

        console.log(channelId);

        await this.notificationService.sendNotification(
            '1362140551129862327',
            content
        );
        return { message: 'Notification sent successfully' };
    }
}
