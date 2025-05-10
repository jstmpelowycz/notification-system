import { ApiToken } from '@/modules/api-tokens/entities/api-token.entity';

export class CreateApiTokenRequestDto {
    description?: string;
}

export class CreateApiTokenResponseDto {
    plainTextToken: string;
    apiToken: ApiToken;
}
