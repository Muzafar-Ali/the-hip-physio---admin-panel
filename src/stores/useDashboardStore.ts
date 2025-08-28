import { create } from 'zustand';
import { DashboardState } from '@/lib/types';
import { apiService } from '@/services/apiServices';

export const useDashboardStore = create<DashboardState>((set) => ({
  analytics: null,
  loading: false,
  error: null,
  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getDashboardAnalytics();
      set({ analytics: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch analytics', loading: false });
    }
  },
}));