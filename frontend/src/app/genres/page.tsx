import AnimeCard from '@/components/AnimeCard/AnimeCard';
import styles from './Genres.module.css';
import Link from 'next/link';
import { BASE_URL } from '@/lib/utils';

type Props = {
  searchParams: Promise<{ genre?: string }>;
};

async function getAnimes() {
  const res = await fetch(`${BASE_URL}/api/anime`, { cache: 'no-store' });
  return res.json();
}

export default async function GenresPage({ searchParams }: Props) {
  const allAnimes = await getAnimes();
  
  // Unwrapping searchParams for Next.js 15
  const { genre } = await searchParams;
  const selectedGenre = genre || 'Action';

  // 1. Extract Unique Genres from the 390 items
 const allGenres: string[] = Array.from(
  new Set(allAnimes?.flatMap((a: any) => a.genres || []))
).sort() as string[];

  // 2. Filter anime
  const filtered = allAnimes.filter((a: any) => 
    a.genres.includes(selectedGenre)
  );

  return (
    <main className={styles.container}>
      <header className={styles.genreHeader}>
        <h1>Browse by Genre</h1>
        <div className={styles.genreList}>
          {allGenres.map((g) => (
            <Link 
              key={g} 
              href={`/genres?genre=${g}`} 
              className={`${styles.genreLink} ${selectedGenre === g ? styles.active : ''}`}
            >
              {g}
            </Link>
          ))}
        </div>
      </header>

      <section className={styles.resultsSection}>
        <span className={styles.resultCount}>
          Found {filtered.length} anime in "{selectedGenre}"
        </span>

        {filtered.length > 0 ? (
          <div className={styles.animeGrid}>
            {filtered.map((anime: any) => (
              <AnimeCard key={anime._id} anime={anime} />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <p>No anime found for this genre.</p>
          </div>
        )}
      </section>
    </main>
  );
}