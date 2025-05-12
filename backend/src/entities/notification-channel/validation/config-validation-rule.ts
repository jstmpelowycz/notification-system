interface NotificationChannelConfigValidationRule {
    validate: (config: Record<string, unknown>) => boolean;
    errorMessage: string;
}

export const WEBHOOK_PROVIDER_INTEGRATION_TYPE_CVR: NotificationChannelConfigValidationRule = {
    validate: config => 'webhook_url' in config,
    errorMessage: 'Config must be defined with "webhook_url"',
};
