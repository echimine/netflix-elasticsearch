'use client';

import type { NetflixHistoryItem } from '@/lib/api';
import { getTotalWatchTime, formatDuration } from '@/lib/formatters';
import { StatisticsCard } from '@/components/dashboard/StatisticsCard';
import { ViewingTimeChart } from '@/components/dashboard/ViewingTimeChart';
import { TopContentCard } from '@/components/dashboard/TopContentCard';
import { Film, Clock, Tv, Monitor } from 'lucide-react';

interface DashboardProps {
  data: NetflixHistoryItem[];
}

export function Dashboard({ data }: DashboardProps) {
  const totalViews = data.length;
  const totalWatchTime = getTotalWatchTime(data);
  const uniqueTitles = new Set(data.map((item) => item.title)).size;
  const movieCount = data.filter((item) => item.type === 'Movie').length;
  const tvShowCount = data.filter((item) => item.type === 'TV Show').length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatisticsCard
          title="Total Views"
          value={totalViews}
          description="All viewing sessions"
          icon={Film}
        />
        <StatisticsCard
          title="Watch Time"
          value={formatDuration(totalWatchTime)}
          description="Total hours watched"
          icon={Clock}
        />
        <StatisticsCard
          title="Unique Titles"
          value={uniqueTitles}
          description="Different shows & movies"
          icon={Tv}
        />
        <StatisticsCard
          title="Movies vs TV Shows"
          value={`${movieCount} / ${tvShowCount}`}
          description="Content breakdown"
          icon={Monitor}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ViewingTimeChart items={data} />
        <TopContentCard items={data} />
      </div>
    </div>
  );
}
