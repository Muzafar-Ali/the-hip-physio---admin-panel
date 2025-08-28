  import { create } from 'zustand';
import { RehabPlanState } from '@/lib/types';
import { apiService } from '@/services/apiServices';

export const useRehabPlanStore = create<RehabPlanState>((set) => ({
  plans: [],
  loading: false,
  error: null,
  fetchPlans: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getRehabPlans();
      set({ plans: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch rehab plans', loading: false });
    }
  },
}));