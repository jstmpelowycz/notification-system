import { IsArray, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

import { Message } from '@/entities/message';

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
}

export class UpdateMessageResponseDto {
    message: Message;
}
