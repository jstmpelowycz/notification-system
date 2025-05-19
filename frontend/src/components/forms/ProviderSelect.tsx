import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { NotificationProvider } from '@/services/notification-channels.service';

interface ProviderSelectProps {
    providers: NotificationProvider[];
    value: string;
    onChange: (providerId: string) => void;
    disabled?: boolean;
}

export default function ProviderSelect({ providers, value, onChange, disabled }: ProviderSelectProps) {
    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Provider</InputLabel>
            <Select
                value={value}
                label="Provider"
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
            >
                {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                        {provider.displayName}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
} 