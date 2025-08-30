'use client';

import { useEffect, useState } from 'react';
import { useExerciseStore } from '@/stores/useExerciseStore';
import { Exercise } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef, DataTable } from '@/components/common/DataTables';
import { PageHeader } from '@/components/common/PageHeader';
import { ExerciseModal } from '@/components/exercises/Exercises';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

export default function ExercisesPage() {
  const {
    exercises,
    loading,
    fetchExercises,
    addExercise,
    updateExercise,
    deleteExercise,
  } = useExerciseStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleOpenModal = (exercise: Exercise | null = null) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExercise(null);
  };

  const handleOpenConfirm = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedExercise(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedExercise) {
      deleteExercise(selectedExercise._id);
    }
    handleCloseConfirm();
  };

  const handleFormSubmit = async (formData: FormData) => {
    const success = selectedExercise
      ? await updateExercise(formData)
      : await addExercise(formData);
    if (success) {
      handleCloseModal();
    }
  };

  // IMPORTANT: In your ColumnDef, `cell` receives the row data (Exercise), not `{ row }`.
  const columns: ColumnDef<Exercise>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (exercise) => <div className="font-medium">{exercise.name}</div>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: (exercise) => exercise.category?.title ?? '—',
    },
    {
      accessorKey: 'bodyPart',
      header: 'Body Part',
      cell: (exercise) => exercise.bodyPart,
    },
    {
      accessorKey: 'difficulty',
      header: 'Difficulty',
      cell: (exercise) => (
        <Badge
          variant={exercise.difficulty === 'Advanced' ? 'destructive' : 'secondary'}
        >
          {exercise.difficulty}
        </Badge>
      ),
    },
    {
      accessorKey: 'reps',
      header: 'Reps',
      cell: (exercise) => exercise.reps,
    },
    {
      accessorKey: 'sets',
      header: 'Sets',
      cell: (exercise) => exercise.sets,
    },
    // Your ColumnDef doesn't accept `id`, so for actions just bind to a real key (e.g. `_id`)
    {
      accessorKey: '_id',
      header: 'Actions',
      cell: (exercise) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenModal(exercise)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleOpenConfirm(exercise)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Exercise Library"
        actionButtonText="Add New Exercise"
        onActionButtonClick={() => handleOpenModal()}
      />

      <DataTable
        columns={columns}
        data={exercises}
        searchKey="name"
        isLoading={loading && exercises.length === 0}
      />

      <ExerciseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={selectedExercise}
        isLoading={loading}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteConfirm}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the "${selectedExercise?.name ?? ''}" exercise.`}
      />
    </div>
  );
}
