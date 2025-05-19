import { Box } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';
import ApiTokensTable from './tables/ApiTokensTable';
import ChannelsTable from './tables/ChannelsTable';
import MessagesTable from './tables/MessagesTable';

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    bgcolor: '#f5f5f5',
                    width: 'calc(100% - 280px)',
                    position: 'relative'
                }}
            >
                <Header />
                <Box 
                    sx={{ 
                        p: 3, 
                        mt: '64px',
                        flexGrow: 1,
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Navigate to="/api-tokens" replace />} />
                        <Route path="/api-tokens" element={<ApiTokensTable />} />
                        <Route path="/channels" element={<ChannelsTable />} />
                        <Route path="/messages" element={<MessagesTable />} />
                    </Routes>
                </Box>
            </Box>
        </Box>
    );
} 