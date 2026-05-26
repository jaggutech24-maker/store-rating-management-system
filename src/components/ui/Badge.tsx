import React from 'react';
import { Role } from '../../types';

interface BadgeProps {
  role: Role;
}

export const RoleBadge: React.FC<BadgeProps> = ({ role }) => {
  const config = {
    admin: 'bg-purple-100 text-purple-700 border border-purple-200',
    user: 'bg-blue-100 text-blue-700 border border-blue-200',
    store_owner: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  };
  const labels = {
    admin: 'Admin',
    user: 'User',
    store_owner: 'Store Owner',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[role]}`}>
      {labels[role]}
    </span>
  );
};

interface StatusBadgeProps {
  label: string;
  color: 'green' | 'red' | 'blue' | 'yellow' | 'gray';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ label, color }) => {
  const colors = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-gray-100 text-gray-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {label}
    </span>
  );
};
