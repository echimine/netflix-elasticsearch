import { NextRequest, NextResponse } from 'next/server';
import { GetCatalogueUseCase } from '@/features/application/use-cases/get-catalogue.use-case';

import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix_repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || undefined;
    const yearParam = searchParams.get('year');
    const search = searchParams.get('search') || undefined;
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    // Validate year if provided
    if (yearParam && (isNaN(year!) || year! < 1900 || year! > 2100)) {
      return NextResponse.json({ error: 'Invalid year parameter' }, { status: 400 });
    }

    // Validate type if provided
    if (type && type !== 'Movie' && type !== 'TV Show') {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "Movie" or "TV Show"' },
        { status: 400 }
      );
    }

    const netflixRepository = new NetflixRepository();

    // Build filters object only with defined values
    const filters: { type?: string; year?: number; search?: string } = {};
    if (type) filters.type = type;
    if (year) filters.year = year;
    if (search) filters.search = search;

    // Return unique titles with aggregated data
    const getCatalogueUseCase = new GetCatalogueUseCase(netflixRepository);
    const catalogue = await getCatalogueUseCase.execute(filters);
    return NextResponse.json(catalogue);
  } catch (error) {
    console.error('Error in catalogue API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
