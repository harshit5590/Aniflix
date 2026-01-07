"use client";
import React from 'react';
import styles from './Support.module.css';

export default function SupportPage() {
  const faqs = [
    { q: "How to add anime to My List?", a: "Click the '+' icon on any anime card." },
    { q: "Is this service free?", a: "Yes, Aniflix is free for all anime fans." },
    { q: "How to change my profile picture?", a: "Go to your Profile dropdown and click 'Insert Image'." }
  ];

  return (
    <main className="container">
      <h1 className={styles.title}>Help & Support</h1>
      <div className={styles.faqList}>
        {faqs.map((faq, i) => (
          <div key={i} className={styles.faqItem}>
            <h3>{faq.q}</h3>
            <p>{faq.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}