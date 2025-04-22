
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ZAxis, Tooltip } from 'recharts';
import { CheckCircle2, Circle } from 'lucide-react';

// Each milestone has x (timeline position), y (track position), z (importance 1-10), and status
const milestoneData = [
  { name: 'MVP Launch', x: 1, y: 1, z: 8, status: 'completed', description: 'Initial product release with core features' },
  { name: 'Seed Funding', x: 2, y: 3, z: 10, status: 'completed', description: '$500K raised for initial development' },
  { name: '1,000 Users', x: 3, y: 1, z: 7, status: 'completed', description: 'First major user milestone reached' },
  { name: 'Enterprise Features', x: 4, y: 2, z: 9, status: 'in-progress', description: 'Advanced security and team collaboration' },
  { name: 'Series A', x: 5, y: 3, z: 10, status: 'planned', description: 'Target $2.5M for scaling operations' },
  { name: '10,000 Users', x: 6, y: 1, z: 8, status: 'planned', description: 'Growth milestone with stable revenue' },
  { name: 'International Launch', x: 7, y: 2, z: 9, status: 'planned', description: 'Expansion to EU and Asia markets' },
  { name: 'Acquisition Channels', x: 8, y: 4, z: 7, status: 'planned', description: 'Implement partnership program' },
  { name: 'Series B', x: 9, y: 3, z: 10, status: 'planned', description: 'Target $10M for rapid expansion' },
  { name: '100,000 Users', x: 10, y: 1, z: 9, status: 'planned', description: 'Major scale milestone' },
  { name: 'AI Features V2', x: 11, y: 2, z: 8, status: 'planned', description: 'Advanced AI-driven analytics' },
  { name: 'IPO Prep', x: 12, y: 3, z: 10, status: 'planned', description: 'Prepare for public offering' },
];

// Mapping for y-axis labels
const tracks = {
  1: 'Product',
  2: 'Technology',
  3: 'Funding',
  4: 'Marketing'
};

interface RoadmapTimelineChartProps {
  className?: string;
}

const RoadmapTimelineChart: React.FC<RoadmapTimelineChartProps> = ({ className }) => {
  const formatYAxis = (value: number) => {
    return tracks[value as keyof typeof tracks] || '';
  };

  const formatXAxis = (value: number) => {
    // Convert numeric quarter to Q# format
    return `Q${value}`;
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
              {formatYAxis(data.y)}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
              {formatXAxis(data.x)}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              data.status === 'completed' ? 'bg-green-100 text-green-800' : 
              data.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      <ChartContainer
        config={{
          completed: {
            label: 'Completed',
            color: '#10B981'
          },
          inProgress: {
            label: 'In Progress',
            color: '#3B82F6'
          },
          planned: {
            label: 'Planned',
            color: '#94A3B8'
          }
        }}
      >
        <ResponsiveContainer width="100%" height={360}>
          <ScatterChart margin={{ top: 40, right: 40, left: 80, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              type="number"
              dataKey="x"
              name="Quarter"
              tickFormatter={formatXAxis}
              domain={[0, 13]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis 
              type="number"
              dataKey="y"
              name="Track"
              tickFormatter={formatYAxis}
              domain={[0, 5]}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              padding={{ top: 20, bottom: 20 }}
            />
            <ZAxis 
              type="number"
              dataKey="z"
              range={[40, 80]}
              domain={[0, 10]}
            />
            <Tooltip content={customTooltip} />
            
            {/* Completed milestones */}
            <Scatter 
              name="Completed" 
              data={milestoneData.filter(m => m.status === 'completed')} 
              fill="#10B981"
              shape={(props) => {
                const { cx, cy } = props;
                return <CheckCircle2 x={cx - 10} y={cy - 10} className="h-5 w-5 text-green-500" />;
              }}
            />
            
            {/* In-progress milestones */}
            <Scatter 
              name="In Progress" 
              data={milestoneData.filter(m => m.status === 'in-progress')} 
              fill="#3B82F6"
              shape={(props) => {
                const { cx, cy } = props;
                return <Circle x={cx - 10} y={cy - 10} className="h-5 w-5 text-blue-500 fill-blue-100" />;
              }}
            />
            
            {/* Planned milestones */}
            <Scatter 
              name="Planned" 
              data={milestoneData.filter(m => m.status === 'planned')} 
              fill="#94A3B8"
              shape={(props) => {
                const { cx, cy } = props;
                return <Circle x={cx - 10} y={cy - 10} className="h-5 w-5 text-gray-400" />;
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartContainer>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="text-sm">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 text-blue-500 fill-blue-100" />
          <span className="text-sm">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <Circle className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Planned</span>
        </div>
      </div>
    </div>
  );
};

export default RoadmapTimelineChart;