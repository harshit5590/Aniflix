"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.role !== 'admin') {
      router.push('/'); // Kick non-admins back to home
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return null; // Show nothing while checking

  return (
    <div className="admin-wrapper">
      {/* Navigation for Admin can go here */}
      {children}
    </div>
  );
}