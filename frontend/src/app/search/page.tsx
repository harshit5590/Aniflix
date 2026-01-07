import React, { use } from 'react';
import AnimeCard from '@/components/AnimeCard/AnimeCard';
import styles from '../genres/Genres.module.css'; // Reuse your grid styles
import { BASE_URL } from '@/lib/utils';

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  // Fetch results from backend using the 'q' parameter
  const res = await fetch(`${BASE_URL}/api/anime?q=${q}`, { cache: 'no-store' });
  const results = await res.json();

  return (
    <main className="container" style={{paddingTop: '40px'}}>
      <h1 style={{color: '#fff'}}>Search Results for: "{q}"</h1>
      <p style={{color: '#8e8e93', marginBottom: '30px'}}>Found {results.length} anime</p>
      
      <div className={styles.animeGrid}>
        {results.map((anime: any) => (
          <AnimeCard key={anime._id} anime={anime} />
        ))}
      </div>

      {results.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '100px', color: '#888'}}>
          No anime found matching your search.
        </p>
      )}
    </main>
  );
}