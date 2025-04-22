
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface MarketShareData {
  name: string;
  value: number;
}

const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#94A3B8'];

interface MarketShareDonutChartProps {
  className?: string;
  data: MarketShareData[];
  loading?: boolean;
}

const MarketShareDonutChart: React.FC<MarketShareDonutChartProps> = ({ className, data, loading = false }) => {
  if (loading) {
    return <div className="flex items-center justify-center h-[400px]">Loading market share data...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-[400px]">No market share data available</div>;
  }
  return (
    <div className={className}>
      <ChartContainer
        config={{
          ourSolution: {
            label: 'Our Solution',
            color: COLORS[0]
          },
          competitorA: {
            label: 'Competitor A',
            color: COLORS[1]
          },
          competitorB: {
            label: 'Competitor B',
            color: COLORS[2]
          },
          competitorC: {
            label: 'Competitor C',
            color: COLORS[3]
          },
          others: {
            label: 'Others',
            color: COLORS[4]
          }
        }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <PieChart margin={{ top: 40, right: 40, left: 40, bottom: 40 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value) => [`${value}%`, null]}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MarketShareDonutChart;