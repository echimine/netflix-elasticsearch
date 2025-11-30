import { NextResponse } from 'next/server';
import { GetAllProfilesUseCase } from '@/features/application/use-cases/get-all-profiles.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET() {
  try {
    const netflixRepository = new NetflixRepository();
    const getAllProfilesUseCase = new GetAllProfilesUseCase(netflixRepository);
    const profiles = await getAllProfilesUseCase.execute();

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error in profiles API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
