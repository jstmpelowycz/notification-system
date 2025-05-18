import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { FindAllProvidersResponseDto } from '@/modules/notification-providers/dto/find-all-providers.dto';
import { NotificationProvidersService } from '@/modules/notification-providers/notification-providers.service';

@Controller('notification-providers')
@UseGuards(JwtAuthGuard)
export class NotificationProvidersController {
    constructor(private readonly notificationProvidersService: NotificationProvidersService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<FindAllProvidersResponseDto> {
        const providers = await this.notificationProvidersService.findAll();

        return { providers };
    }
}
