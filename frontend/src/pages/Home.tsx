import { Box, Container, Typography, Paper } from '@mui/material';

import { useAuthStore } from '../stores/auth.store';

export default function Home() {
    const user = useAuthStore((state) => state.user);

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to Notification System
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Hello, {user?.firstName} {user?.lastName}!
                    </Typography>
                    <Typography variant="body1">
                        This is your dashboard where you can manage your notification channels, API tokens, and messages.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
} 