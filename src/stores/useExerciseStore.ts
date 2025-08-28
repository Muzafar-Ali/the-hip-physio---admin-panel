import { create } from 'zustand';
import { ExerciseState } from '@/lib/types';
import { apiService } from '@/services/apiServices';

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  loading: false,
  error: null,
  fetchExercises: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiService.getExercises();
      set({ exercises: data, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch exercises', loading: false });
    }
  },
}));