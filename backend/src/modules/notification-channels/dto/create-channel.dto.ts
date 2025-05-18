import { IsEnum, IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

import { NotificationChannel, NotificationChannelStatus } from '@/entities/notification-channel';

export class CreateChannelRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(NotificationChannelStatus)
    status: NotificationChannelStatus;

    @IsObject()
    @IsNotEmpty()
    config: Record<string, unknown>;

    @IsUUID()
    @IsNotEmpty()
    providerId: string;
}

export class CreateChannelResponseDto {
    channel: NotificationChannel;
}
