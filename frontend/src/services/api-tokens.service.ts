import { API_CONFIG } from '@/config/api.config';
import { BaseApiService } from '@/services/base-api.service';

export interface ApiToken {
    id: string;
    prefix: string;
    description: string | null;
    createdAt: string;
    revokedAt: string | null;
}

export interface CreateApiTokenRequest {
    description?: string;
}

export interface CreateApiTokenResponse {
    plainTextToken: string;
    token: ApiToken;
}

export class ApiTokensService extends BaseApiService {
    async create(data: CreateApiTokenRequest) {
        return this.api.post<CreateApiTokenResponse>(API_CONFIG.ENDPOINTS.API_TOKENS.CREATE, data);
    }

    async list() {
        return this.api.get<{ tokens: ApiToken[] }>(API_CONFIG.ENDPOINTS.API_TOKENS.LIST);
    }

    async revoke(id: string) {
        return this.api.delete(API_CONFIG.ENDPOINTS.API_TOKENS.REVOKE(id));
    }
}

export const apiTokensService = new ApiTokensService(); 