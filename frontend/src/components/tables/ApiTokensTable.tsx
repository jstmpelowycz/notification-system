import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';

import EmptyState from '../EmptyState';
import LoadingState from '../LoadingState';
import CreateApiTokenModal from '../modals/CreateApiTokenModal';
import { apiTokensService, ApiToken } from '@/services/api-tokens.service';
import { useNotificationStore } from '@/stores/notification.store';

export default function ApiTokensTable() {
    const [tokens, setTokens] = useState<ApiToken[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [revokingTokenIds, setRevokingTokenIds] = useState<Set<string>>(new Set());
    const addNotification = useNotificationStore((state) => state.addNotification);

    const fetchTokens = async () => {
        try {
            const response = await apiTokensService.list();
            setTokens(response.data.tokens);
        } catch (error) {
            console.error('Failed to fetch API tokens:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to fetch API tokens',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const handleRevoke = async (id: string) => {
        setRevokingTokenIds((prev) => new Set(prev).add(id));
        try {
            await apiTokensService.revoke(id);
            await fetchTokens();
            addNotification({
                title: 'Success',
                message: 'API token revoked successfully',
                type: 'success',
            });
        } catch (error) {
            console.error('Failed to revoke API token:', error);
            addNotification({
                title: 'Error',
                message: 'Failed to revoke API token',
                type: 'error',
            });
        } finally {
            setRevokingTokenIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
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
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Token
                </Button>
            </Box>

            {tokens.length === 0 ? (
                <EmptyState message="No API tokens yet!" />
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
                                <TableCell>Token Prefix</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Created At</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tokens
                                .sort((a, b) => {
                                    if (!a.revokedAt && b.revokedAt) return -1;
                                    if (a.revokedAt && !b.revokedAt) return 1;
                                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                })
                                .map((token) => (
                                <TableRow key={token.id}>
                                    <TableCell>{token.prefix}</TableCell>
                                    <TableCell>{token.description || '-'}</TableCell>
                                    <TableCell>{new Date(token.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={token.revokedAt ? 'Revoked' : 'Active'}
                                            color={token.revokedAt ? 'default' : 'success'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            color="error"
                                            disabled={!!token.revokedAt || revokingTokenIds.has(token.id)}
                                            onClick={() => handleRevoke(token.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <CreateApiTokenModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchTokens();
                }}
            />
        </Box>
    );
}
