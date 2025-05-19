import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';

import EmptyState from '../EmptyState';
import LoadingState from '../LoadingState';
import ChannelDrawer from '../drawers/ChannelDrawer';
import { 
    notificationChannelsService, 
    NotificationChannel, 
    NotificationChannelStatus,
    CreateChannelRequest,
    UpdateChannelRequest 
} from '@/services/notification-channels.service';
import { useNotificationStore } from '@/stores/notification.store';

export default function ChannelsTable() {
    const [channels, setChannels] = useState<NotificationChannel[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<NotificationChannel | undefined>();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const addNotification = useNotificationStore((state) => state.addNotification);

    const fetchChannels = async () => {
        try {
            const response = await notificationChannelsService.list();
            setChannels(response.data.channels);
        } catch (error) {
            console.error('Failed to fetch channels:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to fetch channels',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChannels();
    }, []);

    const handleRowClick = (channel: NotificationChannel) => {
        setSelectedChannel(channel);
        setDrawerOpen(true);
    };

    const handleCreate = () => {
        setSelectedChannel(undefined);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedChannel(undefined);
        setError(null);
    };

    const handleSubmit = async (data: {
        name: string;
        status: NotificationChannelStatus;
        config: Record<string, unknown>;
        providerId?: string;
    }) => {
        setSaving(true);
        setError(null);

        try {
            if (selectedChannel) {
                await notificationChannelsService.update(selectedChannel.id, data as UpdateChannelRequest);
                addNotification({
                    title: 'Success',
                    message: 'Channel updated successfully',
                    type: 'success',
                });
            } else {
                if (!data.providerId) {
                    throw new Error('Provider ID is required');
                }
                await notificationChannelsService.create(data as CreateChannelRequest);
                addNotification({
                    title: 'Success',
                    message: 'Channel created successfully',
                    type: 'success',
                });
            }
            await fetchChannels();
            handleDrawerClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save channel');
            addNotification({
                title: 'Error',
                message: 'Failed to save channel',
                type: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingState />;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}
                >
                    Create Channel
                </Button>
            </Box>

            {channels.length === 0 ? (
                <EmptyState message="No notification channels yet!" />
            ) : (
                <TableContainer
                    component={Paper}
                    sx={{
                        width: '100%',
                        boxShadow: 'none',
                        border: '1px solid rgba(0,0,0,0.12)',
                        borderRadius: 1
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Provider</TableCell>
                                <TableCell>Integration Type</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {channels.map((channel) => (
                                <TableRow
                                    key={channel.id}
                                    onClick={() => handleRowClick(channel)}
                                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                >
                                    <TableCell>{channel.name}</TableCell>
                                    <TableCell>{channel.provider.displayName}</TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>
                                        {channel.provider.integrationType.replace('_', ' ')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                                            color={channel.status === NotificationChannelStatus.ACTIVE ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{new Date(channel.createdAt).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ChannelDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                channel={selectedChannel}
                onSubmit={handleSubmit}
                loading={saving}
                error={error}
            />
        </Box>
    );
}
