import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from '../components/AdminLogin';
import App from '../App';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes on auth state (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-electronic-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!session) {
    return <AdminLogin onLoginSuccess={() => {}} />;
  }

  // If authenticated, render the main App BUT with Admin Privileges
  return <App isAdmin={true} />;
}
