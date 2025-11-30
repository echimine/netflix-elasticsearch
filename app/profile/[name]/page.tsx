'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clock, Film, Tv, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { formatDuration } from '@/lib/formatters';

interface ProfileStats {
  totalMovies: number;
  totalSeries: number;
  totalDuration: number;
  topMovies: { title: string; count: number }[];
  topSeries: { title: string; count: number }[];
  activityOverTime: { date: string; count: number }[];
  activityByHour: { hour: number; count: number }[];
}

export default function ProfileDashboardPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const profileName = decodeURIComponent(name);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/profiles/${encodeURIComponent(profileName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Error loading stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profileName]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-2xl font-bold">Loading stats for {profileName}...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-red-500">{error || 'No stats found'}</div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="bg-secondary hover:bg-secondary/80 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-white">{profileName}'s Profile</h1>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
              <Clock className="text-primary h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</div>
              <p className="text-muted-foreground text-xs">Cumulative time spent watching</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Movies Watched</CardTitle>
              <Film className="text-chart-2 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMovies}</div>
              <p className="text-muted-foreground text-xs">Total films finished</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Series Watched</CardTitle>
              <Tv className="text-chart-3 h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSeries}</div>
              <p className="text-muted-foreground text-xs">Total episodes/seasons</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Viewing Activity Over Time</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.activityOverTime}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'white' }} />
                  <YAxis className="text-xs" tick={{ fill: 'white' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity by Time of Day</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.activityByHour}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="hour"
                    className="text-xs"
                    tick={{ fill: 'white' }}
                    tickFormatter={(val) => `${val}h`}
                  />
                  <YAxis className="text-xs" tick={{ fill: 'white' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                    itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                    labelFormatter={(val) => `${val}:00 - ${val + 1}:00`}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Content Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Movies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topMovies.map((movie, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-secondary text-secondary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{movie.title}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{movie.count} views</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top 5 Series</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topSeries.map((series, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-secondary text-secondary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{series.title}</span>
                    </div>
                    <span className="text-muted-foreground text-sm">{series.count} episodes</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
