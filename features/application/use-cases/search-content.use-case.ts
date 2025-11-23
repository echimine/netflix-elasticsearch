import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export class SearchContentUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(filters: { type?: string; year?: number; search?: string }, limit: number = 100) {
    return this.netflixRepository.getHistoryByFilters(filters, limit);
  }
}
