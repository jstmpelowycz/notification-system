export interface BaseDeliveryStats {
    successfullySent: number;
    failedToSend: number;
}

interface CompleteDeliveryStats extends BaseDeliveryStats {
    totallyProcessed: number;
}

export interface DispatchMessageResult {
    messageId: string;
    stats: CompleteDeliveryStats;
}
