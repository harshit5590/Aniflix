"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import styles from './Player.module.css';

interface StreamSource {
  type: 'mp4' | 'hls';
  lang: 'SUB' | 'DUB';
  url: string;
}

interface PlayerProps {
  episodeId: string;
}

export default function SecureHlsPlayer({ episodeId }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streams, setStreams] = useState<StreamSource[]>([]);
  const [currentLang, setCurrentLang] = useState<'SUB' | 'DUB'>('SUB');
  const [isHls, setIsHls] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch available streams for this episode
  useEffect(() => {
    const initPlayer = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/episode/${episodeId}/stream`);
        const data = await res.json();
        setStreams(data.streams);
        
        // Default to SUB if available
        const defaultSource = data.streams.find((s: any) => s.lang === 'SUB') || data.streams[0];
        loadSource(defaultSource);
      } catch (err) {
        setError("Failed to load video stream");
      }
    };
    initPlayer();
  }, [episodeId]);

  // 2. Source Loading Logic (MP4 vs HLS)
  const loadSource = (source: StreamSource) => {
    const video = videoRef.current;
    if (!video) return;

    // Save current playback time for seamless switching
    const currentTime = video.currentTime;

    if (source.type === 'hls') {
      setIsHls(true);
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source.url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.currentTime = currentTime;
          video.play();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS support
        video.src = source.url;
      }
    } else {
      // Direct MP4 Proxy (Cold Start)
      setIsHls(false);
      video.src = source.url;
      video.currentTime = currentTime;
      video.play();
    }
  };

  const handleLangSwitch = (lang: 'SUB' | 'DUB') => {
    const newSource = streams.find(s => s.lang === lang);
    if (newSource) {
      setCurrentLang(lang);
      loadSource(newSource);
    }
  };

  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.playerWrapper}>
      <video 
        ref={videoRef} 
        controls 
        className={styles.videoElement}
        controlsList="nodownload"
      />
      
      {/* LANGUAGE SELECTOR OVERLAY */}
      <div className={styles.controls}>
        <div className={styles.badge}>
          {isHls ? "Adaptive HLS" : "Direct MP4"}
        </div>
        <div className={styles.langSwitch}>
          {['SUB', 'DUB'].map(lang => (
            <button
              key={lang}
              disabled={!streams.some(s => s.lang === lang)}
              className={currentLang === lang ? styles.active : ''}
              onClick={() => handleLangSwitch(lang as any)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}