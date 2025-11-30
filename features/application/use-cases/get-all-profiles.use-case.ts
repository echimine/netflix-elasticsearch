import { NetflixRepository } from '../infrastructure/repositories/netflix_repository';

export class GetAllProfilesUseCase {
  private netflixRepository: NetflixRepository;

  constructor(netflixRepository: NetflixRepository) {
    this.netflixRepository = netflixRepository;
  }

  async execute(): Promise<string[]> {
    return this.netflixRepository.getProfiles();
  }
}
