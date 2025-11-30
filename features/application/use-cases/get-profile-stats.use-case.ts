import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export interface ProfileStats {
  totalMovies: number;
  totalSeries: number;
  totalDuration: number;
  topMovies: { title: string; count: number }[];
  topSeries: { title: string; count: number }[];
  activityOverTime: { date: string; count: number }[];
  activityByHour: { hour: number; count: number }[];
}

export class GetProfileStatsUseCase {
  constructor(private netflixRepository: NetflixRepository) {}

  async execute(profileName: string): Promise<ProfileStats> {
    const aggs = await this.netflixRepository.getProfileStats(profileName);

    // Parse aggregations
    const byTypeBuckets = aggs.by_type.buckets;
    const movieCount = byTypeBuckets.find((b: any) => b.key === 'Movie')?.doc_count || 0;
    const seriesCount = byTypeBuckets.find((b: any) => b.key === 'TV Show')?.doc_count || 0;

    const totalDuration = aggs.total_duration.value;

    const topMovies = aggs.top_movies.titles.buckets.map((b: any) => ({
      title: b.key,
      count: b.doc_count,
    }));

    const topSeries = aggs.top_series.titles.buckets.map((b: any) => ({
      title: b.key,
      count: b.doc_count,
    }));

    const activityOverTime = aggs.activity_over_time.buckets.map((b: any) => ({
      date: b.key_as_string,
      count: b.doc_count,
    }));

    const activityByHour = aggs.activity_by_hour.buckets.map((b: any) => ({
      hour: parseInt(b.key),
      count: b.doc_count,
    }));

    return {
      totalMovies: movieCount,
      totalSeries: seriesCount,
      totalDuration,
      topMovies,
      topSeries,
      activityOverTime,
      activityByHour,
    };
  }
}
