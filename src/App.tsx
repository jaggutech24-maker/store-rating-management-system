
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicOnlyRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminStoresPage } from './pages/admin/AdminStoresPage';
import { BackendSetupPage } from './pages/admin/BackendSetupPage';
import { UserStoresPage } from './pages/user/UserStoresPage';
import { UpdatePasswordPage } from './pages/shared/UpdatePasswordPage';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public only routes (redirect if logged in) */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/stores" element={<AdminStoresPage />} />
            <Route path="/admin/setup" element={<BackendSetupPage />} />
          </Route>
        </Route>

        {/* Normal user routes */}
        <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route element={<AppLayout />}>
            <Route path="/user/stores" element={<UserStoresPage />} />
            <Route path="/user/password" element={<UpdatePasswordPage />} />
          </Route>
        </Route>

        {/* Store owner routes */}
        <Route element={<ProtectedRoute allowedRoles={['store_owner']} />}>
          <Route element={<AppLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/password" element={<UpdatePasswordPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
