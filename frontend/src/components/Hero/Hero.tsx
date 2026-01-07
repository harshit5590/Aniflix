"use client";
import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import Link from 'next/link';
import { getImageUrl } from '@/lib/utils';

export default function Hero({ animeList = [] }: { animeList: any[] }) {
  const [index, setIndex] = useState(0);

  // Take the first 10 anime for the slider
  const featured = animeList?.length > 0 ? animeList.slice(0, 10) : [];

  useEffect(() => {
    if (featured.length > 0) {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % featured.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featured.length]);

  // If data hasn't arrived yet, show this
  if (featured.length === 0) {
    return <div className={styles.heroPlaceholder}>Loading Anime Data...</div>;
  }

  const current = featured[index];

  return (
    <div className={styles.hero}>
      {/* The background image */}
      <img 
        src={getImageUrl(current.banner || current.poster)} 
        className={styles.banner} 
        alt="banner" 
      />
      
      <div className={styles.overlay}>
        <p className={styles.type}>Home | {current.type}</p>
        <h1 className={styles.title}>{current.title}</h1>
        
        <div className={styles.meta}>
          <span>EP {current.episodesCount} • 24m</span>
          <div className={styles.badges}>
             <span className={styles.sub}>SUB</span>
             <span className={styles.hd}>HD</span>
             <span className={styles.dub}>DUB</span>
          </div>
        </div>

        {/* This restricts synopsis to 2 lines as you requested */}
        <p className={styles.synopsis}>{current.description}</p>

        <div className={styles.actions}>
          <Link href={`/watch/${current._id}`} className={styles.watchBtn}>Watch Now</Link>
          <button className={styles.listBtn}>+ My List</button>
        </div>

        {/* Dots slider */}
        <div className={styles.dots}>
          {featured.map((_, i) => (
            <div 
              key={i} 
              className={`${styles.dot} ${index === i ? styles.activeDot : ''}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}