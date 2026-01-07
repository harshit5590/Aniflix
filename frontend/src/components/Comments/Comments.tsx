"use client";
import React, { useState, useEffect } from 'react';
import styles from './Comments.module.css';
import { getImageUrl, formatTimeAgo, BASE_URL } from '@/lib/utils';
import Link from 'next/link';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State for Popup
  const [animeName, setAnimeName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(savedUser);
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/comments`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments");
    }
  };

  const handlePost = async () => {
    if (!content.trim() || !animeName.trim()) {
      alert("Please fill in both fields!");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return alert("Session expired, please login again.");

    setIsSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/api/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          content,
          animeTitle: animeName,
          userName: user.fullName,
          userAvatar: user.profilePic,
        })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setContent("");
        setAnimeName("");
        fetchComments(); // Refresh list to show 3 latest
      }
    } catch (err) {
      alert("Error posting comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className={styles.sectionWrapper}>
      {/* LEFT SIDE: CHARACTER IMAGE (EMILIA) */}
      <div className={styles.charSide}>
        <img src="https://github.com/harshit5590/image/blob/main/anime-style%20characte.png?raw=true" alt="Emilia" className={styles.emiliaImg} />
      </div>

      {/* RIGHT SIDE: COMMENTS LIST */}
      <div className={styles.commentContent}>
        <div className={styles.headerRow}>
          <div className={styles.tabs}>
            <button className={styles.activeTab}>Newest Comments</button>
            <button className={styles.tab}>Top Comments</button>
          </div>
          
          {/* POST BUTTON (Top Right) */}
          <button 
            className={styles.openModalBtn}
            onClick={() => user ? setIsModalOpen(true) : alert("Please Login to write a comment!")}
          >
            Post Comment
          </button>
        </div>

        {/* HORIZONTAL GRID (Max 3 comments) */}
        <div className={styles.commentGrid}>
          {comments.length > 0 ? (
            comments.map((c: any) => (
              <div key={c._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar}>
                     {c.userAvatar ? (
                       <img src={getImageUrl(c.userAvatar) || ""} alt="" />
                     ) : (
                       <span>{c.userName?.[0]?.toUpperCase()}</span>
                     )}
                  </div>
                  <div className={styles.userMeta}>
                    <h4>{c.animeTitle}</h4>
                    <p>{c.location || "Global"} • <span>{formatTimeAgo(c.createdAt)}</span></p>
                  </div>
                </div>
                <p className={styles.text}>{c.content}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.tag}>📑 {c.animeTag || "GN"}</span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noComments}>No thoughts shared yet. Be the first!</p>
          )}
        </div>
      </div>

      {/* --- POPUP MODAL --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Share Your Thoughts</h3>
              <button onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            
            <div className={styles.modalBody}>
              <label>Anime Name</label>
              <input 
                type="text" 
                placeholder="e.g. One Piece" 
                value={animeName}
                onChange={(e) => setAnimeName(e.target.value)}
                className={styles.modalInput}
              />
              
              <label>Message</label>
              <textarea 
                placeholder="What's on your mind?..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className={styles.modalTextarea}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button 
                className={styles.postBtn} 
                onClick={handlePost}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}