import { IsEnum, IsOptional, IsString } from 'class-validator';

import { Message, MessageStatus } from '@/entities/message';

export class FindByQueryMessagesRequestDto {
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(MessageStatus)
    @IsOptional()
    status?: MessageStatus;
}

export class FindAllMessagesResponseDto {
    messages: Message[];
    total: number;
}
