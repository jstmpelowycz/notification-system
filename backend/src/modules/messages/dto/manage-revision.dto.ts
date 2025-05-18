import { IsUUID } from 'class-validator';

import { Message } from '@/entities/message';

export class ManageRevisionRequestDto {
    @IsUUID()
    messageId: string;

    @IsUUID()
    revisionId: string;
}

export class ManageRevisionResponseDto {
    message: Message;
}
