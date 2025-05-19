import { create } from 'zustand';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (notification) => set((state: NotificationState) => {
        const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date().toISOString(),
        };
        return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        };
    }),
    markAsRead: (id) => set((state: NotificationState) => ({
        notifications: state.notifications.map((notification: Notification) =>
            notification.id === id ? { ...notification, read: true } : notification
        ),
        unreadCount: state.unreadCount - 1,
    })),
    markAllAsRead: () => set((state: NotificationState) => ({
        notifications: state.notifications.map((notification: Notification) => ({ ...notification, read: true })),
        unreadCount: 0,
    })),
    removeNotification: (id) => set((state: NotificationState) => ({
        notifications: state.notifications.filter((notification: Notification) => notification.id !== id),
        unreadCount: state.notifications.find((n: Notification) => n.id === id)?.read ? state.unreadCount : state.unreadCount - 1,
    })),
    clearAll: () => set({ notifications: [], unreadCount: 0 }),
})); 