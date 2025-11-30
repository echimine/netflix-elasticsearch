import { NextResponse } from 'next/server';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET() {
  try {
    const netflixRepository = new NetflixRepository();
    const years = await netflixRepository.getAvailableYears();

    return NextResponse.json({ years });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
