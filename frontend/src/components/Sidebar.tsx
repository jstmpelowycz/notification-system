import { Box, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MessageIcon from '@mui/icons-material/Message';
import { useNavigate, useLocation } from 'react-router-dom';

const MENU_ITEMS = [
    { path: '/api-tokens', label: 'API Tokens', icon: KeyIcon },
    { path: '/channels', label: 'Notification Channels', icon: NotificationsIcon },
    { path: '/messages', label: 'Messages', icon: MessageIcon },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                width: 280, 
                height: '100vh',
                bgcolor: '#1e2532',
                color: 'white',
                borderRadius: 0,
                position: 'fixed',
                left: 0,
                top: 0,
            }}
        >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    NOTIFICATION SYSTEM
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    Dashboard
                </Typography>
            </Box>

            <List component="nav" sx={{ pt: 0 }}>
                {MENU_ITEMS.map(({ path, label, icon: Icon }) => (
                    <ListItemButton 
                        key={path}
                        selected={location.pathname === path}
                        onClick={() => navigate(path)}
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: 'rgba(255,255,255,0.1)',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                },
                            },
                        }}
                    >
                        <ListItemIcon>
                            <Icon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </ListItemIcon>
                        <ListItemText 
                            primary={label}
                            sx={{ '& .MuiListItemText-primary': { color: 'rgba(255,255,255,0.9)' } }}
                        />
                    </ListItemButton>
                ))}
            </List>
        </Paper>
    );
} 