export const API_CONFIG = {
    BASE_URL: 'http://localhost:3001',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            ME: '/auth/me',
        },
        API_TOKENS: {
            BASE: '/api-tokens',
            CREATE: '/api-tokens',
            LIST: '/api-tokens',
            REVOKE: (id: string) => `/api-tokens/${id}`,
        },
        NOTIFICATION_CHANNELS: {
            BASE: '/notification-channels',
            LIST: '/notification-channels',
            CREATE: '/notification-channels',
            UPDATE: (id: string) => `/notification-channels/${id}`,
        },
        NOTIFICATION_PROVIDERS: {
            BASE: '/notification-providers',
            LIST: '/notification-providers',
        },
        MESSAGES: {
            BASE: '/messages',
            LIST: '/messages',
            CREATE: '/messages',
            UPDATE: (id: string) => `/messages/${id}`,
            UPDATE_STATUS: (id: string) => `/messages/${id}/status`,
            ACTIVATE_REVISION: (messageId: string, revisionId: string) => `/messages/${messageId}/revisions/${revisionId}/activate`,
        },
        DISPATCH: {
            MESSAGE: (id: string) => `/dispatch/messages/${id}`,
        },
    },
} as const; 