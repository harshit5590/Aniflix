"use client";

import React, { useState, useEffect } from 'react';
import styles from './AnimeManage.module.css';
import { BASE_URL, getImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Anime {
  _id: string;
  title: string;
  rating: string;
  type: string;
  episodesCount: string;
  poster: string;
  description: string;
  genres: string[];
}

export default function ManageAnimePage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);
  const router = useRouter();

  // 1. FETCH ALL ANIME
  const fetchAnimes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/anime`, { cache: 'no-store' });
      const data = await res.json();
      setAnimes(data || []);
    } catch (error) {
      console.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, []);

  // 2. DELETE HANDLER
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove the anime and all episode links!")) return;
    
    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/admin/anime/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      fetchAnimes();
    } else {
      alert("Unauthorized: You must be an admin.");
    }
  };

  // 3. UPDATE HANDLER (FOR MODAL)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAnime) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`${BASE_URL}/api/admin/anime/${editingAnime._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(editingAnime)
    });

    if (res.ok) {
      setEditingAnime(null);
      fetchAnimes();
      alert("Metadata Updated!");
    }
  };

  // 4. INSTANT SEARCH LOGIC
  const filteredAnime = animes.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className={styles.centered}>📡 Loading Library (390+ Entries)...</div>;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Anime Manager</h1>
          <p>Database size: <strong>{animes.length}</strong> items</p>
        </div>
        <button className={styles.addBtn}>+ Add New Entry</button>
      </header>

      {/* SEARCH BAR */}
      <div className={styles.searchSection}>
        <input 
          type="text" 
          placeholder="Filter by title (e.g. Naruto)..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* ANIME TABLE */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Anime Title</th>
              <th>Rating</th>
              <th>Format</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnime.length > 0 ? (
              filteredAnime.map((anime) => (
                <tr key={anime._id}>
                  <td>
                    <img src={getImageUrl(anime.poster)} className={styles.miniPoster} alt="" />
                  </td>
                  <td className={styles.titleCell}>{anime.title}</td>
                  <td className={styles.ratingCell}>⭐ {anime.rating}</td>
                  <td><span className={styles.typeBadge}>{anime.type}</span></td>
                  <td className={styles.actionCell}>
                    <Link href={`/admin/anime/${anime._id}/Episodes`} className={styles.manageBtn}>
                      🔗 Links
                    </Link>
                    <button className={styles.editBtn} onClick={() => setEditingAnime(anime)}>
                      ✎
                    </button>
                    <button className={styles.delBtn} onClick={() => handleDelete(anime._id)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={styles.empty}>No anime found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT METADATA MODAL */}
      {editingAnime && (
        <div className={styles.modalOverlay}>
          <form className={styles.modal} onSubmit={handleUpdate}>
            <div className={styles.modalHeader}>
              <h3>Edit Metadata</h3>
              <button type="button" onClick={() => setEditingAnime(null)}>✕</button>
            </div>
            
            <div className={styles.modalBody}>
              <label>Title</label>
              <input 
                value={editingAnime.title} 
                onChange={e => setEditingAnime({...editingAnime, title: e.target.value})} 
              />
              
              <div className={styles.modalRow}>
                <div>
                  <label>Rating</label>
                  <input 
                    value={editingAnime.rating} 
                    onChange={e => setEditingAnime({...editingAnime, rating: e.target.value})} 
                  />
                </div>
                <div>
                  <label>Type (TV/Movie)</label>
                  <input 
                    value={editingAnime.type} 
                    onChange={e => setEditingAnime({...editingAnime, type: e.target.value})} 
                  />
                </div>
              </div>

              <label>Description</label>
              <textarea 
                value={editingAnime.description} 
                onChange={e => setEditingAnime({...editingAnime, description: e.target.value})}
              />
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={() => setEditingAnime(null)}>Cancel</button>
              <button type="submit" className={styles.saveBtn}>Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}