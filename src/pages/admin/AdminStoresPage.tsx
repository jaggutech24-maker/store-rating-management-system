import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Search, Store } from 'lucide-react';
import { storeService, userService } from '../../services/api';
import { Store as StoreType, User } from '../../types';
import { SortableTable, Column } from '../../components/ui/SortableTable';
import { Modal } from '../../components/ui/Modal';
import { StarRating } from '../../components/ui/StarRating';
import { FormField, Input, TextArea, Select, Button } from '../../components/ui/FormField';
import { useForm } from 'react-hook-form';

interface CreateStoreForm {
  name: string;
  email: string;
  address: string;
  ownerId: string;
}

export const AdminStoresPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [createError, setCreateError] = useState('');
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateStoreForm>();

  const loadData = useCallback(async () => {
    setLoading(true);
    const [storeData, userData] = await Promise.all([storeService.getStores(), userService.getUsers()]);
    setStores(storeData);
    setUsers(userData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
    if (searchParams.get('action') === 'create') setShowCreate(true);
  }, [loadData, searchParams]);

  const storeOwners = users.filter((u) => u.role === 'store_owner');

  const filtered = stores.filter((s) => {
    const n = filters.name.toLowerCase();
    const e = filters.email.toLowerCase();
    const a = filters.address.toLowerCase();
    return (
      (!n || s.name.toLowerCase().includes(n)) &&
      (!e || s.email.toLowerCase().includes(e)) &&
      (!a || s.address.toLowerCase().includes(a))
    );
  });

  const onCreateStore = async (data: CreateStoreForm) => {
    try {
      setCreateError('');
      setCreating(true);
      await storeService.createStore({
        ...data,
        ownerId: data.ownerId ? parseInt(data.ownerId) : undefined,
      });
      loadData();
      setShowCreate(false);
      reset();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  };

  const columns: Column<StoreType>[] = [
    {
      key: 'name',
      label: 'Store Name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Store className="h-4 w-4 text-emerald-600" />
          </div>
          <span className="font-medium text-gray-900 truncate max-w-[160px]">{row.name}</span>
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
      key: 'averageRating',
      label: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <StarRating value={Math.round(row.averageRating)} readonly size="sm" />
          <span className="text-sm text-gray-600">
            {row.averageRating > 0 ? row.averageRating.toFixed(1) : 'No ratings'}
            {row.totalRatings > 0 && <span className="text-gray-400 ml-1">({row.totalRatings})</span>}
          </span>
        </div>
      ),
    },
    {
      key: 'ownerName',
      label: 'Owner',
      sortable: true,
      render: (row) => (
        <span className="text-gray-600 text-sm">{row.ownerName || <span className="text-gray-400 italic">No owner</span>}</span>
      ),
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Store className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
            <p className="text-sm text-gray-500">{stores.length} registered stores</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          <Plus className="h-4 w-4" /> Add Store
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter Stores</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['name', 'email', 'address'] as const).map((field) => (
            <Input
              key={field}
              placeholder={`Filter by ${field}`}
              value={filters[field]}
              onChange={(e) => setFilters((f) => ({ ...f, [field]: e.target.value }))}
            />
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <SortableTable columns={columns} data={filtered} emptyMessage="No stores found" />
      )}

      {/* Create Store Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => { setShowCreate(false); reset(); setCreateError(''); }}
        title="Add New Store"
        size="lg"
      >
        {createError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">⚠ {createError}</div>
        )}
        <form onSubmit={handleSubmit(onCreateStore)} className="space-y-4">
          <FormField label="Store Name" error={errors.name?.message} required>
            <Input
              placeholder="Min 20 characters"
              error={!!errors.name}
              {...register('name', {
                required: 'Store name is required',
                minLength: { value: 20, message: 'Min 20 characters' },
                maxLength: { value: 60, message: 'Max 60 characters' },
              })}
            />
          </FormField>
          <FormField label="Email" error={errors.email?.message} required>
            <Input
              type="email"
              placeholder="store@example.com"
              error={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
              })}
            />
          </FormField>
          <FormField label="Address" error={errors.address?.message} required>
            <TextArea
              placeholder="Full store address"
              rows={2}
              error={!!errors.address}
              {...register('address', {
                required: 'Address is required',
                maxLength: { value: 400, message: 'Max 400 characters' },
              })}
            />
          </FormField>
          <FormField label="Assign Store Owner (Optional)">
            <Select {...register('ownerId')}>
              <option value="">No owner assigned</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>{owner.name} — {owner.email}</option>
              ))}
            </Select>
          </FormField>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => { setShowCreate(false); reset(); }} className="flex-1">Cancel</Button>
            <Button type="submit" variant="primary" loading={creating} className="flex-1">Create Store</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
