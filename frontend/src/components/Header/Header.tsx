"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getImageUrl } from '@/lib/utils';
import { BASE_URL } from '@/lib/utils';

export default function Header() {
  // --- 1. DECLARE ALL STATES AT THE TOP ---
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- 2. DECLARE REFS ---
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- 3. DECLARE ALL EFFECTS ---
  
  // Effect 1: Handle Initial Mounting & Storage Sync
  useEffect(() => {
    setMounted(true);
    const loadUser = () => {
      const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
      setUser(savedUser);
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // Effect 2: Live Search Suggestions (Debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/api/anime/suggestions?q=${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Suggestion fetch failed", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Effect 3: Close menus on Outside Click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 4. HELPER FUNCTIONS ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = "/login";
  };

  // --- 5. CONDITIONAL RETURN (AFTER ALL HOOKS) ---
  if (!mounted) {
    return <header className={styles.header}></header>; // Simple skeleton
  }

  // --- 6. RENDER UI ---
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        
        {/* LOGO */}
        <Link href="/" className={styles.logo}>
          Aniflix<span>TV</span>
        </Link>

        {/* MOBILE HAMBURGER */}
        <div 
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamActive : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span><span></span><span></span>
        </div>

        {/* NAVIGATION & SEARCH SECTION */}
        <div className={`${styles.navActions} ${mobileMenuOpen ? styles.showMobile : ''}`}>
          
          {/* SEARCH WITH SUGGESTIONS */}
          <div className={styles.searchWrapper} ref={searchRef}>
            <form className={styles.searchContainer} onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Search anime..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
              <button type="submit" className={styles.searchBtn}>🔍</button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className={styles.suggestionBox}>
                {suggestions.map((anime: any) => (
                  <Link 
                    key={anime._id} 
                    href={`/anime/${anime._id}`} 
                    className={styles.suggestionItem}
                    onClick={() => { setShowSuggestions(false); setSearchQuery(""); setMobileMenuOpen(false); }}
                  >
                    <img src={getImageUrl(anime.poster)} alt="" className={styles.sugPoster} />
                    <span className={styles.sugTitle}>{anime.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* NAV LINKS */}
          <nav className={styles.nav}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/my-list" onClick={() => setMobileMenuOpen(false)}>My List</Link>
            <Link href="/genres" onClick={() => setMobileMenuOpen(false)}>Genres</Link>
            <Link href="/az-list/All" onClick={() => setMobileMenuOpen(false)}>A-Z List</Link>
          </nav>
        </div>

        {/* USER SECTION */}
        <div className={styles.userSection}>
          <span className={styles.notifIcon}>🔔</span>
          
          {user ? (
            <div className={styles.profileWrapper} ref={dropdownRef}>
              <div className={styles.avatar} onClick={() => setProfileOpen(!profileOpen)}>
                {user.profilePic ? (
                  <img src={getImageUrl(user.profilePic)} alt="User" />
                ) : (
                  <span className={styles.initial}>{user.fullName?.[0].toUpperCase()}</span>
                )}
              </div>

              {profileOpen && (
                <div className={styles.dropdownSlider}>
                  <div className={styles.dropHeader}>
                    <p className={styles.dropName}>{user.fullName}</p>
                    <p className={styles.dropEmail}>{user.email}</p>
                  </div>
                  <hr className={styles.divider} />
                  <Link href="/account" onClick={() => setProfileOpen(false)}>👤 Account</Link>
                  <Link href="/settings" onClick={() => setProfileOpen(false)}>⚙️ Setting</Link>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>📧 Contact</Link>
                  <hr className={styles.divider} />
                  <button className={styles.logout} onClick={handleLogout}>🚪 Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}