'use client';
import { useEffect } from 'react';
import { useRehabPlanStore } from '@/stores/useRehabPlanStore';
import { RehabPlan } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { ColumnDef, DataTable } from '@/components/common/DataTables';
import { PageHeader } from '@/components/common/PageHeader';

const columns: ColumnDef<RehabPlan>[] = [
    { accessorKey: 'name', header: 'Plan Name', cell: (row) => <div className="font-medium">{row.name}</div> },
    { accessorKey: 'type', header: 'Type', cell: (row) => <Badge variant={row.type === 'Paid' ? 'default' : 'outline'}>{row.type}</Badge> },
    { accessorKey: 'durationWeeks', header: 'Duration', cell: (row) => `${row.durationWeeks} weeks` },
    {
        accessorKey: 'actions', header: 'Actions', cell: (row) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit Plan</DropdownMenuItem>
                    <DropdownMenuItem>Assign to User</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    },
];

export default function RehabPlansPage() {
    const { plans, loading, fetchPlans } = useRehabPlanStore();

    useEffect(() => {
        if (plans.length === 0) fetchPlans();
    }, [plans, fetchPlans]);

    return (
        <div className="space-y-4">
            <PageHeader title="Rehab Plans" actionButtonText="Create New Plan" onActionButtonClick={() => alert('Open Create Plan Modal')} />
            <DataTable
                columns={columns}
                data={plans}
                searchKey="name"
                isLoading={loading}
            />
        </div>
    );
}
