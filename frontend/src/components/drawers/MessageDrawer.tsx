import { Alert, Box, Button, CircularProgress, Drawer, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

import ProviderSelect from '../selects/ProviderSelect';
import { Message, MessageStatus } from '@/services/messages.service';

interface MessageDrawerProps {
    open: boolean;
    onClose: () => void;
    message?: Message;
    onSubmit: (data: {
        slug: string;
        description: string;
        content: Record<string, unknown>;
        channelIds: string[];
        status?: MessageStatus;
    }) => Promise<void>;
    loading?: boolean;
    error?: string | null;
}

export default function MessageDrawer({
    open,
    onClose,
    message,
    onSubmit,
    loading = false,
    error = null,
}: MessageDrawerProps) {
    const [formData, setFormData] = useState({
        slug: '',
        description: '',
        content: {
            title: '',
            body: '',
        },
        channelIds: [] as string[],
        status: MessageStatus.INACTIVE,
    });

    useEffect(() => {
        if (message) {
            const content = JSON.parse(message.currentRevision.content.content);
            setFormData({
                slug: message.slug,
                description: message.description || '',
                content,
                channelIds: message.channels.map(channel => channel.id),
                status: message.status,
            });
        } else {
            setFormData({
                slug: '',
                description: '',
                content: {
                    title: '',
                    body: '',
                },
                channelIds: [],
                status: MessageStatus.INACTIVE,
            });
        }
    }, [message]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const handleStatusChange = (event: SelectChangeEvent<MessageStatus>) => {
        setFormData({
            ...formData,
            status: event.target.value as MessageStatus,
        });
    };

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
                    {message ? 'Edit Message' : 'Create Message'}
                </Typography>
                <IconButton onClick={onClose} disabled={loading}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    label="Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    disabled={!!message || loading}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Title"
                    value={formData.content.title}
                    onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, title: e.target.value },
                    })}
                    disabled={loading}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <TextField
                    label="Body"
                    value={formData.content.body}
                    onChange={(e) => setFormData({
                        ...formData,
                        content: { ...formData.content, body: e.target.value },
                    })}
                    multiline
                    rows={4}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                />

                <ProviderSelect
                    selectedChannelIds={formData.channelIds}
                    onChannelsChange={(channelIds) => setFormData({ ...formData, channelIds })}
                    disabled={loading}
                />

                {message && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={formData.status}
                            onChange={handleStatusChange}
                            label="Status"
                        >
                            <MenuItem value={MessageStatus.ACTIVE}>Active</MenuItem>
                            <MenuItem value={MessageStatus.INACTIVE}>Inactive</MenuItem>
                        </Select>
                    </FormControl>
                )}

                {!message && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Message will be created with an initial active revision. Further content changes will create new revisions.
                    </Alert>
                )}

                {error && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {message ? 'Update' : 'Create'}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
} 