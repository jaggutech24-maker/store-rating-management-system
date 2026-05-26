import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Star, Eye, EyeOff, LogIn } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { LoginCredentials } from '../../types';
import { FormField, Input, Button } from '../../components/ui/FormField';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError('');
      setLoading(true);
      const user = await authService.login(data.email, data.password);
      setUser(user);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'store_owner') navigate('/owner/dashboard');
      else navigate('/user/stores');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200 mb-4">
            <Star className="h-8 w-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">StoreRate</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Email Address" error={errors.email?.message} required>
              <Input
                type="email"
                placeholder="you@example.com"
                error={!!errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                })}
              />
            </FormField>

            <FormField label="Password" error={errors.password?.message} required>
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={!!errors.password}
                  {...register('password', { required: 'Password is required' })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-xs font-semibold text-amber-800 mb-2">🔑 Demo Credentials</p>
          <div className="space-y-1.5 text-xs text-amber-700">
            <div className="flex justify-between">
              <span className="font-medium">Admin:</span>
              <span>admin@storerate.com / Admin@123456</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">User:</span>
              <span>john.thompson@email.com / User@123456</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Store Owner:</span>
              <span>robert.anderson@techstore.com / Owner@123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
