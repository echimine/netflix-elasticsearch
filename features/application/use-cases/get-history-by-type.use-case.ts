import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export class GetHistoryByTypeUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(type: string, limit: number = 100) {
    return this.netflixRepository.getHistoryByType(type, limit);
  }
}
