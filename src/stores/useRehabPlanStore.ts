import { create } from 'zustand';
import { toast } from 'sonner';
import config from '@/config/config';
import { RehabPlan } from '@/lib/types';

// If you already have RehabPlan in '@/lib/types', keep that import and
// delete this local type. It's here just to make this file drop-in ready.

type AssignPayload = { planId: string; userId: string };

type PickUser = { _id: string; name: string; email?: string };

type RehabPlanStore = {
  plans: RehabPlan[];
  loading: boolean;
  error: string | null;

  fetchPlans: () => Promise<void>;
  addPlan: (payload: { name: string; type: 'Free' | 'Paid'; durationWeeks: number; description?: string }) => Promise<boolean>;
  updatePlan: (payload: { _id: string; name: string; type: 'Free' | 'Paid'; durationWeeks: number; description?: string }) => Promise<boolean>;
  deletePlan: (id: string) => Promise<void>;
  assignPlanToUser: (payload: AssignPayload) => Promise<boolean>;
};

export const useRehabPlanStore = create<RehabPlanStore>((set, get) => ({
  plans: [],
  loading: false,
  error: null,

  // GET /api/rehab-plans
  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${config.baseUri}/api/rehab-plans`, {
        credentials: 'include',
      });
      const result = await res.json();
      console.log('result', result);
      
      if (!res.ok || result?.success === false) {
        toast.error(result?.message || 'Failed to fetch rehab plans');
        set({ loading: false });
        return;
      }

      set({ plans: result.data, loading: false });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to fetch rehab plans');
      set({ error: err?.message || 'Failed to fetch rehab plans', loading: false });
    }
  },

  // POST /api/rehab-plans
  addPlan: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${config.baseUri}/api/rehab-plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || 'Failed to create rehab plan');
        set({ loading: false });
        return false;
      }

      // Inline tolerant parsing (no helpers)
      const doc: RehabPlan | undefined =
        result?.plan ??
        result?.data ??
        (result && result._id ? (result as RehabPlan) : undefined);

      if (!doc || !doc._id) {
        toast.error('Server did not return the created plan.');
        set({ loading: false });
        return false;
      }

      toast.success(result?.message || 'Rehab plan created!');
      set((state) => ({
        plans: [doc, ...state.plans.filter(Boolean)],
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create rehab plan');
      set({ error: err?.message || 'Failed to create rehab plan', loading: false });
      return false;
    }
  },

  // PUT /api/rehab-plans/:id
  updatePlan: async ({ _id, ...rest }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${config.baseUri}/api/rehab-plans/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(rest),
      });
      const result = await res.json();

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || 'Failed to update rehab plan');
        set({ loading: false });
        return false;
      }

      // Inline tolerant parsing (no helpers)
      const doc: RehabPlan | undefined =
        result?.plan ??
        result?.data ??
        (result && result._id ? (result as RehabPlan) : undefined);

      if (!doc || !doc._id) {
        toast.error('Server did not return the updated plan.');
        set({ loading: false });
        return false;
      }

      toast.success(result?.message || 'Rehab plan updated!');
      set((state) => ({
        plans: state.plans.filter(Boolean).map((p) => (p._id === _id ? doc : p)),
        loading: false,
      }));
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update rehab plan');
      set({ error: err?.message || 'Failed to update rehab plan', loading: false });
      return false;
    }
  },

  // DELETE /api/rehab-plans/:id
  deletePlan: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${config.baseUri}/api/rehab-plans/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || 'Failed to delete rehab plan');
        set({ loading: false });
        return;
      }

      toast.success(result?.message || 'Rehab plan deleted!');
      set((state) => ({
        plans: state.plans.filter((p) => p?._id !== id),
        loading: false,
      }));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete rehab plan');
      set({ error: err?.message || 'Failed to delete rehab plan', loading: false });
    }
  },
  
  // POST /api/rehab-plans/:planId/assign  { userId }
  assignPlanToUser: async ({ planId, userId }) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${config.baseUri}/api/rehab-plans/${planId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || 'Failed to assign plan');
        set({ loading: false });
        return false;
      }

      toast.success(result?.message || 'Plan assigned successfully!');
      set({ loading: false });
      return true;
    } catch (err: any) {
      toast.error(err?.message || 'Failed to assign plan');
      set({ error: err?.message || 'Failed to assign plan', loading: false });
      return false;
    }
  },
}));
