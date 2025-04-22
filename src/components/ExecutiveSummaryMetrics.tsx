
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, DollarSign, Clock, Target, Award } from 'lucide-react';
interface BusinessMetrics {
  annualRevenuePotential: string;
  marketSize: string;
  projectedUsers: string;
  timeToBreakeven: string;
  initialInvestment: string;
  competitiveEdge: string;
}

interface Props {
  ideaTitle: string;
  ideaFitness: string;
}

const fetchBusinessMetrics = async (ideaTitle: string, ideaFitness: string): Promise<BusinessMetrics> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/business-plan/metrics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: ideaTitle, ideaFitness })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error:', errorText);
      throw new Error(`Failed to fetch metrics: ${response.status} ${response.statusText}`);

    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
};

const ExecutiveSummaryMetrics: React.FC<Props> = ({ ideaTitle, ideaFitness }) => {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      if (!ideaTitle || !ideaFitness) return;
      
      try {
        setLoading(true);
        const data = await fetchBusinessMetrics(ideaTitle, ideaFitness);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load metrics');
        console.error('Error loading metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [ideaTitle, ideaFitness]);

  if (loading) {
    return <div className="text-center py-8">Loading metrics...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex items-start p-4">
          <div className="bg-primary/10 p-2 rounded-lg mr-4">
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Annual Revenue Potential</p>
            <h3 className="text-2xl font-bold">{metrics?.annualRevenuePotential || 'N/A'}</h3>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> 
              <span>32% CAGR</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex items-start p-4">
          <div className="bg-orange-500/10 p-2 rounded-lg mr-4">
            <Target className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Market Size</p>
            <h3 className="text-2xl font-bold">{metrics?.marketSize || 'N/A'}</h3>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> 
              <span>15% YoY Growth</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex items-start p-4">
          <div className="bg-green-500/10 p-2 rounded-lg mr-4">
            <Users className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Projected Users</p>
            <h3 className="text-2xl font-bold">{metrics?.projectedUsers || 'N/A'}</h3>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> 
              <span>42% Conversion Rate</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex items-start p-4">
          <div className="bg-blue-500/10 p-2 rounded-lg mr-4">
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Time to Breakeven</p>
            <h3 className="text-2xl font-bold">{metrics?.timeToBreakeven || 'N/A'}</h3>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <span>Positive Cash Flow Q6</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-pink-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex items-start p-4">
          <div className="bg-pink-500/10 p-2 rounded-lg mr-4">
            <DollarSign className="w-8 h-8 text-pink-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Initial Investment</p>
            <h3 className="text-2xl font-bold">{metrics?.initialInvestment || 'N/A'}</h3>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <span>Seed Round + Angels</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="flex items-start p-4">
          <div className="bg-amber-500/10 p-2 rounded-lg mr-4">
            <Award className="w-8 h-8 text-amber-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Competitive Edge</p>
            <h3 className="text-2xl font-bold">{metrics?.competitiveEdge || 'N/A'}</h3>
            <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
              <span>Proprietary Technology</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummaryMetrics;