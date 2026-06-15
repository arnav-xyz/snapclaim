import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ passcode: string }> }
) {
  try {
    const { passcode } = await params;
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || 'ALL'

    const event = await prisma.event.findFirst({
      where: {
        passcode: passcode.toUpperCase(),
        status: 'ACTIVE',
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const where: any = { eventId: event.id }
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
        },
      }),
      prisma.photo.count({ where }),
    ])

    return NextResponse.json({ photos, total, hasMore: page * limit < total, page })
  } catch (error) {
    console.error('Guest photos error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
