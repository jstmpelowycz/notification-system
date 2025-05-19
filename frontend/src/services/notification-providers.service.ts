import { API_CONFIG } from '@/config/api.config';
import { BaseApiService } from '@/services/base-api.service';
import { NotificationChannel, NotificationProviderIntegrationType, NotificationProviderType } from './notification-channels.service';

export interface NotificationProvider {
    id: string;
    displayName: string;
    type: NotificationProviderType;
    integrationType: NotificationProviderIntegrationType;
    channels: NotificationChannel[];
    createdAt: string;
    updatedAt: string;
}

export class NotificationProvidersService extends BaseApiService {
    async list() {
        return this.api.get<{ providers: NotificationProvider[] }>(API_CONFIG.ENDPOINTS.NOTIFICATION_PROVIDERS.LIST);
    }
}

export const notificationProvidersService = new NotificationProvidersService(); 