import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export interface TopContentItem {
  title: string;
  type: string;
  viewCount: number;
  totalDuration: number;
  lastViewedDate: string;
}

export class GetProfileTopContentUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(profileName: string, limit: number = 10): Promise<TopContentItem[]> {
    const historyItems = await this.netflixRepository.getHistoryByProfile(profileName);

    // Group by title and count views
    const contentMap = new Map<string, TopContentItem>();

    historyItems.forEach((item) => {
      const existing = contentMap.get(item.title);

      if (existing) {
        existing.viewCount += 1;
        existing.totalDuration += item.duration;
        // Keep the most recent date
        if (new Date(item.date) > new Date(existing.lastViewedDate)) {
          existing.lastViewedDate = item.date;
        }
      } else {
        contentMap.set(item.title, {
          title: item.title,
          type: item.type,
          viewCount: 1,
          totalDuration: item.duration,
          lastViewedDate: item.date,
        });
      }
    });

    // Convert to array, sort by view count (desc), and limit
    return Array.from(contentMap.values())
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }
}
