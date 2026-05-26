import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Eye, Users } from 'lucide-react';
import { userService } from '../../services/api';
import { User, Role } from '../../types';
import { SortableTable, Column } from '../../components/ui/SortableTable';
import { Modal } from '../../components/ui/Modal';
import { RoleBadge } from '../../components/ui/Badge';
import { FormField, Input, TextArea, Select, Button } from '../../components/ui/FormField';
import { useForm } from 'react-hook-form';

interface CreateUserForm {
  name: string;
  email: string;
  address: string;
  password: string;
  role: Role;
}

interface UserDetailModalProps {
  user: User | null;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  const [detail, setDetail] = useState<any>(null);
  useEffect(() => {
    if (user) {
      userService.getUserById(user.id).then(setDetail);
    }
  }, [user]);

  return (
    <Modal isOpen={!!user} onClose={onClose} title="User Details">
      {detail ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-indigo-600">{detail.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{detail.name}</h3>
              <RoleBadge role={detail.role} />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { label: 'Email', value: detail.email },
              { label: 'Address', value: detail.address },
              { label: 'Role', value: <RoleBadge role={detail.role} /> },
              ...(detail.store ? [{ label: 'Store Rating', value: `${detail.store.averageRating} ★ (${detail.store.totalRatings} ratings)` }] : []),
            ].map((item) => (
              <div key={item.label} className="py-3 flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">{item.label}</span>
                <span className="text-sm text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      )}
    </Modal>
  );
};

export const AdminUsersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>();

  const loadUsers = useCallback(() => {
    setLoading(true);
    userService.getUsers().then(setUsers).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUsers();
    if (searchParams.get('action') === 'create') setShowCreate(true);
  }, [loadUsers, searchParams]);

  const filtered = users.filter((u) => {
    const n = filters.name.toLowerCase();
    const e = filters.email.toLowerCase();
    const a = filters.address.toLowerCase();
    const r = filters.role;
    return (
      (!n || u.name.toLowerCase().includes(n)) &&
      (!e || u.email.toLowerCase().includes(e)) &&
      (!a || u.address.toLowerCase().includes(a)) &&
      (!r || u.role === r)
    );
  });

  const onCreateUser = async (data: CreateUserForm) => {
    try {
      setCreateError('');
      setCreating(true);
      await userService.createUser(data);
      loadUsers();
      setShowCreate(false);
      reset();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-[180px]">{row.name}</p>
        </div>
      ),
    },
    { key: 'email', label: 'Email', sortable: true, render: (row) => <span className="text-gray-600">{row.email}</span> },
    {
      key: 'address',
      label: 'Address',
      sortable: true,
      render: (row) => <span className="text-gray-600 truncate block max-w-[200px]">{row.address}</span>,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (row) => <RoleBadge role={row.role} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <button
          onClick={() => setSelectedUser(row)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors border border-indigo-200"
        >
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-sm text-gray-500">{users.length} total users</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter Users</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(['name', 'email', 'address'] as const).map((field) => (
            <Input
              key={field}
              placeholder={`Filter by ${field}`}
              value={filters[field]}
              onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value }))}
            />
          ))}
          <Select value={filters.role} onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </Select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <SortableTable columns={columns} data={filtered} emptyMessage="No users found matching filters" />
      )}

      {/* User Detail Modal */}
      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* Create User Modal */}
      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); reset(); setCreateError(''); }} title="Add New User" size="lg">
        {createError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">⚠ {createError}</div>
        )}
        <form onSubmit={handleSubmit(onCreateUser)} className="space-y-4">
          <FormField label="Full Name" error={errors.name?.message} required>
            <Input
              placeholder="Min 20 characters"
              error={!!errors.name}
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 20, message: 'Min 20 characters' },
                maxLength: { value: 60, message: 'Max 60 characters' },
              })}
            />
          </FormField>
          <FormField label="Email" error={errors.email?.message} required>
            <Input
              type="email"
              placeholder="user@example.com"
              error={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
          </FormField>
          <FormField label="Address" error={errors.address?.message} required>
            <TextArea
              placeholder="Full address"
              rows={2}
              error={!!errors.address}
              {...register('address', {
                required: 'Address is required',
                maxLength: { value: 400, message: 'Max 400 characters' },
              })}
            />
          </FormField>
          <FormField label="Password" error={errors.password?.message} required hint="8-16 chars, uppercase + special char">
            <Input
              type="password"
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Min 8 characters' },
                maxLength: { value: 16, message: 'Max 16 characters' },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/,
                  message: 'Must include uppercase and special character',
                },
              })}
            />
          </FormField>
          <FormField label="Role" error={errors.role?.message} required>
            <Select error={!!errors.role} {...register('role', { required: 'Role is required' })}>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="user">Normal User</option>
              <option value="store_owner">Store Owner</option>
            </Select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setShowCreate(false); reset(); }} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" loading={creating} className="flex-1">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
