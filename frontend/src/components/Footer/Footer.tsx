"use client";
import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    const alphabet = ["All", "#", "0-9", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* --- TOP SECTION: TOGGLE & A-Z LIST --- */}
                <div className={styles.topBar}>
                    <div className={styles.langToggle}>
                        <div className={styles.switch}></div>
                        <span>EN/JP</span>
                    </div>
                    <div className={styles.azSection}>
                        <div className={styles.azLabel}>
                            <strong>A-Z LIST</strong> | Searching anime order by alphabet name A to Z.
                        </div>
                        <div className={styles.alphabetList}>
                            {alphabet.map((char) => (
                                <Link key={char} href={`/az-list/${char}`} className={styles.azBtn}>
                                    {char}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- MIDDLE SECTION: LOGO & LINKS --- */}
                <div className={styles.middleSection}>
                    <div className={styles.brandCol}>
                        <h2 className={styles.logo}>Aniflix</h2>
                        <p className={styles.copy}>Copyright © 2025 Aniflix All Rights Reserved.</p>
                        <div className={styles.socials}>
                            <Link href="#" className={styles.socialIcon}>Twitter</Link>
                            <Link href="#" className={styles.socialIcon}>Telegram</Link>
                            <Link href="#" className={styles.socialIcon}>Reddit</Link>
                        </div>
                    </div>

                    <div className={styles.linkCol}>
                        <h4>Help</h4>
                        <Link href="/contact">Contact</Link>
                        <Link href="/support">FAQ</Link>
                        <Link href="#">Aniflix App</Link>
                    </div>

                    <div className={styles.linkCol} id='link'>
                        <h4>Links</h4>
                        <Link href="/genres">A-Z List</Link>
                        <Link href="/">Upcoming</Link>
                        <Link href="/popular">Most Popular</Link>
                    </div>

                    {/* LUFFY CHARACTER IMAGE */}
                    <div className={styles.characterBox}>
                        <img src="https://comicvine.gamespot.com/a/uploads/scale_super/11160/111605805/8687496-monkey_d__luffy__gear_5____updated_by_b_a_i_o_r_e_t_t_o_df3gezw-fullview.png" alt="Luffy" className={styles.luffyImg} />
                    </div>
                </div>

                {/* --- BOTTOM SECTION: DISCLAIMER ---
                <div className={styles.bottomBar}>
                    <p>Disclaimer: This site does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
                </div> */}
            </div>
        </footer>
    );
}