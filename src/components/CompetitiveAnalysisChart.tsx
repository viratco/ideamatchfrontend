
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

interface ComparisonData {
  aspect: string;
  us: number;
  competitorA: number;
  competitorB: number;
  competitorC: number;
}

interface CompetitiveAnalysisChartProps {
  className?: string;
  data?: ComparisonData[];
  loading?: boolean;
}

const CompetitiveAnalysisChart: React.FC<CompetitiveAnalysisChartProps> = ({ className, data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return null;
  }
  return (
    <div className={className}>
      <ChartContainer
        config={{
          us: {
            label: 'Our Solution',
            color: '#8B5CF6'
          },
          competitorA: {
            label: 'Competitor A',
            color: '#EC4899'
          },
          competitorB: {
            label: 'Competitor B',
            color: '#F59E0B'
          },
          competitorC: {
            label: 'Competitor C',
            color: '#10B981'
          }
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis 
              dataKey="aspect" 
              tick={{ fill: '#64748B', fontSize: 12 }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 12 }}
              tickCount={5}
              stroke="#E2E8F0"
            />
            
            <Radar name="Our Solution" dataKey="us" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.5} />
            <Radar name="Competitor A" dataKey="competitorA" stroke="#EC4899" fill="#EC4899" fillOpacity={0.3} />
            <Radar name="Competitor B" dataKey="competitorB" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
            <Radar name="Competitor C" dataKey="competitorC" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            <ChartTooltip 
              content={
                <ChartTooltipContent 
                  formatter={(value) => [`${value}/100`, null]}
                />
              }
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default CompetitiveAnalysisChart;