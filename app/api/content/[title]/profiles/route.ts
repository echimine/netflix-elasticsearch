import { NextRequest, NextResponse } from 'next/server';
import { GetContentProfilesUseCase } from '@/features/application/use-cases/get-content-profiles.use-case';
import { NetflixRepository } from '@/features/application/infrastructure/repositories/netflix.repository';

export async function GET(request: NextRequest, { params }: { params: Promise<{ title: string }> }) {
  try {
    const { title: titleParam } = await params;
    const title = decodeURIComponent(titleParam);

    const netflixRepository = new NetflixRepository();
    const getContentProfilesUseCase = new GetContentProfilesUseCase(netflixRepository);
    const profiles = await getContentProfilesUseCase.execute(title);

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error in content profiles API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
