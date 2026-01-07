// frontend/src/components/AdminGuard.js
"use client";
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }) {
  const router = useRouter();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, []);

  return <>{children}</>;
}