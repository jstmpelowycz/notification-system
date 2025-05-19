import axios, { AxiosInstance } from 'axios';

import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../stores/auth.store';

export class BaseApiService {
    protected readonly api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
                    useAuthStore.getState().setUserFromBackend(null);
                    window.location.replace('/login');
                }
                return Promise.reject(error);
            }
        );
    }
}
