import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { photoIds } = body

    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        { error: 'photoIds array is required' },
        { status: 400 }
      )
    }

    const photos = await prisma.photo.findMany({
      where: { id: { in: photoIds } },
      select: { id: true, url: true, cloudinaryId: true },
    })

    const files = photos.map((p, i) => ({
      url: p.url,
      filename: `snapclaim-photo-${i + 1}.jpg`,
    }))

    return NextResponse.json({ files })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
