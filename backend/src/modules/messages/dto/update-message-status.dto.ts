import { IsEnum } from 'class-validator';

import { Message, MessageStatus } from '@/entities/message';

export class UpdateMessageStatusRequestDto {
    @IsEnum(MessageStatus)
    status: MessageStatus;
}

export class UpdateMessageStatusResponseDto {
    message: Message;
}
