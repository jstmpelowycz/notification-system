import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

import { 
    NotificationChannel, 
    NotificationProvider, 
    NotificationProviderIntegrationType,
    NotificationChannelStatus 
} from '@/services/notification-channels.service';
import { notificationProvidersService } from '@/services/notification-providers.service';
import { useNotificationStore } from '@/stores/notification.store';

import ProviderSelect from './ProviderSelect';

interface ChannelFormProps {
    channel?: NotificationChannel;
    onSubmit: (data: {
        name: string;
        status: NotificationChannelStatus;
        config: Record<string, unknown>;
        providerId?: string;
    }) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
    error: string | null;
}

export default function ChannelForm({ channel, onSubmit, onCancel, loading, error }: ChannelFormProps) {
    const [formData, setFormData] = useState({
        name: channel?.name || '',
        status: channel?.status || NotificationChannelStatus.INACTIVE,
        config: channel?.config || {},
        providerId: channel?.providerId || '',
    });
    const [providers, setProviders] = useState<NotificationProvider[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        const fetchProviders = async () => {
            if (channel) return;
            
            setLoadingProviders(true);
            try {
                const response = await notificationProvidersService.list();
                setProviders(response.data.providers);
            } catch (error) {
                console.error('Failed to fetch providers:', error);
                addNotification({
                    title: 'Error',
                    message: 'Failed to fetch providers',
                    type: 'error',
                });
            } finally {
                setLoadingProviders(false);
            }
        };

        fetchProviders();
    }, [channel, addNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const handleConfigChange = (value: string) => {
        const provider = providers.find(p => p.id === formData.providerId) || channel?.provider;
        
        if (provider?.integrationType === NotificationProviderIntegrationType.WEBHOOK) {
            setFormData(prev => ({
                ...prev,
                config: { ...prev.config, webhookUrl: value },
            }));
        }
    };

    const selectedProvider = providers.find(p => p.id === formData.providerId) || channel?.provider;

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={loading}
                required
                sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as NotificationChannelStatus }))}
                    disabled={loading}
                >
                    <MenuItem value={NotificationChannelStatus.ACTIVE}>Active</MenuItem>
                    <MenuItem value={NotificationChannelStatus.INACTIVE}>Inactive</MenuItem>
                </Select>
            </FormControl>

            {!channel && (
                <Box sx={{ mb: 2 }}>
                    <ProviderSelect
                        providers={providers}
                        value={formData.providerId}
                        onChange={(providerId) => setFormData(prev => ({ ...prev, providerId }))}
                        disabled={loading || loadingProviders}
                    />
                </Box>
            )}

            {selectedProvider?.integrationType === NotificationProviderIntegrationType.WEBHOOK && (
                <TextField
                    fullWidth
                    label="Webhook URL"
                    value={formData.config.webhookUrl || ''}
                    onChange={(e) => handleConfigChange(e.target.value)}
                    disabled={loading}
                    required
                    sx={{ mb: 2 }}
                />
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {channel ? 'Update' : 'Create'}
                </Button>
            </Box>
        </Box>
    );
} 