'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/services/userService';
import { UserCreateFormData, toUserCreate } from '@/models/User';

export default function CreateUser() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserCreateFormData>({
    username: '',
    password: '',
    confirmPassword: '',
    isAdmin: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await createUser(toUserCreate(formData));
      router.push('/admin/users');
    } catch (err) {
      console.error('Failed to create user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Username
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={e => setFormData((prev: UserCreateFormData) => ({ ...prev, username: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Password
        </label>
        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData((prev: UserCreateFormData) => ({ ...prev, password: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          minLength={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Confirm Password
        </label>
        <input
          type="password"
          value={formData.confirmPassword}
          onChange={e => setFormData((prev: UserCreateFormData) => ({ ...prev, confirmPassword: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
          minLength={8}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAdmin"
          checked={formData.isAdmin}
          onChange={e => setFormData((prev: UserCreateFormData) => ({ ...prev, isAdmin: e.target.checked }))}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
          Administrator
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create User
        </button>
      </div>
    </form>
  );
}
