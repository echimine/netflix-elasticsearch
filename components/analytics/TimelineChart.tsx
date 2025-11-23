'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { NetflixHistoryItem } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TimelineChartProps {
  items: NetflixHistoryItem[];
}

export function TimelineChart({ items }: TimelineChartProps) {
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
          existing.views += 1;
          if (item.type === 'Movie') {
            existing.movies += 1;
          } else {
            existing.tvShows += 1;
          }
        } else {
          acc.push({
            date,
            views: 1,
            movies: item.type === 'Movie' ? 1 : 0,
            tvShows: item.type === 'TV Show' ? 1 : 0,
          });
        }
        return acc;
      },
      [] as { date: string; views: number; movies: number; tvShows: number }[]
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viewing Activity Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Total Views"
            />
            <Line
              type="monotone"
              dataKey="movies"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              name="Movies"
            />
            <Line
              type="monotone"
              dataKey="tvShows"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              name="TV Shows"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
