import { IsArray, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

import { Message, MessageStatus } from '@/entities/message';

export class UpdateMessageRequestDto {
    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    @IsNotEmpty()
    @IsOptional()
    content?: Record<string, unknown>;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsOptional()
    channelIds?: string[];

    @IsEnum(MessageStatus)
    @IsOptional()
    status?: MessageStatus;
}

export class UpdateMessageResponseDto {
    message: Message;
}
