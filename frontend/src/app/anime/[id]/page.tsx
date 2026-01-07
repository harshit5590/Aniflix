"use client";
import React, { use, useState, useEffect } from 'react';
import styles from './AnimeDetail.module.css';
import AnimeCard from '@/components/AnimeCard/AnimeCard';
import Link from 'next/link';
import { BASE_URL } from '@/lib/utils';

type Props = { params: Promise<{ id: string }> };

export default function AnimeDetailPage({ params }: Props) {
  // 1. UNWRAP params at the very top
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // 2. DECLARE all hooks (useState/useEffect) at the top level
  const [anime, setAnime] = useState<any>(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current anime
        const animeRes = await fetch(`${BASE_URL}/api/anime/${id}`);
        const animeData = await animeRes.json();
        setAnime(animeData);

        // Fetch recommendations based on the first genre of the current anime
        const genre = animeData.genres?.[0] || "Action";
        const allRes = await fetch(`${BASE_URL}/api/anime`);
        const allData = await allRes.json();
        
        // Filter: same genre, but not the current anime
        const recommended = allData
          .filter((item: any) => item.genres.includes(genre) && item._id !== id)
          .slice(0, 6);
          
        setRelated(recommended);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 3. CONDITIONAL RETURNS must come AFTER all hooks are declared
  if (loading || !anime) {
    return (
      <div className="container" style={{ color: '#fff', paddingTop: '100px', textAlign: 'center' }}>
        <h2>Loading Anime Details...</h2>
      </div>
    );
  }

  return (
    <main className={styles.wrapper}>
      <div className="container">
        {/* TOP BREADCRUMB */}
        <p className={styles.breadcrumb}>Home | {anime.type}</p>

        <div className={styles.topSection}>
          {/* PORTRAIT POSTER */}
          <div className={styles.mainPosterBox}>
            <img src={anime.poster} alt={anime.title} className={styles.mainPoster} />
          </div>

          <div className={styles.detailsContent}>
            <h1 className={styles.mainTitle}>{anime.title}</h1>
            <p className={styles.epTime}>EP {anime.episodesCount} • 24m</p>

            <div className={styles.badgeGroup}>
              <span className={styles.sub}>SUB</span>
              <span className={styles.hd}>HD</span>
              <span className={styles.dub}>DUB</span>
            </div>

            {/* SYNOPSIS (Limited to 2 lines via CSS) */}
            <p className={styles.description}>{anime.description}</p>

            {/* CONTINUE WATCHING BOX */}
            <div className={styles.continueWatching}>
              <div className={styles.continueHeader}>
                <div className={styles.playBtnCircle}>▶</div>
                <span className={styles.continueLabel}>Continue Watching</span>
              </div>
              <p className={styles.epStatus}>EP 01 | {anime.episodesCount}</p>
              <div className={styles.progressContainer}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: '10%' }}></div>
                </div>
              </div>
              <Link href={`/watch/${anime._id}`} className={styles.watchNowBtn}>
                Watch Now
              </Link>
            </div>
          </div>
        </div>

        {/* CHARACTERS SECTION */}
        <section className={styles.charactersSection}>
          <h2 className={styles.sectionHeading}>Characters & Voice Actors</h2>
          <div className={styles.characterGrid}>
            {[
              { char: "Midoriya, Izuku", actor: "Yamashita, Daiki" },
              { char: "All Might", actor: "Miyake, Kenta" },
              { char: "Katsuki Bakugou", actor: "Kaito Ishikawa" },
              { char: "Tenya Iida", actor: "Yamashita, Daiki" },
              { char: "Ochako Uraraka", actor: "Ayane Sakura" },
              { char: "Shouta Aizawa", actor: "Junichi Suwabe" }
            ].map((item, index) => (
              <div key={index} className={styles.characterCard}>
                <div className={styles.charAvatar}></div>
                <div className={styles.charInfo}>
                  <h4>{item.char}</h4>
                  <p>{item.actor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* RECOMMENDED SECTION */}
        {related.length > 0 && (
          <section className={styles.recommendSection}>
            <h2 className={styles.sectionHeading}>Recommended For You</h2>
            <div className={styles.recommendGrid}>
              {related.map((item: any) => (
                <AnimeCard key={item._id} anime={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}