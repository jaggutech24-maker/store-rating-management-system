import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Star, Eye, EyeOff, UserPlus } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { RegisterData } from '../../types';
import { FormField, Input, TextArea, Button } from '../../components/ui/FormField';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    try {
      setError('');
      setLoading(true);
      const user = await authService.register(data);
      setUser(user);
      navigate('/user/stores');
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
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join the StoreRate community</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              label="Full Name"
              error={errors.name?.message}
              required
              hint="Between 20 and 60 characters"
            >
              <Input
                placeholder="e.g. John Michael Thompson Junior"
                error={!!errors.name}
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 20, message: 'Name must be at least 20 characters' },
                  maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
                })}
              />
              {!errors.name && <p className="text-xs text-gray-400 mt-1">Min 20, Max 60 characters</p>}
            </FormField>

            <FormField label="Email Address" error={errors.email?.message} required>
              <Input
                type="email"
                placeholder="you@example.com"
                error={!!errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address',
                  },
                })}
              />
            </FormField>

            <FormField label="Address" error={errors.address?.message} required>
              <TextArea
                placeholder="Your full address"
                rows={3}
                error={!!errors.address}
                {...register('address', {
                  required: 'Address is required',
                  maxLength: { value: 400, message: 'Address cannot exceed 400 characters' },
                })}
              />
            </FormField>

            <FormField
              label="Password"
              error={errors.password?.message}
              required
              hint="8-16 chars, 1 uppercase, 1 special character"
            >
              <div className="relative">
                <Input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={!!errors.password}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    maxLength: { value: 16, message: 'Password cannot exceed 16 characters' },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/,
                      message: 'Must include uppercase and special character',
                    },
                  })}
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

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              <UserPlus className="h-4 w-4" />
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
