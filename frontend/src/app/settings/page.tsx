"use client";
import React, { useState } from 'react';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const [name, setName] = useState("");
  
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://127.0.0.1:5000/api/users/update', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ fullName: name })
    });
    if (res.ok) alert("Profile Updated!");
  };

  return (
    <main className="container">
      <div className={styles.settingsCard}>
        <h2>⚙️ General Settings</h2>
        <div className={styles.inputGroup}>
          <label>Change Display Name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder="New Name" />
        </div>
        <button onClick={handleUpdate} className={styles.saveBtn}>Save Changes</button>
      </div>
    </main>
  );
}