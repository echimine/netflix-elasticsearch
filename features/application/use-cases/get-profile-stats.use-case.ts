import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export interface ProfileStats {
  profileName: string;
  totalViews: number;
  totalWatchTimeSeconds: number;
  uniqueTitles: number;
  movieCount: number;
  tvShowCount: number;
  firstViewDate: string;
  lastViewDate: string;
  topDeviceType: string;
  topCountry: string;
}

export class GetProfileStatsUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(profileName: string): Promise<ProfileStats> {
    const historyItems = await this.netflixRepository.getHistoryByProfile(profileName);

    if (historyItems.length === 0) {
      throw new Error(`No history found for profile: ${profileName}`);
    }

    // Calculate stats
    const uniqueTitles = new Set(historyItems.map((item) => item.title)).size;
    const totalWatchTimeSeconds = historyItems.reduce((sum, item) => sum + item.duration, 0);
    const movieCount = historyItems.filter((item) => item.type === 'Movie').length;
    const tvShowCount = historyItems.filter((item) => item.type === 'TV Show').length;

    // Find date range
    const dates = historyItems.map((item) => new Date(item.date).getTime());
    const firstViewDate = new Date(Math.min(...dates)).toISOString();
    const lastViewDate = new Date(Math.max(...dates)).toISOString();

    // Find most common device type
    const deviceCounts = new Map<string, number>();
    historyItems.forEach((item) => {
      deviceCounts.set(item.deviceType, (deviceCounts.get(item.deviceType) || 0) + 1);
    });
    const topDeviceType =
      Array.from(deviceCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unknown';

    // Find most common country
    const countryCounts = new Map<string, number>();
    historyItems.forEach((item) => {
      countryCounts.set(item.country, (countryCounts.get(item.country) || 0) + 1);
    });
    const topCountry = Array.from(countryCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unknown';

    return {
      profileName,
      totalViews: historyItems.length,
      totalWatchTimeSeconds,
      uniqueTitles,
      movieCount,
      tvShowCount,
      firstViewDate,
      lastViewDate,
      topDeviceType,
      topCountry,
    };
  }
}
