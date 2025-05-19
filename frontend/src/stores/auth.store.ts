import { create } from 'zustand';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    logout: () => void;
    setUserFromBackend: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
    logout: () => {
        set({ user: null, isAuthenticated: false });

        if (window.location.pathname !== '/login') {
            window.location.replace('/login');
        }
    },
    setUserFromBackend: (user: User | null) => set({ user, isAuthenticated: !!user }),
}));
