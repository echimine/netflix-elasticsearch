import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export interface CatalogueItem {
  title: string;
  type: string;
  firstViewedDate: string;
  totalViews: number;
  totalDuration: number;
}

export class GetCatalogueUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(filters: {
    type?: string;
    year?: number;
    search?: string;
  }): Promise<CatalogueItem[]> {
    // Get all matching history items
    const historyItems = await this.netflixRepository.getHistoryByFilters(filters, 10000);

    // Group by title and aggregate data
    const catalogueMap = new Map<string, CatalogueItem>();

    historyItems.forEach((item) => {
      const existing = catalogueMap.get(item.title);

      if (existing) {
        existing.totalViews += 1;
        existing.totalDuration += item.duration;
        // Keep the earliest date
        if (new Date(item.date) < new Date(existing.firstViewedDate)) {
          existing.firstViewedDate = item.date;
        }
      } else {
        catalogueMap.set(item.title, {
          title: item.title,
          type: item.type,
          firstViewedDate: item.date,
          totalViews: 1,
          totalDuration: item.duration,
        });
      }
    });

    // Convert map to array and sort by first viewed date (most recent first)
    return Array.from(catalogueMap.values()).sort(
      (a, b) => new Date(b.firstViewedDate).getTime() - new Date(a.firstViewedDate).getTime()
    );
  }
}
