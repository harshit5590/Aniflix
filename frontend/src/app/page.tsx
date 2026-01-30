import React from 'react';
import Hero from '@/components/Hero/Hero';
import AnimeCard from '@/components/AnimeCard/AnimeCard';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './page.module.css';
import Comments from '@/components/Comments/Comments';
import TrendingPosts from '@/components/TrendingPosts/TrendingPosts';
import Footer from '@/components/Footer/Footer';
import { BASE_URL } from '@/lib/utils'; // Import the constant
import Schedule from '@/components/Schedule/Schedule';


export const dynamic = 'force-dynamic';

async function getAnimes() {
  try {
    const res = await fetch(`${BASE_URL}/api/anime`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("❌ FRONTEND FETCH FAILED. Is Backend running?");
    return [];
  }
}

export default async function HomePage() {
  const allAnimes = await getAnimes();

  if (allAnimes.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>
        <h1>Backend Offline</h1>
        <p>Please start your Node.js server on port 5000</p>
      </div>
    );
  }



  // BIFURCATION: Divide the 390 into unique groups
  const trending = allAnimes.slice(0, 12);      // Items 1-12
  const actionAnime = allAnimes.filter((a: any) => a.genres.includes("Action")).slice(0, 12);
  const adventureAnime = allAnimes.filter((a: any) => a.genres.includes("Adventure")).slice(0, 12);
  const fullLibrary = allAnimes.slice(12);     // Everything else from item 13 onwards
  const movies = allAnimes.filter((a: any) => a.type === "Movie").slice(0, 12);

  return (
    <main className="container">
      <Hero animeList={allAnimes} />
      <section style={{ width: '100%', overflow: 'hidden' }}>
        <Comments />
      </section>

      <div className={styles.homeLayout}>
        <div className={styles.leftColumn}>

          {/* CATEGORY: TRENDING */}
          <section className={styles.section}>
            <h2 className={styles.categoryTitle}>🔥 Trending Now</h2>
            <div className={styles.grid}>
              {trending.map((anime: any) => (
                <AnimeCard key={anime._id} anime={anime} />
              ))}
            </div>
          </section>

          {/* CATEGORY: ACTION */}
          <section className={styles.section}>
            <h2 className={styles.categoryTitle}>⚔️ Action Packed</h2>
            <div className={styles.grid}>
              {actionAnime.map((anime: any) => (
                <AnimeCard key={anime._id} anime={anime} />
              ))}
            </div>
          </section>

          {/* CATEGORY: ADVENTURE */}
          <section className={styles.section}>
            <h2 className={styles.categoryTitle}>🗺️ Epic Adventures</h2>
            <div className={styles.grid}>
              {adventureAnime.map((anime: any) => (
                <AnimeCard key={anime._id} anime={anime} />
              ))}
            </div>
          </section>

          {/* CATEGORY: MOVIES */}
          <section className={styles.section}>
            <h2 className={styles.categoryTitle}>🎬 Anime Movies</h2>
            <div className={styles.grid}>
              {movies.map((anime: any) => (
                <AnimeCard key={anime._id} anime={anime} />
              ))}
            </div>
          </section>

          {/* FULL LIBRARY */}
          {/* <section className={styles.section}>
            <h2 className={styles.categoryTitle}>More Anime ({allAnimes.length})</h2>
            <div className={styles.grid}>
              {fullLibrary.map((anime: any) => (
                <AnimeCard key={anime._id} anime={anime} />
              ))}
            </div>
          </section> */}
          <Schedule />

        </div>

        <aside className={styles.sidebar}>
          <Sidebar trendingAnimes={allAnimes.slice(0, 10)} />
          <TrendingPosts />
        </aside>
      </div>
      {/* <Footer /> Add it here */}
    </main>
  );
}