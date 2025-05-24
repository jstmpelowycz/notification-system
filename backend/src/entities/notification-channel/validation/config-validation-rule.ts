



interface NotificationChannelConfigValidationRule {
    validate: (config: Record<string, unknown>) => boolean;
    errorMessage: string;
}

export const WEBHOOK_PROVIDER_INTEGRATION_TYPE_CONFIG_VALIDATION_RULE: NotificationChannelConfigValidationRule = {
    validate: config => (
        'webhookUrl' in config
        && typeof config.webhookUrl === 'string'
    ),
    errorMessage: 'Config must be defined with "webhookUrl"',
};
