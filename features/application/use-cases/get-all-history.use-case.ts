import { NetflixRepository } from '../infrastructure/repositories/netflix.repository';

export class GetAllHistoryUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute() {
    return this.netflixRepository.getAllNetflixHistory();
  }
}
