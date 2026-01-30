"use client";

import React, { useState, useEffect } from 'react';
import styles from './UsersManage.module.css';
import { BASE_URL, getImageUrl } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  profilePic: string;
  createdAt: string;
}

export default function UserManagePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1. FETCH ALL USERS FROM BACKEND
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/users/admin/all`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      const data = await res.json();

      // THE FIX: Ensure data is an array before setting state
      if (res.ok && Array.isArray(data)) {
        setUsers(data);
        setError(null);
      } else {
        // If it's an object with a message (like Access Denied)
        setError(data.message || "Failed to load users. Are you an Admin?");
        setUsers([]); 
      }
    } catch (err) {
      setError("Server connection failed. Is the Backend running?");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. TOGGLE ROLE HANDLER
  const handleToggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Are you sure you want to change this user to ${newRole}?`)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/users/admin/role/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) fetchUsers();
    } catch (err) {
      alert("Action failed.");
    }
  };

  // 3. DELETE USER HANDLER
  const handleDelete = async (id: string) => {
    if (!confirm("CRITICAL: Delete this user permanently?")) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/users/admin/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) fetchUsers();
    } catch (err) {
      alert("Delete failed.");
    }
  };

  // 4. CLIENT-SIDE FILTERING (Safe against non-array)
  const filteredUsers = Array.isArray(users) 
    ? users.filter(u => 
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) return <div className={styles.centered}>📡 Accessing User Database...</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p className={styles.count}>Total registered: {users.length}</p>
        </div>
      </header>

      {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

      <div className={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Email Address</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className={styles.userCell}>
                    <div className={styles.avatar}>
                      {user.profilePic ? (
                        <img src={getImageUrl(user.profilePic)} alt="" />
                      ) : (
                        <span>{user.fullName?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <strong>{user.fullName}</strong>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={user.role === 'admin' ? styles.adminTag : styles.userTag}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className={styles.actions}>
                    <button 
                      className={styles.roleBtn} 
                      onClick={() => handleToggleRole(user.id, user.role)}
                    >
                      Swap Role
                    </button>
                    <button 
                      className={styles.delBtn} 
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyTable}>
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}