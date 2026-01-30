"use client";
import React, { useState, useEffect } from 'react';
import styles from './Schedule.module.css';

export default function Schedule() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Logic to set the initial day to the current actual day
  const [activeDay, setActiveDay] = useState("");

  useEffect(() => {
    const today = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date());
    setActiveDay(today);
  }, []);

  const scheduleData: any = {
    "Sun": [
      { time: "09:00", title: "One Piece", ep: "1122" },
      { time: "18:30", title: "Shangri-La Frontier Season 2", ep: "14" },
      { time: "22:00", title: "Tower of God Season 2", ep: "26" },
      { time: "23:30", title: "Mushoku Tensei: Jobless Reincarnation", ep: "24" }
    ],
    "Mon": [
      { time: "19:00", title: "That Time I Got Reincarnated as a Slime", ep: "72" },
      { time: "21:30", title: "Re:Zero - Starting Life in Another World", ep: "65" },
      { time: "23:45", title: "Vinland Saga Season 2", ep: "24" }
    ],
    "Tue": [
      { time: "18:00", title: "Blue Lock Season 2", ep: "12" },
      { time: "22:30", title: "Chainsaw Man", ep: "12" },
      { time: "00:00", title: "Bleach: Thousand-Year Blood War", ep: "36" }
    ],
    "Wed": [
      { time: "17:30", title: "The Seven Deadly Sins: Four Knights", ep: "18" },
      { time: "20:00", title: "Mashle: Magic and Muscles", ep: "24" },
      { time: "23:00", title: "Dr. Stone: Science Future", ep: "01" },
      { time: "01:30", title: "The Eminence in Shadow", ep: "32" }
    ],
    "Thu": [
      { time: "19:30", title: "Dandadan", ep: "12" },
      { time: "21:00", title: "The Apothecary Diaries Season 2", ep: "02" },
      { time: "23:50", title: "My Happy Marriage", ep: "13" }
    ],
    "Fri": [
      { time: "18:30", title: "Solo Leveling Season 2", ep: "04" },
      { time: "23:00", title: "Sousou no Frieren 2nd Season", ep: "10" },
      { time: "00:26", title: "Jujutsu Kaisen: Culling Game", ep: "12" },
      { time: "01:53", title: "Fire Force Season 3", ep: "01" }
    ],
    "Sat": [
      { time: "17:00", title: "My Hero Academia Season 7", ep: "21" },
      { time: "19:30", title: "Kaiju No. 8", ep: "12" },
      { time: "22:15", title: "Demon Slayer: Infinity Castle", ep: "Movie" },
      { time: "23:45", title: "Black Clover", ep: "171" }
    ]
  };

  const currentReleases = scheduleData[activeDay] || [];

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>📅 Release Schedule</h2>
          <p className={styles.subtitle}>Estimated time for your time zone (UTC+5:30)</p>
        </div>
        
        <div className={styles.dayPicker}>
          {days.map((day) => (
            <button
              key={day}
              className={`${styles.dayBtn} ${activeDay === day ? styles.active : ''}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.timeline}>
        {currentReleases.length > 0 ? (
          currentReleases.map((item: any, index: number) => (
            <div key={index} className={styles.releaseItem}>
              <div className={styles.timeBox}>{item.time}</div>
              <div className={styles.infoBox}>
                <div className={styles.nameSection}>
                  <h4 className={styles.animeTitle}>{item.title}</h4>
                </div>
                <div className={styles.badgeWrapper}>
                   <span className={styles.epBadge}>Episode {item.ep}</span>
                   <span className={styles.liveIndicator}>Live</span>
                </div>
              </div>
              {/* This is the vertical gold bar that appears on hover */}
              <div className={styles.statusGlow}></div>
            </div>
          ))
        ) : (
          <div className={styles.empty}>
             <p>No episodes scheduled for today.</p>
          </div>
        )}
      </div>
    </section>
  );
}