import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

import { NotificationChannelStatus, NotificationChannel } from '@/entities/notification-channel';

export class UpdateChannelRequestDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEnum(NotificationChannelStatus)
    @IsOptional()
    status?: NotificationChannelStatus;

    @IsObject()
    @IsOptional()
    config?: Record<string, unknown>;
}

export class UpdateChannelResponseDto {
    channel: NotificationChannel;
}
