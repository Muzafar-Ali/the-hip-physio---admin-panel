'use client';
import { useEffect } from 'react';
import { useExerciseStore } from '@/stores/useExerciseStore';

import { Exercise } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef, DataTable } from '@/components/ui/common/DataTables';
import { PageHeader } from '@/components/ui/common/PageHeader';

const columns: ColumnDef<Exercise>[] = [
    { accessorKey: 'name', header: 'Name', cell: (row) => <div className="font-medium">{row.name}</div> },
    { accessorKey: 'category', header: 'Category', cell: (row) => row.category },
    { accessorKey: 'reps', header: 'Reps', cell: (row) => row.reps },
    { accessorKey: 'sets', header: 'Sets', cell: (row) => row.sets },
    { accessorKey: 'tags', header: 'Tags', cell: (row) => (
        <div className="flex flex-wrap gap-1">
            {row.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
    )},
    {
        accessorKey: 'actions', header: 'Actions', cell: (row) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
];

export default function ExercisesPage() {
    const { exercises, loading, fetchExercises } = useExerciseStore();

    useEffect(() => {
        if (exercises.length === 0) fetchExercises();
    }, [exercises, fetchExercises]);

    return (
        <div className="space-y-4">
            <PageHeader title="Exercise Library" actionButtonText="Add New Exercise" onActionButtonClick={() => alert('Open Add Exercise Modal')} />
            <DataTable
                columns={columns}
                data={exercises}
                searchKey="name"
                isLoading={loading}
            />
        </div>
    );
}
