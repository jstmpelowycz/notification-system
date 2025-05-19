import { IsNotEmpty, IsString } from 'class-validator';

import { DispatchMessageResult } from '@/modules/dispatch/types/dispatch-message-result';

export class DispatchMessageBySlugRequestDto {
    @IsString()
    @IsNotEmpty()
    slug: string;
}

export class DispatchMessageBySlugResponseDto {
    result: DispatchMessageResult;
}
