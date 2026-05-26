import React, { useEffect, useState } from 'react';
import { Star, Users, TrendingUp, Store, BarChart3 } from 'lucide-react';
import { storeOwnerService } from '../../services/api';
import { Rating, Store as StoreType } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { StarRating } from '../../components/ui/StarRating';
import { SortableTable, Column } from '../../components/ui/SortableTable';

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [store, setStore] = useState<StoreType | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    storeOwnerService
      .getDashboard(user.id)
      .then(({ store, ratings }) => {
        setStore(store);
        setRatings(ratings);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, [user]);

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.rating === star).length,
    pct: ratings.length ? (ratings.filter((r) => r.rating === star).length / ratings.length) * 100 : 0,
  }));

  const columns: Column<Rating>[] = [
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
            {row.userName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-xs truncate max-w-[140px]">{row.userName}</p>
            <p className="text-xs text-gray-500 truncate max-w-[140px]">{row.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <StarRating value={row.rating} readonly size="sm" />
          <span className="text-sm font-medium text-gray-700">{row.rating}/5</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-500">
          {new Date(row.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <Store className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-700">No Store Found</h2>
        <p className="text-sm text-gray-500 mt-1">You don't have a store assigned to your account yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-200">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor your store's performance and ratings</p>
        </div>
      </div>

      {/* Store Info Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-indigo-200">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Store className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{store?.name}</h2>
            <p className="text-indigo-200 text-sm mt-0.5">{store?.email}</p>
            <p className="text-indigo-200 text-xs mt-1 line-clamp-1">{store?.address}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-indigo-500/40">
          <div className="text-center">
            <p className="text-3xl font-bold">{store?.averageRating?.toFixed(1) || '—'}</p>
            <p className="text-xs text-indigo-200 mt-1">Avg Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{store?.totalRatings}</p>
            <p className="text-xs text-indigo-200 mt-1">Total Ratings</p>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              <StarRating value={Math.round(store?.averageRating || 0)} readonly size="sm" />
            </div>
            <p className="text-xs text-indigo-200 mt-1">Star Rating</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats */}
        {[
          { label: 'Total Reviews', value: ratings.length, icon: <Users className="h-5 w-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Average Rating', value: store?.averageRating?.toFixed(1) || '0', icon: <Star className="h-5 w-5 text-amber-600" />, bg: 'bg-amber-50' },
          {
            label: '5-Star Reviews',
            value: `${ratings.filter((r) => r.rating === 5).length}`,
            icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
            bg: 'bg-emerald-50',
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`h-12 w-12 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Rating Distribution</h2>
        <div className="space-y-3">
          {ratingDistribution.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-14">
                <span className="text-sm font-medium text-gray-700">{star}</span>
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-600" />
          User Ratings ({ratings.length})
        </h2>
        <SortableTable
          columns={columns}
          data={ratings}
          emptyMessage="No ratings submitted yet"
        />
      </div>
    </div>
  );
};
