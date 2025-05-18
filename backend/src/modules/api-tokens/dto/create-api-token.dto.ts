import { IsOptional, IsString } from 'class-validator';

import { ApiToken } from '@/entities/api-token';

export class CreateApiTokenRequestDto {
    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateApiTokenResponseDto {
    plainTextToken: string;
    apiToken: ApiToken;
}
