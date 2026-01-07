"use client";
import React, { useState } from 'react';
import styles from './Register.module.css'; // Copy Login.module.css to this file
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    dob: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration Successful! Please Login.");
        router.push("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server is offline. Start your Backend terminal!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginContainer}>
        <form className={styles.formSection} onSubmit={handleRegister}>
          <h1>Create Account</h1>
          <p className={styles.subText}>Already have an account? <Link href="/login">Sign in</Link></p>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="John Doe" required 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Age</label>
              <input type="number" placeholder="20" required 
                onChange={(e) => setFormData({...formData, age: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>DOB</label>
              <input type="date" required 
                onChange={(e) => setFormData({...formData, dob: e.target.value})} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" placeholder="example@gmail.com" required 
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className={styles.inputGroup}>
            <label>Create Password</label>
            <input type="password" placeholder="••••••••" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className={styles.signInBtn} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <div className={styles.graphicSection}>
          <div className={styles.shieldWrapper}>
             <div className={styles.lockIcon}>🛡️</div>
             <p style={{color: '#00d1ff', marginTop: '10px'}}>Secure Registration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
