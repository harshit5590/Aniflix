"use client";
import React, { useState, useEffect } from 'react';
import styles from './TrendingPosts.module.css';
import { getImageUrl, formatTimeAgo } from '@/lib/utils';
import { BASE_URL } from '@/lib/utils';


export default function TrendingPosts() {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [form, setForm] = useState({ title: "", description: "", category: "Suggestion" });

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
        setUser(savedUser);
        fetchPosts();
    }, []);

    const fetchPosts = () => {
        fetch(`${BASE_URL}/api/posts`, { cache: 'no-store' })
            .then(res => res.json())
            .then(data => setPosts(data));
    };

    const handleCreatePost = async () => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user') || 'null');

        // 1. CHECK THE CONSOLE (F12) TO SEE WHAT IS ACTUALLY INSIDE YOUR USER OBJECT
        console.log("Logged in user data:", userData);

        if (!userData || !token) {
            alert("Please login first");
            return;
        }

        const res = await fetch('http://127.0.0.1:5000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: form.title,
                description: form.description,
                category: form.category,
                // 2. CHANGE THIS: Use 'fullName' if that's what your backend provides
                userName: userData.fullName || userData.name || "User",
                userAvatar: userData.profilePic
            })
        });

        if (res.ok) {
            setIsModalOpen(false);
            window.location.reload();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Trending Posts</h2>
                <button
                    className={styles.postTrigger}
                    onClick={() => user ? setIsModalOpen(true) : alert("Please login to post!")}
                >
                    + Post
                </button>
            </div>

            <div className={styles.postList}>
                {posts.map((post: any) => (
                    <div key={post._id} className={styles.postCard}>
                        <div className={styles.cardTop}>

                            <span className={post.category === 'Suggestion' ? styles.tagS : styles.tagR}>
                                #{post.category}
                            </span>

                            <span className={styles.time}>
                                • {formatTimeAgo(post.createdAt)}
                            </span>
                            <span className={styles.comments}>💬 {post.commentCount}</span>
                        </div>
                        <h3 className={styles.postTitle}>{post.title}</h3>
                        <p className={styles.postDesc}>{post.description}</p>

                        <div className={styles.userInfo}>
                            <div className={styles.miniAvatar}>
                                {post.userAvatar ? <img src={getImageUrl(post.userAvatar)} /> : <span>{post.userName?.[0]?.toUpperCase() || "?"}</span>}
                            </div>
                            <span className={styles.name}>{post.userName || "Anonymous"}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL POPUP */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3>Create a New Post</h3>
                        <select
                            value={form.category}
                            onChange={e => setForm({ ...form, category: e.target.value })}
                            className={styles.modalInput}
                        >
                            <option value="Suggestion">Suggestion</option>
                            <option value="Recommendation">Recommendation</option>
                            <option value="Thought">Thought</option>
                        </select>
                        <input
                            type="text" placeholder="Title"
                            className={styles.modalInput}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                        />
                        <textarea
                            placeholder="What's on your mind?..."
                            className={styles.modalTextarea}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                        />
                        <div className={styles.modalActions}>
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button className={styles.submitBtn} onClick={handleCreatePost}>Post Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}