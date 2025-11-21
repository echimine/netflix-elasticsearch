import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export class GetHistoryByTypeUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(type: string) {
    return this.netflixRepository.getHistoryByType(type);
  }
}
