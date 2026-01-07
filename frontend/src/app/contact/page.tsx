"use client";
import React from 'react';
import styles from './Contact.module.css';

export default function ContactPage() {
  return (
    <main className="container">
      <div className={styles.contactCard}>
        <h1>Contact Support</h1>
        <p>Having trouble? Send us a message.</p>
        <input type="text" placeholder="Subject" className={styles.input} />
        <textarea placeholder="Describe your issue..." className={styles.textarea}></textarea>
        <button className={styles.sendBtn} onClick={() => alert("Message Sent!")}>Submit</button>
      </div>
    </main>
  );
};