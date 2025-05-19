import { Box, CircularProgress } from '@mui/material';

export default function LoadingState() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
        </Box>
    );
} 