import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export interface EpisodeInfo {
  episodeTitle: string;
  season?: number | undefined;
  episode?: number | undefined;
  viewedDate: string;
  duration: number;
  profileName: string;
}

export interface SeasonInfo {
  seasonNumber: number;
  episodes: EpisodeInfo[];
}

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
  // For TV Shows
  seasons?: SeasonInfo[];
  allEpisodes?: EpisodeInfo[];
}

export class GetContentDetailsUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  private parseEpisodeInfo(title: string): { season?: number; episode?: number } {
    // Try to extract season and episode numbers from title
    // Patterns: "Season 1: Episode 2", "Saison 1 : Épisode 2", "S1E2", etc.
    const patterns = [
      /Season\s+(\d+).*Episode\s+(\d+)/i,
      /Saison\s+(\d+).*Épisode\s+(\d+)/i,
      /S(\d+)E(\d+)/i,
      /(\d+)x(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match && match[1] && match[2]) {
        return {
          season: parseInt(match[1]),
          episode: parseInt(match[2]),
        };
      }
    }

    // Try to extract just season number
    const seasonOnlyPatterns = [/Season\s+(\d+)/i, /Saison\s+(\d+)/i];
    for (const pattern of seasonOnlyPatterns) {
      const match = title.match(pattern);
      if (match && match[1]) {
        return { season: parseInt(match[1]) };
      }
    }

    return {};
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

    // Get unique profiles (filter out null/empty)
    const uniqueProfiles = [
      ...new Set(historyItems.map((item) => item.profileName).filter((p) => p && p.trim())),
    ];

    // Group views by profile
    const profileMap = new Map<string, { viewCount: number; totalDuration: number }>();
    historyItems.forEach((item) => {
      if (!item.profileName || !item.profileName.trim()) return;
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

    const result: ContentDetails = {
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

    // If it's a TV Show, parse episodes and seasons
    if (type === 'TV Show') {
      const allEpisodes: EpisodeInfo[] = historyItems.map((item) => {
        const { season, episode } = this.parseEpisodeInfo(item.title);
        return {
          episodeTitle: item.title,
          season,
          episode,
          viewedDate: item.date,
          duration: item.duration,
          profileName: item.profileName,
        };
      });

      // Group by season
      const seasonMap = new Map<number, EpisodeInfo[]>();
      allEpisodes.forEach((ep) => {
        const seasonNum = ep.season ?? 0; // 0 for unknown season
        if (!seasonMap.has(seasonNum)) {
          seasonMap.set(seasonNum, []);
        }
        seasonMap.get(seasonNum)!.push(ep);
      });

      const seasons: SeasonInfo[] = Array.from(seasonMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([seasonNumber, episodes]) => ({
          seasonNumber,
          episodes: episodes.sort((a, b) => {
            if (a.episode && b.episode) return a.episode - b.episode;
            return new Date(a.viewedDate).getTime() - new Date(b.viewedDate).getTime();
          }),
        }));

      result.seasons = seasons;
      result.allEpisodes = allEpisodes;
    }

    return result;
  }
}
