"use client";
import React, { useEffect, useState } from 'react';
import AnimeCard from '@/components/AnimeCard/AnimeCard';
import styles from './MyList.module.css';
import Link from 'next/link';

export default function MyListPage() {
  const [list, setList] = useState([]);

  useEffect(() => {
    // Load saved anime from local storage
    const saved = JSON.parse(localStorage.getItem('myList') || '[]');
    setList(saved);
  }, []);

  return (
    <main className="container" style={{paddingTop: '40px'}}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>My Collection ({list.length})</h1>
        {list.length > 0 && (
          <button 
            onClick={() => {localStorage.removeItem('myList'); setList([]);}} 
            className={styles.clearBtn}
          >
            Clear All
          </button>
        )}
      </div>

      {list.length > 0 ? (
        <div className={styles.grid}>
          {list.map((anime: any) => (
            <AnimeCard key={anime._id} anime={anime} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <h2>Your list is empty</h2>
          <p>Go to the home page and click the + button to add anime.</p>
          <Link href="/" className={styles.browseBtn}>Browse Anime</Link>
        </div>
      )}
    </main>
  );
}