'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef, DataTable } from '@/components/common/DataTables';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

import {
  AdminUser,
  useUserStore,
} from '@/stores/useUserStore';
import { UserModal } from '@/components/user/UserModal';

function RowActions({
  user,
  onEdit,
  onDelete,
}: {
  user: AdminUser;
  onEdit: (u: AdminUser) => void;
  onDelete: (u: AdminUser) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            setOpen(false);
            onEdit(user);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500"
          onSelect={() => {
            setOpen(false);
            onDelete(user);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function UsersPage() {
  const {
    users,
    loading,
    fetchUsers,
    deleteUser,
  } = useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenModal = (user: AdminUser | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleOpenConfirm = (user: AdminUser) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setSelectedUser(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser._id);
      await fetchUsers();
    }
    handleCloseConfirm();
  };

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (row) => <div className="font-medium">{row.name}</div>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: (row) => row.email,
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: (row) => row.role,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={row.status === 'active' ? 'default' : 'destructive'}>
          {row.status}
        </Badge>
      ),
    },
    // {
    //   accessorKey: 'analytics',
    //   header: 'Compliance',
    //   cell: (row) => (
    //     <div className="text-center">
    //       {row?.analytics?.complianceRate != null
    //         ? `${row.analytics.complianceRate}%`
    //         : '—'}
    //     </div>
    //   ),
    // },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: (user) => (
        <RowActions
          user={user}
          onEdit={handleOpenModal}
          onDelete={handleOpenConfirm}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="User Management"
        actionButtonText="Add New User"
        onActionButtonClick={openCreateModal}
      />

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        isLoading={loading && users.length === 0}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedUser}
        isLoading={saving}
        setIsLoading={setSaving}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteConfirm}
        title="Delete user?"
        description={`This will permanently delete "${selectedUser?.name ?? ''}".`}
      />
    </div>
  );
}
