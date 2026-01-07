"use client";
import React, { useState } from 'react';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  // --- 1. DECLARE STATES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // This fixes "setError is not defined"
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  // --- 2. LOGIN LOGIC ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 404) {
        // INDICATE TO REGISTER (This is the logic you requested)
        setError("No account found with this email. Please Sign-Up first!");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Invalid Email or Password");
        setLoading(false);
        return;
      }

      // SUCCESS
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to home
      window.location.href = "/";
      
    } catch (err) {
      setError("Server is offline. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. SOCIAL LOGIN (Direct Login) ---
  const handleSocialLogin = () => {
    // This would typically open a Google/FB popup
    console.log("Redirecting to social login...");
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        
        {/* LEFT SECTION: FORM */}
        <form className={styles.formSection} onSubmit={handleLogin}>
          <h1>Sign in</h1>
          <p className={styles.subText}>
            Don't have an account? <Link href="/register">Create now</Link>
          </p>

          {/* ERROR MESSAGE DISPLAY */}
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" 
              placeholder="example@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className={styles.signInBtn} disabled={loading}>
            {loading ? "Verifying..." : "Sign in"}
          </button>

          <div className={styles.divider}>OR</div>

          <button type="button" className={styles.socialBtn} onClick={handleSocialLogin}>
            <img src="/google-icon.png" alt="" width="20" /> Continue with Google
          </button>
          <button type="button" className={styles.socialBtn} onClick={handleSocialLogin}>
            <img src="/facebook-icon.png" alt="" width="20" /> Continue with Facebook
          </button>
        </form>

        {/* RIGHT SECTION: GRAPHIC */}
        <div className={styles.graphicSection}>
          <div className={styles.shieldWrapper}>
             {/* Replace with your shield SVG or Image */}
             <div className={styles.shieldGlow}></div>
             <div className={styles.lockIcon}>🔒</div>
          </div>
        </div>

      </div>
    </div>
  );
}