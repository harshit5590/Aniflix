"use client";

import React, { useState, useEffect, use } from 'react';
import { BASE_URL } from '@/lib/utils';
import Link from 'next/link';
import styles from './Episodes.module.css';

type Props = { params: Promise<{ id: string }> };

export default function EpisodeManagerPage({ params }: Props) {
    const { id } = use(params);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [anime, setAnime] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // New Episode Form State
    const [newEpNum, setNewEpNum] = useState("");
    const [newEpTitle, setNewEpTitle] = useState("");

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        try {
            setLoading(true);

            // 1. Fetch Anime Metadata (Title etc)
            const animeRes = await fetch(`${BASE_URL}/api/anime/${id}`);
            if (!animeRes.ok) throw new Error("Anime not found");
            const animeData = await animeRes.json();
            setAnime(animeData);

            // 2. Fetch Episodes from the ADMIN route
            const epRes = await fetch(`${BASE_URL}/api/admin/anime/${id}/episodes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!epRes.ok) {
                const errorText = await epRes.text();
                console.error("Server Error:", errorText);
                throw new Error("Episodes fetch failed");
            }

            const epData = await epRes.json();
            setEpisodes(epData);

        } catch (e: any) {
            console.error("Full Error Details:", e.message);
            // This sets the UI to show the error
            alert("Error: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleAddEpisode = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const res = await fetch(`${BASE_URL}/api/admin/anime/${id}/episodes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ episodeNumber: newEpNum, title: newEpTitle })
        });

        if (res.ok) {
            setNewEpNum("");
            setNewEpTitle("");
            fetchData(); // Refresh list
        } else {
            alert("Episode already exists or invalid data.");
        }
    };

    if (loading) return <div className="container">Loading Episode Manager...</div>;

    return (
        <main className={styles.container}>
            <header className={styles.header}>
                <Link href="/admin/anime" className={styles.backBtn}>← Back to Library</Link>
                <h1>Manage Episodes: {anime?.title}</h1>
            </header>

            {/* QUICK ADD FORM */}
            <section className={styles.addSection}>
                <h3>Quick Add Episode</h3>
                <form onSubmit={handleAddEpisode} className={styles.addForm}>
                    <input
                        type="number"
                        placeholder="Ep #"
                        value={newEpNum}
                        onChange={e => setNewEpNum(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Episode Title (Optional)"
                        value={newEpTitle}
                        onChange={e => setNewEpTitle(e.target.value)}
                    />
                    <button type="submit" className={styles.submitBtn}>Create Episode</button>
                </form>
            </section>

            {/* EPISODES GRID */}
            <div className={styles.epGrid}>
                {episodes.length > 0 ? (
                    episodes.map((ep) => (
                        <div key={ep.id} className={styles.epCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.epLabel}>EPISODE</span>
                                <span className={styles.epNumber}>{ep.episodeNumber}</span>
                            </div>
                            <p className={styles.epTitle}>{ep.title}</p>

                            {/* THIS BUTTON TAKES YOU TO THE LINK INGESTION PAGE */}
                            <Link href={`/admin/episodes/${ep.id}/sources`} className={styles.manageLinksBtn}>
                                🔗 Manage Cloud Links
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className={styles.empty}>No episodes created yet for this anime.</div>
                )}
            </div>
        </main>
    );
}