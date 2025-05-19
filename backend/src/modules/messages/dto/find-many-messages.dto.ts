import { IsEnum, IsOptional, IsString } from 'class-validator';

import { Message, MessageStatus } from '@/entities/message';

export class FindManyMessagesRequestDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(MessageStatus)
    @IsOptional()
    status?: MessageStatus;
}

export class FindManyMessagesResponseDto {
    messages: Message[];
    total: number;
}
