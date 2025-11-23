'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetflixHistoryItem } from '@/lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatDuration } from '@/lib/formatters';

interface ViewingTimeChartProps {
  items: NetflixHistoryItem[];
}

export function ViewingTimeChart({ items }: ViewingTimeChartProps) {
  const chartData = items
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce(
      (acc, item) => {
        const date = new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
        const existing = acc.find((d) => d.date === date);
        if (existing) {
          existing.duration += item.duration / 3600;
        } else {
          acc.push({ date, duration: item.duration / 3600 });
        }
        return acc;
      },
      [] as { date: string; duration: number }[]
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viewing Time Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{
                value: 'Hours',
                angle: -90,
                position: 'insideLeft',
                style: { fill: 'hsl(var(--muted-foreground))' },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number) => [
                `${value.toFixed(1)} hours`,
                'Watch Time',
              ]}
            />
            <Area
              type="monotone"
              dataKey="duration"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorDuration)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
