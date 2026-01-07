import AnimeCard from '@/components/AnimeCard/AnimeCard';
import styles from '../page.module.css';
import { BASE_URL } from '@/lib/utils';

// DEFINE IT HERE AS WELL
async function getAllAnime() {
  const res = await fetch(`${BASE_URL}/api/anime`, { cache: 'no-store' });
  return res.json();
}

export default async function AnimeListPage() {
  const animeList = await getAllAnime();

  return (
    <main className="container" style={{paddingTop: '40px'}}>
      <h1 className={styles.categoryTitle}>Anime Library ({animeList.length})</h1>
      <div className={styles.grid}>
        {animeList.map((anime: any) => (
          <AnimeCard key={anime._id} anime={anime} />
        ))}
      </div>
    </main>
  );
}