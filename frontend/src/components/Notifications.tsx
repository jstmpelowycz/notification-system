import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState } from 'react';

import { useNotificationStore } from '../stores/notification.store';

export default function Notifications() {
    const [open, setOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<{
        id: string;
        title: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
    } | null>(null);

    const notifications = useNotificationStore((state) => state.notifications);
    const removeNotification = useNotificationStore((state) => state.removeNotification);

    useEffect(() => {
        if (notifications.length > 0 && !currentNotification) {
            const [latestNotification] = notifications;
            setCurrentNotification(latestNotification);
            setOpen(true);
        }
    }, [notifications, currentNotification]);

    const handleClose = (_: unknown, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        if (currentNotification) {
            removeNotification(currentNotification.id);
            setCurrentNotification(null);
        }
    };

    if (!currentNotification) {
        return null;
    }

    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={currentNotification.type}
                variant="filled"
                sx={{ width: '100%' }}
            >
                <strong>{currentNotification.title}</strong>
                <br />
                {currentNotification.message}
            </Alert>
        </Snackbar>
    );
}
