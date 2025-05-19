import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import { useState } from 'react';

import { apiTokensService } from '@/services/api-tokens.service';
import { useNotificationStore } from '@/stores/notification.store';

interface CreateApiTokenModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateApiTokenModal({ open, onClose, onSuccess }: CreateApiTokenModalProps) {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createdToken, setCreatedToken] = useState<string | null>(null);
    const [hasCopied, setHasCopied] = useState(false);
    const addNotification = useNotificationStore((state) => state.addNotification);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiTokensService.create({ description });
            setCreatedToken(response.data.plainTextToken);
            addNotification({
                title: 'Success',
                message: 'API token created successfully',
                type: 'success',
            });
            onSuccess();
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Failed to create API token');
            addNotification({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Failed to create API token',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (createdToken && !hasCopied) {
            const confirmClose = window.confirm('Are you sure you want to close? You haven\'t copied the token yet and won\'t be able to see it again.');
            if (!confirmClose) {
                return;
            }
        }
        if (createdToken) {
            onSuccess();
        }
        setDescription('');
        setError(null);
        setCreatedToken(null);
        setHasCopied(false);
        onClose();
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(createdToken || '');
            setHasCopied(true);
            addNotification({
                title: 'Success',
                message: 'Token copied to clipboard',
                type: 'success',
            });
        } catch {
            addNotification({
                title: 'Error',
                message: 'Failed to copy token to clipboard',
                type: 'error',
            });
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth
            disableEscapeKeyDown={!!createdToken && !hasCopied}
        >
            <DialogTitle>Create API Token</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {createdToken ? (
                    <Box sx={{ mt: 2 }}>
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            <strong>IMPORTANT:</strong> This token will only be shown once and cannot be recovered. 
                            Please copy it now and store it securely.
                        </Alert>
                        <Box sx={{ position: 'relative' }}>
                            <TextField
                                fullWidth
                                value={createdToken}
                                label="API Token"
                                variant="outlined"
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (
                                        <Tooltip title="Copy to clipboard">
                                            <IconButton 
                                                onClick={handleCopy}
                                                edge="end"
                                                sx={{ color: hasCopied ? 'success.main' : 'inherit' }}
                                            >
                                                <ContentCopyIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                }}
                            />
                        </Box>
                    </Box>
                ) : (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleClose} 
                    disabled={loading}
                    color={createdToken && !hasCopied ? 'warning' : 'primary'}
                >
                    {createdToken ? (hasCopied ? 'Close' : 'Close Without Copying') : 'Cancel'}
                </Button>
                {!createdToken && (
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
} 