import { IsArray, IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';

import { Message } from '@/entities/message';

export class CreateMessageRequestDto {
    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsObject()
    @IsNotEmpty()
    content: Record<string, unknown>;

    @IsArray()
    @IsUUID('4', { each: true })
    @IsNotEmpty()
    channelIds: string[];
}

export class CreateMessageResponseDto {
    message: Message;
}
