import React, { useEffect, useState } from 'react';
import { Users, Store, Star, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { DashboardStats } from '../../types';
import { useAuthStore } from '../../store/authStore';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers ?? '—',
      icon: <Users className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      link: '/admin/users',
    },
    {
      title: 'Total Stores',
      value: stats?.totalStores ?? '—',
      icon: <Store className="h-6 w-6" />,
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      link: '/admin/stores',
    },
    {
      title: 'Total Ratings',
      value: stats?.totalRatings ?? '—',
      icon: <Star className="h-6 w-6" />,
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      link: '/admin/stores',
    },
  ];

  const quickActions = [
    { label: 'Add New User', to: '/admin/users?action=create', icon: <Users className="h-4 w-4" />, color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Add New Store', to: '/admin/stores?action=create', icon: <Store className="h-4 w-4" />, color: 'bg-emerald-600 hover:bg-emerald-700' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl ${card.bg} ${card.text} flex items-center justify-center`}>
                {card.icon}
              </div>
              <ArrowRight className={`h-4 w-4 ${card.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div>
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded-lg animate-pulse mb-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4 text-indigo-600" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all ${action.color} shadow-sm`}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Overview */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <h2 className="text-lg font-semibold mb-2">Platform Overview</h2>
        <p className="text-indigo-200 text-sm mb-4">
          You have full control over the StoreRate platform. Manage users, stores, and monitor ratings.
        </p>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-500/40">
          {[
            { label: 'Users', value: stats?.totalUsers },
            { label: 'Stores', value: stats?.totalStores },
            { label: 'Ratings', value: stats?.totalRatings },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold">{loading ? '—' : item.value}</p>
              <p className="text-xs text-indigo-200 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
