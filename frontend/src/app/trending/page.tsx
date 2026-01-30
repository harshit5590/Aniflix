import React from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { BASE_URL } from '@/lib/utils';
import styles from './Trending.module.css';

async function getAnimes() {
  const res = await fetch(`${BASE_URL}/api/anime`, { cache: 'no-store' });
  return res.json();
}

export default async function TrendingPage() {
  const allAnimes = await getAnimes();
  // Show top 20 for the dedicated page
  const trending = allAnimes.slice(0, 20); 

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Trending Anime</h1>
        <p className={styles.description}>The most watched series this week on Aniflix.</p>
      </header>
      
      <div className={styles.listWrapper}>
        {/* We reuse the Sidebar component logic here */}
        <Sidebar trendingAnimes={trending} />
      </div>
    </main>
  );
}