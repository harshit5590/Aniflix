import React, { use } from 'react';
import AnimeCard from '@/components/AnimeCard/AnimeCard';
import styles from './AZList.module.css';
import { BASE_URL } from '@/lib/utils';

async function getAnimes() {
  const res = await fetch(`${BASE_URL}/api/anime`, { cache: 'no-store' });
  return res.json();
}

export default async function AZListPage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const allAnimes = await getAnimes();

  // Filtering logic
  const filtered = allAnimes.filter((anime: any) => {
    if (letter === "0-9") return /^\d/.test(anime.title);
    if (letter === "All") return true;
    return anime.title.toUpperCase().startsWith(letter.toUpperCase());
  });

  return (
    <main className="container">
      <div className={styles.header}>
        <h1 className={styles.title}>Anime Starting with "{letter}"</h1>
        <p className={styles.count}>Found {filtered.length} anime results</p>
      </div>

      <div className={styles.grid}>
        {filtered.map((anime: any) => (
          <AnimeCard key={anime._id} anime={anime} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.empty}>
          <h2>No results found for "{letter}"</h2>
          <a href="/" className="glow-button">Go Back Home</a>
        </div>
      )}
    </main>
  );
}