export interface NotificationProvider {
    sendMessage(channelId: string, content: string): Promise<void>;
}
