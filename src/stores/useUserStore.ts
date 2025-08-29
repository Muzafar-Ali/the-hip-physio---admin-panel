import { create } from 'zustand';
import { UserState } from '@/lib/types';
import { apiService } from '@/services/apiServices';
import config from '@/config/config';
import { toast } from 'sonner';

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
  login: async (email, password) => {
    try {
      const res = await fetch(`${config.baseUri}/api/user/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const result = await res.json();
  
      if (!result.success) {
        toast.error(result.message || "Login failed.");
        return false;
      }

      toast.success("Login successful!");
      return true;

    } catch (err: any) {
      // toast.error("Login failed. Please check your connection or credentials.");
      console.error("Login error:", err);
      return false;
    }
  }, 
  logout: async () => {
    try {
      const res = await fetch(`${config.baseUri}/api/user/admin/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Logout failed.");
        return;
      }
    
      toast.success("Logout successful!");
    
    } catch (err: any) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", err);
    }
  },

}));