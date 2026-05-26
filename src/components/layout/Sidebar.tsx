import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, Star, LogOut, ChevronLeft,
  ChevronRight, ShieldCheck, User, Lock, Menu, X, BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav: NavItem[] = [
    { to: '/admin/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" />, label: 'Dashboard' },
    { to: '/admin/users', icon: <Users className="h-4.5 w-4.5" />, label: 'Users' },
    { to: '/admin/stores', icon: <Store className="h-4.5 w-4.5" />, label: 'Stores' },
    { to: '/admin/setup', icon: <BookOpen className="h-4.5 w-4.5" />, label: 'Backend Guide' },
  ];

  const userNav: NavItem[] = [
    { to: '/user/stores', icon: <Store className="h-4.5 w-4.5" />, label: 'Browse Stores' },
    { to: '/user/password', icon: <Lock className="h-4.5 w-4.5" />, label: 'Update Password' },
  ];

  const ownerNav: NavItem[] = [
    { to: '/owner/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" />, label: 'Dashboard' },
    { to: '/owner/password', icon: <Lock className="h-4.5 w-4.5" />, label: 'Update Password' },
  ];

  const navItems =
    user?.role === 'admin' ? adminNav : user?.role === 'store_owner' ? ownerNav : userNav;

  const roleConfig = {
    admin: { label: 'System Admin', icon: <ShieldCheck className="h-4 w-4" />, color: 'text-purple-600 bg-purple-50' },
    user: { label: 'Normal User', icon: <User className="h-4 w-4" />, color: 'text-blue-600 bg-blue-50' },
    store_owner: { label: 'Store Owner', icon: <Store className="h-4 w-4" />, color: 'text-emerald-600 bg-emerald-50' },
  };

  const config = roleConfig[user?.role || 'user'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-5 border-b border-gray-100 ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200">
          <Star className="h-5 w-5 text-white fill-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="font-bold text-gray-900 text-base">StoreRate</span>
            <p className="text-[10px] text-gray-500">Rating Platform</p>
          </div>
        )}
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className={`flex items-center gap-2 mb-1 ${config.color} w-fit rounded-full px-2 py-0.5`}>
            {config.icon}
            <span className="text-xs font-medium">{config.label}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      )}

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isActive
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600
            hover:bg-red-50 hover:text-red-600 transition-all w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="h-4.5 w-4.5" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-lg border border-gray-200"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-2xl
          transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-100 shadow-sm
          transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 h-6 w-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
        >
          {collapsed ? <ChevronRight className="h-3 w-3 text-gray-500" /> : <ChevronLeft className="h-3 w-3 text-gray-500" />}
        </button>
      </aside>
    </>
  );
};
