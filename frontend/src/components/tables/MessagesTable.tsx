import { Box, Button, IconButton, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import HistoryIcon from '@mui/icons-material/History';
import { useEffect, useState } from 'react';

import EmptyState from '../EmptyState';
import LoadingState from '../LoadingState';
import MessageDrawer from '../drawers/MessageDrawer';
import { messagesService, Message, MessageStatus, MessageRevision, MessageRevisionStatus } from '@/services/messages.service';
import { useNotificationStore } from '@/stores/notification.store';

export default function MessagesTable() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<Message | undefined>();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [revisionsAnchorEl, setRevisionsAnchorEl] = useState<HTMLElement | null>(null);
    const [selectedMessageForRevisions, setSelectedMessageForRevisions] = useState<Message | null>(null);
    const addNotification = useNotificationStore((state) => state.addNotification);

    const fetchMessages = async () => {
        try {
            const response = await messagesService.list();
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to fetch messages',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleRowClick = (message: Message) => {
        setSelectedMessage(message);
        setDrawerOpen(true);
    };

    const handleCreate = () => {
        setSelectedMessage(undefined);
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedMessage(undefined);
        setError(null);
    };

    const handleSubmit = async (data: {
        slug: string;
        description: string;
        content: Record<string, unknown>;
        channelIds: string[];
        status?: MessageStatus;
    }) => {
        setSaving(true);
        setError(null);

        try {
            if (selectedMessage) {
                await messagesService.update(selectedMessage.id, {
                    description: data.description,
                    content: data.content,
                    channelIds: data.channelIds,
                    status: data.status,
                });
                addNotification({
                    title: 'Success',
                    message: 'Message updated successfully',
                    type: 'success',
                });
            } else {
                await messagesService.create(data);
                addNotification({
                    title: 'Success',
                    message: 'Message created successfully',
                    type: 'success',
                });
            }
            await fetchMessages();
            handleDrawerClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to save message');
            addNotification({
                title: 'Error',
                message: 'Failed to save message',
                type: 'error',
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSend = async (id: string) => {
        try {
            await messagesService.dispatch(id);
            addNotification({
                title: 'Success',
                message: 'Message dispatched successfully',
                type: 'success',
            });
        } catch (error) {
            console.error('Failed to dispatch message:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to dispatch message',
                type: 'error',
            });
        }
    };

    const handleRevisionsClick = (event: React.MouseEvent<HTMLElement>, message: Message) => {
        event.stopPropagation();
        setRevisionsAnchorEl(event.currentTarget);
        setSelectedMessageForRevisions(message);
    };

    const handleRevisionsClose = () => {
        setRevisionsAnchorEl(null);
        setSelectedMessageForRevisions(null);
    };

    const handleRevisionActivate = async (revision: MessageRevision) => {
        if (!selectedMessageForRevisions) return;

        try {
            await messagesService.activateRevision(selectedMessageForRevisions.id, revision.id);
            await fetchMessages();
            addNotification({
                title: 'Success',
                message: 'Revision activated successfully',
                type: 'success',
            });
        } catch (error) {
            console.error('Failed to activate revision:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to activate revision',
                type: 'error',
            });
        } finally {
            handleRevisionsClose();
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
                    Create Message
                </Button>
            </Box>

            {messages.length === 0 ? (
                <EmptyState message="No messages yet!" />
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
                                <TableCell>Slug</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Current Revision</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {messages.map((message) => (
                                <TableRow
                                    key={message.id}
                                    onClick={() => handleRowClick(message)}
                                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
                                >
                                    <TableCell>{message.slug}</TableCell>
                                    <TableCell>{message.description || '-'}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                                            color={message.status === MessageStatus.ACTIVE ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        #{message.currentRevision.displayId}
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleRevisionsClick(e, message)}
                                            sx={{ ml: 1 }}
                                        >
                                            <HistoryIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{new Date(message.createdAt).toLocaleString()}</TableCell>
                                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                                        <IconButton
                                            size="small"
                                            color="success"
                                            disabled={message.status === MessageStatus.INACTIVE}
                                            onClick={() => handleSend(message.id)}
                                        >
                                            <SendIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Menu
                anchorEl={revisionsAnchorEl}
                open={Boolean(revisionsAnchorEl)}
                onClose={handleRevisionsClose}
                onClick={(e) => e.stopPropagation()}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        maxHeight: 300,
                        minWidth: 300,
                        boxShadow: 2,
                        mt: 1,
                        overflowY: 'auto'
                    }
                }}
            >
                {selectedMessageForRevisions?.revisions?.map((revision) => (
                    <MenuItem
                        key={revision.id}
                        onClick={() => handleRevisionActivate(revision)}
                        disabled={revision.status === MessageRevisionStatus.ACTIVE}
                        sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            py: 1,
                            px: 2,
                            ...(revision.status === MessageRevisionStatus.LOCKED && {
                                bgcolor: 'action.hover',
                                '&:hover': {
                                    bgcolor: 'action.selected'
                                }
                            })
                        }}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ 
                                fontWeight: revision.status === MessageRevisionStatus.LOCKED ? 500 : 400 
                            }}>
                                #{revision.displayId}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(revision.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {revision.status === MessageRevisionStatus.ACTIVE && (
                                <Chip
                                    label="Active"
                                    color="success"
                                    size="small"
                                />
                            )}
                            {revision.status === MessageRevisionStatus.LOCKED && (
                                <Chip
                                    label="Locked"
                                    color="info"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        </Box>
                    </MenuItem>
                ))}
            </Menu>

            <MessageDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                message={selectedMessage}
                onSubmit={handleSubmit}
                loading={saving}
                error={error}
            />
        </Box>
    );
}
