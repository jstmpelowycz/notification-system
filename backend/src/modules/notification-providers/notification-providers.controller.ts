import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';

import { NotificationProvider } from '@/entities/notification-provider';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { NotificationProvidersService } from '@/modules/notification-providers/notification-providers.service';

@Controller('notification-providers')
@UseGuards(JwtAuthGuard)
export class NotificationProvidersController {
    constructor(private readonly notificationProvidersService: NotificationProvidersService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<NotificationProvider[]> {
        return this.notificationProvidersService.findAll();
    }
}
