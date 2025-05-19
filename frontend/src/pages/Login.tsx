import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    Alert,
} from '@mui/material';
import { useEffect , useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

import { authService, LoginRequest } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';
import { useNotificationStore } from '../stores/notification.store';

export default function Login() {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const addNotification = useNotificationStore((state) => state.addNotification);

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(formData);
            setUser(response.data.user);
            addNotification({
                title: 'Success',
                message: 'Login successful! Welcome back.',
                type: 'success',
            });
            navigate('/', { replace: true });
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : 'Failed to login');
            addNotification({
                title: 'Error',
                message: 'Login failed. Please check your credentials.',
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign In
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                Don't have an account? Sign up
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
