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
