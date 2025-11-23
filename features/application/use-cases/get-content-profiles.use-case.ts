import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export interface ProfileView {
  profileName: string;
  viewCount: number;
  totalDuration: number;
  lastViewedDate: string;
}

export class GetContentProfilesUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(title: string): Promise<ProfileView[]> {
    const historyItems = await this.netflixRepository.getHistoryByTitle(title);

    // Group by profile
    const profileMap = new Map<string, ProfileView>();

    historyItems.forEach((item) => {
      const existing = profileMap.get(item.profileName);

      if (existing) {
        existing.viewCount += 1;
        existing.totalDuration += item.duration;
        // Keep the most recent date
        if (new Date(item.date) > new Date(existing.lastViewedDate)) {
          existing.lastViewedDate = item.date;
        }
      } else {
        profileMap.set(item.profileName, {
          profileName: item.profileName,
          viewCount: 1,
          totalDuration: item.duration,
          lastViewedDate: item.date,
        });
      }
    });

    // Convert to array and sort by view count
    return Array.from(profileMap.values()).sort((a, b) => b.viewCount - a.viewCount);
  }
}
