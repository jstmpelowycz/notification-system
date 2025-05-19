import { Box, Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ChannelForm from '../forms/ChannelForm';
import { NotificationChannel, NotificationChannelStatus } from '@/services/notification-channels.service';

interface ChannelDrawerProps {
    open: boolean;
    onClose: () => void;
    channel?: NotificationChannel;
    onSubmit: (data: {
        name: string;
        status: NotificationChannelStatus;
        config: Record<string, unknown>;
        providerId?: string;
    }) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export default function ChannelDrawer({ open, onClose, channel, onSubmit, loading, error }: ChannelDrawerProps) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: '100%',
                    maxWidth: 500,
                    p: 3,
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">
                    {channel ? 'Edit Channel' : 'Create Channel'}
                </Typography>
                <IconButton onClick={onClose} disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <ChannelForm
                channel={channel}
                onSubmit={onSubmit}
                onCancel={onClose}
                loading={loading}
                error={error}
            />
        </Drawer>
    );
} 