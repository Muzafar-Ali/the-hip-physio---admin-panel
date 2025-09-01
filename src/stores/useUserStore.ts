import { create } from 'zustand';
import { UserState, UserWithAnalytics } from '@/lib/types';
import { apiService } from '@/services/apiServices';
import config from '@/config/config';
import { toast } from 'sonner';

// Local payload types (kept here so you don't have to edit other files)
type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
  occupation?: string | null;
  dob?: string | null;
};

type UpdateUserPayload = {
  _id: string;
  name?: string;
  email?: string;
  password?: string; // optional on edit
  role?: 'user' | 'admin';
  status?: 'active' | 'inactive';
  occupation?: string | null;
  dob?: string | null;
};

const normalizeUser = (u: any): UserWithAnalytics => ({
  ...u,
  name: u?.name ?? u?.username ?? '',
  analytics: u?.analytics ?? u?.stats ?? {},
});

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  dummyUsers: [],
  usersPickList: [],
  loading: false,
  error: null,

  // READ
  fetchUsersDummy: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getUsers(); // keep your existing service
      const list = Array.isArray(data) ? data : data?.data ?? [];
      set({ dummyUsers: list.map(normalizeUser), loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch users', loading: false });
      toast.error('Failed to fetch users');
    }
  },

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const resposne = await fetch(`${config.baseUri}/api/user/all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      const result = await resposne.json();
      
      if (!result.success) {
        set({ loading: false });
        toast.error(result.message || 'Failed to fetch users');
        return;
      }
      
      console.log((result.data));
      
      const data = await result.data

      const list = Array.isArray(data) ? data : data?.data ?? [];
      set({ users: list.map(normalizeUser), loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch users', loading: false });
      toast.error('Failed to fetch users');
    }
  },

  // CREATE
  addUser: async (payload: CreateUserPayload) => {
    try {
      const res = await fetch(`${config.baseUri}/api/user/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: payload.name,
          email: payload.email.toLowerCase().trim(),
          password: payload.password,
          role: payload.role ?? 'user',
          status: payload.status ?? 'active',
          occupation: payload.occupation ?? null,
          dob: payload.dob ?? null,
        }),
      });

      const result = await res.json().catch(() => ({} as any));
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || result?.error || 'Failed to create user');
      }

      const created: UserWithAnalytics = normalizeUser(result?.data ?? result?.user);
      set((s) => ({ users: [created, ...s.users] }));
      toast.success('User created');
      return created;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create user');
      throw err;
    }
  },

  // UPDATE (partial)
  updateUser: async ({ _id, ...rest }: UpdateUserPayload) => {
    try {
      // send only defined, non-empty fields
      const body: Record<string, any> = {};
      Object.entries(rest).forEach(([k, v]) => {
        if (v !== undefined && v !== '') body[k] = v;
      });

      const res = await fetch(`${config.baseUri}/api/user/update/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const result = await res.json().catch(() => ({} as any));
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || result?.error || 'Failed to update user');
      }

      const updated: UserWithAnalytics = normalizeUser(result?.data ?? result?.user);
      set((s) => ({
        users: s.users.map((u) => (u._id === _id ? updated : u)),
      }));
      toast.success('User updated');
      return updated;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update user');
      throw err;
    }
  },

  // DELETE
  deleteUser: async (id: string) => {
    try {
      const res = await fetch(`${config.baseUri}/api/user/update/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await res.json().catch(() => ({} as any));
      if (!res.ok || !result?.success) {
        throw new Error(result?.message || result?.error || 'Failed to delete user');
      }

      set((s) => ({ users: s.users.filter((u) => u._id !== id) }));
      toast.success('User deleted');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete user');
      throw err;
    }
  },

  // AUTH
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
        toast.error(result.message || 'Login failed.');
        return false;
      }
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
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
        toast.error(result.message || 'Logout failed.');
        return;
      }
      toast.success('Logout successful!');
    } catch (err: any) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', err);
    }
  },

  // PICKLIST
  fetchUsersPickList: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${config.baseUri}/api/user/notification-picklist`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const result = await response.json();
      if (!result.success) {
        set({ loading: false });
        toast.error(result.message || 'Failed to fetch users');
        return;
      }

      set({ usersPickList: result.users, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch users', loading: false });
    }
  },
}));
