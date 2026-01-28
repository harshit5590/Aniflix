"use client";

import React, { useState, useEffect } from 'react';
import styles from './Transcoding.module.css';
import { BASE_URL } from '@/lib/utils'; // Uses http://127.0.0.1:5000
import { useRouter } from 'next/navigation';

interface TranscodingJob {
  id: string;
  episodeSource: {
    episode: {
      anime: { title: string };
      episodeNumber: number;
    };
    language: string;
    provider: string;
  };
  status: 'QUEUED' | 'ACTIVE' | 'COMPLETED' | 'FAILED';
  progress: number;
  logs: string | null;
  updatedAt: string;
}

export default function TranscodingDashboard() {
  const [jobs, setJobs] = useState<TranscodingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 1. MAIN FETCH FUNCTION
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // If no token, redirect to login
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/admin/transcoding/jobs`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (res.status === 401 || res.status === 403) {
        setError("Unauthorized. You must be an Admin.");
        return;
      }

      if (!res.ok) throw new Error("Backend server error");

      const data = await res.json();
      setJobs(data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Cannot reach Backend server. Please check port 5000.");
    } finally {
      setLoading(false);
    }
  };

  // 2. POLLING: Refresh every 4 seconds to show progress
  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 4000);
    return () => clearInterval(interval);
  }, []);

  // 3. ACTION HANDLERS
  const handleAction = async (jobId: string, action: 'retry' | 'cancel') => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/transcoding/jobs/${jobId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchJobs();
    } catch (err) {
      alert("Action failed. Server might be down.");
    }
  };

  if (loading) return <div className={styles.centered}>📡 Connecting to Transcoding Engine...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>Video Transcoding Dashboard</h1>
          <p>Monitoring FFmpeg HLS conversion tasks</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>Active</span>
            <strong>{jobs.filter(j => j.status === 'ACTIVE').length}</strong>
          </div>
          <div className={styles.statItem}>
            <span>Queued</span>
            <strong>{jobs.filter(j => j.status === 'QUEUED').length}</strong>
          </div>
        </div>
      </header>

      {error && <div className={styles.errorBanner}>⚠️ {error}</div>}

      <div className={styles.jobList}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobInfo}>
                <div className={styles.animeMeta}>
                  <h3>{job.episodeSource.episode.anime.title}</h3>
                  <p>Episode {job.episodeSource.episode.episodeNumber} • {job.episodeSource.language}</p>
                </div>
                <span className={`${styles.statusBadge} ${styles[job.status.toLowerCase()]}`}>
                  {job.status}
                </span>
              </div>

              {/* PROGRESS BAR */}
              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>{Math.round(job.progress)}%</span>
              </div>

              {/* REAL-TIME LOGS */}
              {job.logs && (
                <div className={styles.logBox}>
                  <code>{job.logs}</code>
                </div>
              )}

              <div className={styles.actions}>
                {job.status === 'FAILED' && (
                  <button onClick={() => handleAction(job.id, 'retry')} className={styles.retryBtn}>
                    Retry Task
                  </button>
                )}
                {job.status !== 'COMPLETED' && (
                  <button onClick={() => handleAction(job.id, 'cancel')} className={styles.cancelBtn}>
                    Stop
                  </button>
                )}
                <span className={styles.timestamp}>Last update: {new Date(job.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
             <h3>No active tasks</h3>
             <p>Transcoding jobs appear here once you add video links to episodes.</p>
          </div>
        )}
      </div>
    </div>
  );
}