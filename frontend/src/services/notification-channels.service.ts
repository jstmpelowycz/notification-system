import { API_CONFIG } from '@/config/api.config';
import { BaseApiService } from '@/services/base-api.service';

import { Message } from './messages.service';

export enum NotificationProviderType {
    DISCORD = 'discord',
    MS_TEAMS = 'ms_teams',
}

export enum NotificationProviderIntegrationType {
    WEBHOOK = 'webhook',
}

export enum NotificationChannelStatus {
    INACTIVE = 'inactive',
    ACTIVE = 'active',
}

export interface NotificationProvider {
    id: string;
    displayName: string;
    type: NotificationProviderType;
    integrationType: NotificationProviderIntegrationType;
    channels: NotificationChannel[];
    createdAt: string;
    updatedAt: string;
}

export interface NotificationChannel {
    id: string;
    name: string;
    status: NotificationChannelStatus;
    config: Record<string, unknown>;
    providerId: string;
    provider: NotificationProvider;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateChannelRequest {
    name: string;
    status: NotificationChannelStatus;
    config: Record<string, unknown>;
    providerId: string;
}

export interface UpdateChannelRequest {
    name?: string;
    status?: NotificationChannelStatus;
    config?: Record<string, unknown>;
}

export class NotificationChannelsService extends BaseApiService {
    async list() {
        return this.api.get<{ channels: NotificationChannel[] }>(API_CONFIG.ENDPOINTS.NOTIFICATION_CHANNELS.LIST);
    }

    async create(data: CreateChannelRequest) {
        return this.api.post<{ channel: NotificationChannel }>(API_CONFIG.ENDPOINTS.NOTIFICATION_CHANNELS.CREATE, data);
    }

    async update(id: string, data: UpdateChannelRequest) {
        return this.api.patch<{ channel: NotificationChannel }>(API_CONFIG.ENDPOINTS.NOTIFICATION_CHANNELS.UPDATE(id), data);
    }
}

export const notificationChannelsService = new NotificationChannelsService();
