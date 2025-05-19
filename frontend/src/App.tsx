import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Notifications from './components/Notifications';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';

const theme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f5f5f5',
        },
        primary: {
            main: '#1976d2',
        },
    },
    components: {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    padding: '12px 16px',
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: '#fafafa',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td': {
                        borderBottom: 0,
                    },
                },
            },
        },
    },
});

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Notifications />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}
