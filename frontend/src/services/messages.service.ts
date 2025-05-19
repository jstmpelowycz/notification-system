import { API_CONFIG } from '@/config/api.config';
import { BaseApiService } from '@/services/base-api.service';
import { NotificationChannel } from './notification-channels.service';

export enum MessageStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum MessageRevisionStatus {
    ACTIVE = 'active',
    LOCKED = 'locked',
}

export interface MessageContent {
    revisionId: string;
    content: string;
}

export interface MessageRevision {
    id: string;
    displayId: number;
    status: MessageRevisionStatus;
    messageId: string;
    content: MessageContent;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    slug: string;
    description: string | null;
    status: MessageStatus;
    currentRevisionId: string;
    currentRevision: MessageRevision;
    revisions: MessageRevision[];
    channels: NotificationChannel[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateMessageRequest {
    slug: string;
    description: string;
    content: Record<string, unknown>;
    channelIds: string[];
}

export interface UpdateMessageRequest {
    description?: string;
    content?: Record<string, unknown>;
    channelIds?: string[];
    status?: MessageStatus;
}

export interface FindManyMessagesRequest {
    search?: string;
    status?: MessageStatus;
}

export class MessagesService extends BaseApiService {
    async list(query?: FindManyMessagesRequest) {
        return this.api.get<{ messages: Message[]; total: number }>(API_CONFIG.ENDPOINTS.MESSAGES.LIST, {
            params: query,
        });
    }

    async create(data: CreateMessageRequest) {
        return this.api.post<{ message: Message }>(API_CONFIG.ENDPOINTS.MESSAGES.CREATE, data);
    }

    async update(id: string, data: UpdateMessageRequest) {
        return this.api.put<{ message: Message }>(API_CONFIG.ENDPOINTS.MESSAGES.UPDATE(id), data);
    }

    async updateStatus(id: string, status: MessageStatus) {
        return this.api.patch<{ message: Message }>(API_CONFIG.ENDPOINTS.MESSAGES.UPDATE_STATUS(id), { status });
    }

    async dispatch(id: string) {
        return this.api.post<{ result: DispatchMessageResult }>(API_CONFIG.ENDPOINTS.DISPATCH.MESSAGE(id));
    }

    async activateRevision(messageId: string, revisionId: string) {
        return this.api.post<{ message: Message }>(
            API_CONFIG.ENDPOINTS.MESSAGES.ACTIVATE_REVISION(messageId, revisionId)
        );
    }
}

export interface DeliveryStats {
    successfullySent: number;
    failedToSend: number;
}

export interface ChannelDeliveryResult {
    channelName: string;
    providerType: string;
    status: 'success' | 'failure';
    error?: string;
}

export interface DispatchMessageResult {
    messageId: string;
    messageSlug: string;
    status: 'success' | 'failure';
    reason?: string;
    stats: DeliveryStats;
    channelResults: ChannelDeliveryResult[];
}

export const messagesService = new MessagesService(); 