import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { authService } from './services/auth.service';
import { useAuthStore } from './stores/auth.store';
import './index.css';

async function initAuth() {
    try {
        const response = await authService.me();
        if (response.data.user) {
            useAuthStore.getState().setUserFromBackend(response.data.user);
        } else {
            useAuthStore.getState().setUserFromBackend(null);
        }
    } catch {
        useAuthStore.getState().setUserFromBackend(null);
    }
}

initAuth().finally(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
});
