"use client";

import React, { useState, useEffect } from 'react';
import styles from './Providers.module.css';

interface ProviderMetric {
  provider: string;
  status: 'OK' | 'DEGRADED' | 'DOWN';
  successRate: number;
  avgResponseTime: number;
  totalChecks: number;
  lastError?: string;
}

export default function ProviderHealthPage() {
  const [metrics, setMetrics] = useState<ProviderMetric[]>([]);

  const fetchHealth = async () => {
    const res = await fetch('/api/admin/providers/health');
    const data = await res.json();
    setMetrics(data);
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Provider Health Monitor</h1>
        <p>Real-time link resolution reliability metrics</p>
      </header>

      <div className={styles.grid}>
        {metrics.map((m) => (
          <div key={m.provider} className={`${styles.card} ${styles[m.status.toLowerCase()]}`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.providerName}>{m.provider}</h2>
              <span className={styles.statusDot}></span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.label}>Health Status</span>
              <span className={styles.value}>{m.status}</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.label}>Success Rate</span>
              <span className={styles.value}>{(m.successRate * 100).toFixed(1)}%</span>
            </div>

            <div className={styles.statRow}>
              <span className={styles.label}>Avg Response</span>
              <span className={styles.value}>{m.avgResponseTime}ms</span>
            </div>

            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${m.successRate * 100}%` }}
              ></div>
            </div>

            {m.lastError && (
              <div className={styles.errorBox}>
                <strong>Last Error:</strong>
                <p>{m.lastError}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}