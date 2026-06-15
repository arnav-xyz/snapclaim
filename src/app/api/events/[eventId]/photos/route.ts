import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || 'ALL'

    const where: any = { eventId: eventId }
    if (type === 'IMAGE') where.fileType = 'IMAGE'
    if (type === 'VIDEO') where.fileType = 'VIDEO'

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          url: true,
          thumbnailUrl: true,
          fileType: true,
          uploadedAt: true,
          cloudinaryId: true,
        },
      }),
      prisma.photo.count({ where }),
    ])

    return NextResponse.json({
      photos,
      total,
      hasMore: page * limit < total,
      page,
    })
  } catch (error) {
    console.error('Photos GET error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
