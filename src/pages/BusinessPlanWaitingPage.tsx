import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'sonner';

const BusinessPlanWaitingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { idea } = location.state || {};
  const [error, setError] = useState('');

  useEffect(() => {
    if (!idea) {
      setError('No idea data provided.');
      return;
    }
    const generatePlan = async () => {
      try {
        // Always use the latest Supabase JWT for backend requests
        const { data: { session } } = await import('../supabaseClient').then(mod => mod.supabase.auth.getSession());
        const accessToken = session?.access_token;
        const res = await fetch('/api/business-plan/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
          },
          body: JSON.stringify({ title: idea.title, ideaFitness: idea.ideaFitness })
        });
        if (res.status === 401) {
          toast.error('Session expired or unauthorized. Please sign in again.');
          navigate('/sign-in');
          return;
        }
        const result = await res.json();
        if (res.ok && result.status === 'success') {
          navigate('/business-plan', { state: { plan: result, idea } });
        } else {
          setError(result.message || 'Failed to generate business plan.');
        }
      } catch (e) {
        setError('Network/server error.');
      }
    };
    generatePlan();
    // eslint-disable-next-line
  }, []);

  if (error) {
    toast.error(error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button className="btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingSpinner />
      <p className="mt-4 text-lg">Your business plan is being generated. This may take up to 5 minutes...</p>
    </div>
  );
};

export default BusinessPlanWaitingPage;
