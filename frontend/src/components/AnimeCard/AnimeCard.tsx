"use client";
import React, { useState, useEffect } from 'react';
import styles from './AnimeCard.module.css';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function AnimeCard({ anime }: { anime: any }) {
  const [isAdded, setIsAdded] = useState(false);

  // 1. Check if this anime is already in "My List" when the card loads
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem('myList') || '[]');
    const exists = savedList.some((item: any) => item._id === anime._id);
    setIsAdded(exists);
  }, [anime._id]);

  // 2. Function to Add/Remove anime
  const toggleMyList = (e: React.MouseEvent) => {
    e.preventDefault(); // STOPS the click from opening the detail page
    e.stopPropagation();

    let savedList = JSON.parse(localStorage.getItem('myList') || '[]');

    if (isAdded) {
      // Remove from list
      savedList = savedList.filter((item: any) => item._id !== anime._id);
    } else {
      // Add to list
      savedList.push(anime);
    }

    localStorage.setItem('myList', JSON.stringify(savedList));
    setIsAdded(!isAdded);

    // Optional: Dispatch a custom event to update the "My List" page count instantly
    window.dispatchEvent(new Event("myListUpdated"));
  };

  return (
    <div className={styles.card}>
      {/* THE MY-LIST BUTTON */}
      <button 
        className={`${styles.addBtn} ${isAdded ? styles.added : ''}`} 
        onClick={toggleMyList}
        title={isAdded ? "Remove from My List" : "Add to My List"}
      >
        {isAdded ? '✓' : '+'}
      </button>

      <Link href={`/anime/${anime._id}`} className={styles.cardLink}>
        <div className={styles.posterContainer}>
          <div className={styles.ratingBadge}>★ {anime.rating}</div>
          <img 
            src={getImageUrl(anime.poster)} 
            alt={anime.title} 
            className={styles.posterImage}
          />
        </div>

        <div className={styles.info}>
          <h3 className={styles.title}>{anime.title}</h3>
          <div className={styles.meta}>
            <span className={styles.type}>{anime.type}</span>
            <span className={styles.dot}>•</span>
            <span>{anime.episodesCount}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}