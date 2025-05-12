import { ApiToken } from '@/entities/api-token';

export class CreateApiTokenRequestDto {
    description?: string;
}

export class CreateApiTokenResponseDto {
    plainTextToken: string;
    apiToken: ApiToken;
}
