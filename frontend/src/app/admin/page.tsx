"use client";
import React from 'react';
import styles from './Admin.module.css';
import Link from 'next/link';

export default function AdminDashboard() {
  const adminCards = [
    { title: "Manage Anime", desc: "Add/Edit all 390 anime", link: "/admin/anime", icon: "🎬" },
    { title: "Transcoding", desc: "Monitor FFmpeg progress", link: "/admin/transcoding", icon: "⚙️" },
    { title: "Link Health", desc: "Check Terabox/GDrive status", link: "/admin/providers", icon: "📡" },
    { title: "Storage", desc: "Manage HLS segments & costs", link: "/admin/storage", icon: "💾" },
    { title: "Users", desc: "Manage permissions & bans", link: "/admin/users", icon: "👤" },
  ];

  return (
    <main className="container">
      <div className={styles.adminHeader}>
        <h1>Admin Control Center</h1>
        <p>System Status: <span className={styles.online}>● Online</span></p>
      </div>

      <div className={styles.dashboardGrid}>
        {adminCards.map((card, i) => (
          <Link href={card.link} key={i} className={styles.card}>
            <span className={styles.icon}>{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}   