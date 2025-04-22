
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Q1', revenue: 50000, expenses: 40000 },
  { name: 'Q2', revenue: 90000, expenses: 60000 },
  { name: 'Q3', revenue: 170000, expenses: 90000 },
  { name: 'Q4', revenue: 230000, expenses: 110000 },
  { name: 'Q5', revenue: 350000, expenses: 150000 },
  { name: 'Q6', revenue: 500000, expenses: 180000 },
  { name: 'Q7', revenue: 800000, expenses: 250000 },
  { name: 'Q8', revenue: 1200000, expenses: 320000 },
  { name: 'Q9', revenue: 1800000, expenses: 450000 },
  { name: 'Q10', revenue: 2400000, expenses: 600000 },
  { name: 'Q11', revenue: 3500000, expenses: 850000 },
  { name: 'Q12', revenue: 5000000, expenses: 1200000 },
];

interface RevenueChartProps {
  className?: string;
}

const RevenueProjectionsChart: React.FC<RevenueChartProps> = ({ className }) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className={className}>
      <ChartContainer
        config={{
          revenue: {
            label: 'Revenue',
            color: '#8B5CF6'
          },
          expenses: {
            label: 'Expenses',
            color: '#94A3B8'
          }
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              width={80}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value) => [formatYAxis(Number(value)), null]}
                />
              }
            />
            <Legend />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={30} />
            <Bar dataKey="expenses" radius={[4, 4, 0, 0]} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default RevenueProjectionsChart;