'use client';

import { useState } from 'react';
import { User } from '@/models/User';
import { updateUserAdmin, fetchUsers } from '@/services/userService';

interface Props {
  initialUsers: User[];
  currentUserId: string;
}

export default function UserList({ initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [error, setError] = useState<string | null>(null);

  const handleAdminChange = async (userId: string, isAdmin: boolean) => {
    try {
      await updateUserAdmin(userId, isAdmin);
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (err) {
      console.error('Failed to update user admin status:', err);
      setError('Failed to update user admin status');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      )}

      {users.map((u) => (
        <div key={u._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold dark:text-gray-200">{u.username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Created: {new Date(u.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={u.isAdmin}
                  onChange={(e) => handleAdminChange(u._id, e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  disabled={u._id === currentUserId} // Can't change own admin status
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">Administrator</span>
              </label>
            </div>
          </div>
        </div>
      ))}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No users found.
        </div>
      )}
    </div>
  );
}
