export interface MessageContent {
    title: string;
    body: string;
}

export interface DispatchStrategy {
    dispatch(webhookUrl: string, content: MessageContent): Promise<void>;
}
