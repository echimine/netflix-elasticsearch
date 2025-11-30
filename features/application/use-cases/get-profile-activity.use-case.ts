import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export interface ActivityDataPoint {
  date: string;
  viewCount: number;
  totalDuration: number;
}

export class GetProfileActivityUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(
    profileName: string,
    timeframe: 'day' | 'week' | 'month' = 'day'
  ): Promise<ActivityDataPoint[]> {
    const historyItems = await this.netflixRepository.getHistoryByProfile(profileName);

    // Group by time period
    const activityMap = new Map<string, ActivityDataPoint>();

    historyItems.forEach((item) => {
      const date = new Date(item.date);
      let groupKey: string;

      switch (timeframe) {
        case 'day':
          groupKey = date.toISOString().split('T')[0] ?? '';
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          groupKey = weekStart.toISOString().split('T')[0] ?? '';
          break;
        case 'month':
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          groupKey = date.toISOString().split('T')[0] ?? '';
      }

      const existing = activityMap.get(groupKey);

      if (existing) {
        existing.viewCount += 1;
        existing.totalDuration += item.duration;
      } else {
        activityMap.set(groupKey, {
          date: groupKey,
          viewCount: 1,
          totalDuration: item.duration,
        });
      }
    });

    // Convert to array and sort by date
    return Array.from(activityMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
}
