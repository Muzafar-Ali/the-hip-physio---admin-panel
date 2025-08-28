import { create } from 'zustand';
import { UserState } from '@/lib/types';
import { apiService } from '@/services/apiServices';

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getUsers();
      set({ users: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },
}));