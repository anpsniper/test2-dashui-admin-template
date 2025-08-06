// app/page.js
'use client'; // This is a client component as it uses hooks and router

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/AuthOy'; // Adjust path based on your actual structure

export default function HomePage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only proceed with redirection once the authentication state has finished loading
    if (!loading) {
      if (isAuthenticated) {
        // If authenticated, redirect based on user role
        if (user?.role === 'admin') {
          router.push('/dashboard'); // Admins go to the manage users page
        } else {
          router.push('/dashboard'); // Other authenticated users go to their profile page
        }
      } else {
        // If not authenticated, redirect to the login page
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, user, router]); // Dependencies for the effect

  // Render a loading state while authentication is being checked and redirection occurs
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="d-flex align-items-center text-secondary">
        <div className="spinner-border text-primary me-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        Redirecting...
      </div>
    </div>
  );
}
