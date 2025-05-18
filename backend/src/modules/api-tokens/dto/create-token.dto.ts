import { IsOptional, IsString } from 'class-validator';

import { ApiToken } from '@/entities/api-token';

export class CreateTokenRequestDto {
    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateTokenResponseDto {
    plainTextToken: string;
    token: ApiToken;
}
