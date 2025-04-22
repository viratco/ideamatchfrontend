
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

interface GrowthData {
  month: string;
  users: number;
  revenue: number;
}

interface GrowthLineChartProps {
  className?: string;
  data?: GrowthData[];
  loading?: boolean;
}

const GrowthLineChart: React.FC<GrowthLineChartProps> = ({ className, data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className={className}>
      <ChartContainer
        config={{
          users: {
            label: 'User Growth',
            color: '#10B981'
          },
          revenue: {
            label: 'Revenue ($)',
            color: '#8B5CF6'
          }
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis 
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              width={60}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  formatter={(value) => [formatYAxis(Number(value)), null]}
                />
              }
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#8B5CF6" 
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default GrowthLineChart;