import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppBar, Box, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { authService } from '../services/auth.service';
import { useAuthStore } from '../stores/auth.store';

const TITLES: Record<string, string> = {
    '/api-tokens': 'API Tokens',
    '/channels': 'Notification Channels',
    '/messages': 'Messages',
};

export default function Header() {
    const { pathname } = useLocation();
    const authStore = useAuthStore();
    const title = TITLES[pathname] || 'Dashboard';
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authService.logout();
            logout();
            authStore.setUser(null);
            navigate('/login');
        } catch {
            // Handle error silently
        }
    };

    return (
        <AppBar
            position="fixed"
            sx={{
                ml: '280px',
                width: 'calc(100% - 280px)',
                bgcolor: 'white',
                color: 'text.primary',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(0,0,0,0.12)'
            }}
        >
            <Toolbar sx={{ minHeight: '64px !important' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                    onClick={handleProfileClick}
                >
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {user?.email}
                    </Typography>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
