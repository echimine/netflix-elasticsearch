import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export class GetAllHistoryUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(limit: number = 100) {
    return this.netflixRepository.getAllNetflixHistory(limit);
  }
}
