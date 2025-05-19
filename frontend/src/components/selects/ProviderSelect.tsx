import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';

import { notificationChannelsService, NotificationChannel } from '@/services/notification-channels.service';
import { notificationProvidersService, NotificationProvider } from '@/services/notification-providers.service';

interface ProviderSelectProps {
    selectedChannelIds: string[];
    onChannelsChange: (channelIds: string[]) => void;
    disabled?: boolean;
}

export default function ProviderSelect({ selectedChannelIds, onChannelsChange, disabled = false }: ProviderSelectProps) {
    const [providers, setProviders] = useState<NotificationProvider[]>([]);
    const [channels, setChannels] = useState<NotificationChannel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [providersResponse, channelsResponse] = await Promise.all([
                    notificationProvidersService.list(),
                    notificationChannelsService.list(),
                ]);
                setProviders(providersResponse.data.providers);
                setChannels(channelsResponse.data.channels);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const value = event.target.value;
        onChannelsChange(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Channels</InputLabel>
            <Select
                multiple
                value={selectedChannelIds}
                onChange={handleChange}
                label="Channels"
                disabled={disabled || loading}
            >
                {channels.map((channel) => (
                    <MenuItem key={channel.id} value={channel.id}>
                        {channel.name} ({channel.provider.displayName})
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
} 