import { create } from 'zustand';
import { NotificationState, Notification } from '@/lib/types';
import { apiService } from '@/services/apiServices';

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  loading: false,
  error: null,
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getNotifications();
      set({ notifications: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch notifications', loading: false });
    }
  },
  sendNotification: async (notification) => {
    set({ loading: true, error: null });
    try {
      const newNotification = await apiService.sendNotification(notification);
      set({ notifications: [newNotification, ...get().notifications], loading: false });
    } catch (err) {
      set({ error: 'Failed to send notification', loading: false });
    }
  }
}));
