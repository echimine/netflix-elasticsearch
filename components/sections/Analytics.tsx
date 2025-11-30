'use client';

import type { NetflixHistoryItem } from '@/lib/api';
import { DeviceDistributionChart } from '@/components/analytics/DeviceDistributionChart';
import { CountryBreakdownChart } from '@/components/analytics/CountryBreakdownChart';
import { ContentTypeChart } from '@/components/analytics/ContentTypeChart';
import { TimelineChart } from '@/components/analytics/TimelineChart';

interface AnalyticsProps {
  data: NetflixHistoryItem[];
}

export function Analytics({ data }: AnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ContentTypeChart items={data} />
        <DeviceDistributionChart items={data} />
      </div>
      <TimelineChart items={data} />
      <CountryBreakdownChart items={data} />
    </div>
  );
}
