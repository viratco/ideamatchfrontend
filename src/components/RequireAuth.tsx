import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { isAuthenticated } from "@/utils/jwt";

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null; // or a spinner

  if (!session) {
    // Not authenticated, redirect to sign-in
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
