"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface User {
  _id: string;
  username: string;
  isAdmin: boolean;
}

export default function UserManagement() {
  const { isAuthenticated, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    async function fetchUsers() {
      try {
        const res = await fetch(`${apiUrl}/api/users`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }

    fetchUsers();
  }, [isAuthenticated, isAdmin, apiUrl]);

  const toggleAdmin = async (id: string) => {
    try {
      const user = users.find((u) => u._id === id);
      if (!user) return;
      
      const updatedUser = { ...user, isAdmin: !user.isAdmin };
      const res = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Failed to update user");
      setUsers(users.map((u) => (u._id === id ? updatedUser : u)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!isAuthenticated) return <p>You are not authenticated.</p>;
  if (!isAdmin) return <p>Only admins can access this page.</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Manage Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2 text-left">Username</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border">
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.isAdmin ? "Admin" : "User"}</td>
              <td className="border p-2">
                <button
                  onClick={() => toggleAdmin(user._id)}
                  className="text-blue-500 hover:underline mr-4"
                >
                  {user.isAdmin ? "Demote to User" : "Promote to Admin"}
                </button>
                <button
                  onClick={() => deleteUser(user._id)}
                  className="text-red-500 hover:underline"
                  disabled={user.isAdmin} // Prevent deleting admins for now
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
