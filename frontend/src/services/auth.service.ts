import { API_CONFIG } from '../config/api.config';

import { BaseApiService } from './base-api.service';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export class AuthService extends BaseApiService {
    async login(data: LoginRequest) {
        return this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, data);
    }

    async register(data: RegisterRequest) {
        return this.api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, data);
    }

    async logout() {
        return this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    }

    async me() {
        return this.api.get<{ user: User }>(API_CONFIG.ENDPOINTS.AUTH.ME);
    }
}

export const authService = new AuthService(); 