"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from './Account.module.css';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';
import { BASE_URL } from '@/lib/utils';

export default function AccountPage() {
    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", age: "", dob: "" });
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false); // For WhatsApp style view

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) return router.push('/login');

        try {
            const res = await fetch('http://127.0.0.1:5000/api/users/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setFormData({ fullName: data.fullName, age: data.age || "", dob: data.dob || "" });
            }
        } catch (err) {
            console.error("Fetch failed");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!window.confirm("Remove your profile picture?")) return;

        try {
            const res = await fetch(`${BASE_URL}/api/users/remove-avatar`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            if (res.ok) {
                const updatedUser = { ...user, profilePic: "" };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("storage")); // Update Header
                alert("Image removed");
            }
        } catch (err) {
            alert("Error removing image");
        }
    };

    if (loading) return <p>Loading...</p>;


    const handleImageClick = () => {
        fileInputRef.current?.click(); // Trigger the hidden input
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', file); // 'avatar' must match Multer's upload.single('avatar')

        setUploading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/api/users/upload-avatar', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData // Note: Don't set Content-Type header when sending FormData
            });

            if (res.ok) {
                const data = await res.json();
                // Update user state locally
                const updatedUser = { ...user, profilePic: data.profilePic };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("storage")); // Update Header
                alert("Profile picture updated!");
            }
        } catch (err) {
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch('http://127.0.0.1:5000/api/users/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            const updated = await res.json();
            setUser(updated);
            setIsEditing(false);
            // Update localstorage so header updates too
            localStorage.setItem('user', JSON.stringify(updated));
            window.dispatchEvent(new Event("storage"));
        }
    };

    if (loading) return <div className={styles.loader}><span></span></div>;




    return (
        <main className={styles.container}>
            <div className={styles.glassCard}>
                {/* EDIT TOGGLE BUTTON */}
                <button
                    className={styles.editToggle}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "✕ Cancel" : "✎ Edit Profile"}
                </button>

                <div className={styles.profileHeader}>
                    <div className={styles.avatarWrapper} onClick={handleImageClick} style={{ cursor: 'pointer' }}>
                        <div className={styles.glowRing}></div>
                        <div className={styles.avatarBig}>
                            {/* Show a loading spinner overlay if uploading */}
                            {uploading && <div className={styles.uploadOverlay}>⌛</div>}

                            {user?.profilePic ? (
                                <img src={getImageUrl(user.profilePic)} alt="avatar" />
                            ) : (
                                <span>{user?.fullName?.[0]}</span>
                            )}
                            {/* Camera Icon Overlay on Hover */}
                            <div className={styles.cameraIcon}>📷</div>
                        </div>
                        {/* HIDDEN FILE INPUT */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            hidden
                            accept="image/*"
                        />
                    </div>

                    {isEditing ? (
                        <div className={styles.editForm}>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Full Name"
                            />
                            {/* REMOVE BUTTON (Only shows if image exists) */}
                            {user?.profilePic && (
                                <button className={styles.removeBtn} onClick={handleRemoveImage} title="Remove Photo">
                                    🗑️
                                </button>
                            )}
                        </div>
                    ) : (
                        <h1 className={styles.userName}>{user?.fullName}</h1>
                    )}
                    <p className={styles.userEmail}>{user?.email}</p>
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoBox}>
                        <label>Age</label>
                        {isEditing ? (
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        ) : (
                            <p>{user?.age || 'Not set'}</p>
                        )}
                    </div>

                    <div className={styles.infoBox}>
                        <label>Birthday</label>
                        {isEditing ? (
                            <input
                                type="date"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        ) : (
                            <p>{user?.dob || 'Not set'}</p>
                        )}
                    </div>

                    <div className={styles.infoBox}>
                        <label>Status</label>
                        <p className={styles.statusTag}>{user?.role === 'admin' ? '🛡️ Admin' : '💎 Premium User'}</p>
                    </div>
                </div>

                {isEditing && (
                    <button className={styles.saveBtn} onClick={handleSave}>
                        Save Changes
                    </button>
                )}
                {/* WHATSAPP STYLE FULLSCREEN MODAL */}
                {showModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                        <button className={styles.closeModal}>✕</button>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <img src={getImageUrl(user.profilePic)} alt="Full View" className={styles.fullImage} />
                            <p className={styles.modalName}>{user.fullName}</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}