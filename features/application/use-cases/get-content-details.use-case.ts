import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export interface ContentDetails {
  title: string;
  type: string;
  totalViews: number;
  totalDuration: number;
  firstViewedDate: string;
  lastViewedDate: string;
  uniqueProfiles: string[];
  viewsByProfile: { profileName: string; viewCount: number; totalDuration: number }[];
  deviceTypes: string[];
  countries: string[];
}

export class GetContentDetailsUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(title: string): Promise<ContentDetails> {
    const historyItems = await this.netflixRepository.getHistoryByTitle(title);

    if (historyItems.length === 0) {
      throw new Error(`No viewing history found for title: ${title}`);
    }

    const type = historyItems[0]?.type ?? 'Unknown';
    const totalViews = historyItems.length;
    const totalDuration = historyItems.reduce((sum, item) => sum + item.duration, 0);

    // Find date range
    const dates = historyItems.map((item) => new Date(item.date).getTime());
    const firstViewedDate = new Date(Math.min(...dates)).toISOString();
    const lastViewedDate = new Date(Math.max(...dates)).toISOString();

    // Get unique profiles
    const uniqueProfiles = [...new Set(historyItems.map((item) => item.profileName))];

    // Group views by profile
    const profileMap = new Map<string, { viewCount: number; totalDuration: number }>();
    historyItems.forEach((item) => {
      const existing = profileMap.get(item.profileName);
      if (existing) {
        existing.viewCount += 1;
        existing.totalDuration += item.duration;
      } else {
        profileMap.set(item.profileName, { viewCount: 1, totalDuration: item.duration });
      }
    });

    const viewsByProfile = Array.from(profileMap.entries()).map(([profileName, data]) => ({
      profileName,
      viewCount: data.viewCount,
      totalDuration: data.totalDuration,
    }));

    // Get unique device types and countries
    const deviceTypes = [...new Set(historyItems.map((item) => item.deviceType))];
    const countries = [...new Set(historyItems.map((item) => item.country))];

    return {
      title,
      type,
      totalViews,
      totalDuration,
      firstViewedDate,
      lastViewedDate,
      uniqueProfiles,
      viewsByProfile,
      deviceTypes,
      countries,
    };
  }
}
