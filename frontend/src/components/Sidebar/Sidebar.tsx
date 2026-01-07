import React from 'react';
import styles from './Sidebar.module.css';
import Link from 'next/link'; // 1. Import Link
import { getImageUrl } from '@/lib/utils';

export default function Sidebar({ trendingAnimes = [] }: { trendingAnimes: any[] }) {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>
        <span className={styles.star}>✦</span> Trending
      </h2>
      
      <div className={styles.list}>
        {trendingAnimes.map((anime, index) => (
          /* 2. Wrap the whole item in a Link */
          <Link 
            href={`/anime/${anime._id}`} 
            key={anime._id} 
            className={styles.itemLink}
          >
            <div className={styles.item}>
              {/* Numbering 01, 02, etc. */}
              <span className={styles.rank}>
                {(index + 1).toString().padStart(2, '0')}
              </span>

              {/* Mini Poster */}
              <div className={styles.miniPosterBox}>
                <img 
                  src={getImageUrl(anime.poster)} 
                  alt={anime.title} 
                  className={styles.miniPoster} 
                />
              </div>

              {/* Info Area */}
              <div className={styles.info}>
                <h4 className={styles.animeTitle}>{anime.title}</h4>
                <div className={styles.stats}>
                  <span className={styles.views}>👁️ 200.2k</span>
                  <span className={styles.likes}>❤️ 200.2k</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}