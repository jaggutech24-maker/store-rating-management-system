import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { UpdatePasswordData } from '../../types';
import { FormField, Input, Button } from '../../components/ui/FormField';

export const UpdatePasswordPage: React.FC = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordData>();

  const newPass = watch('newPassword');

  const onSubmit = async (data: UpdatePasswordData) => {
    try {
      setError('');
      setLoading(true);
      await authService.updatePassword(user!.id, data.currentPassword, data.newPassword);
      setSuccess(true);
      reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Lock className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Update Password</h1>
            <p className="text-sm text-gray-500">Change your account password</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Password updated successfully!</p>
                <p className="text-sm text-green-600 mt-0.5">Your new password is now active.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField label="Current Password" error={errors.currentPassword?.message} required>
              <div className="relative">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter current password"
                  error={!!errors.currentPassword}
                  {...register('currentPassword', { required: 'Current password is required' })}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="New Password" error={errors.newPassword?.message} required hint="8-16 characters, must include uppercase and special character">
              <div className="relative">
                <Input
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter new password"
                  error={!!errors.newPassword}
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                    maxLength: { value: 16, message: 'Maximum 16 characters' },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/,
                      message: 'Must include at least one uppercase letter and one special character',
                    },
                  })}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm New Password" error={errors.confirmPassword?.message} required>
              <div className="relative">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  error={!!errors.confirmPassword}
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (v) => v === newPass || 'Passwords do not match',
                  })}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </FormField>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
              <p className="text-xs font-semibold text-gray-600 mb-2">Password Requirements</p>
              {[
                { label: '8-16 characters', check: newPass && newPass.length >= 8 && newPass.length <= 16 },
                { label: 'At least one uppercase letter (A-Z)', check: newPass && /[A-Z]/.test(newPass) },
                { label: 'At least one special character', check: newPass && /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPass) },
              ].map(({ label, check }) => (
                <div key={label} className={`flex items-center gap-2 text-xs ${check ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{check ? '✓' : '○'}</span>
                  {label}
                </div>
              ))}
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <Lock className="h-4 w-4" />
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
