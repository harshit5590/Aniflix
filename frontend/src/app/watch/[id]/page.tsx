"use client";
import React, { use, useState, useEffect } from 'react'; // Import 'use'
import styles from './Watch.module.css';
import { BASE_URL } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

export default function WatchPage({ params }: Props) {
  // 1. Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [anime, setAnime] = useState<any>(null);

  useEffect(() => {
    // 2. Use the id in your fetch
    fetch(`${BASE_URL}/api/anime/${id}`)
      .then(res => res.json())
      .then(data => setAnime(data));
  }, [id]);

  if (!anime) return <p>Loading...</p>;

  return (
    <div className={styles.watchWrapper}>
      <h1>Watching {anime.title}</h1>
      {/* ... rest of your UI ... */}
    </div>
  );
}