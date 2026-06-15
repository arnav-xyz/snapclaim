import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { searchFacesByImage } from '@/lib/rekognition'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { selfieBase64, eventId } = body

    if (!selfieBase64 || !eventId) {
      return NextResponse.json(
        { error: 'selfieBase64 and eventId are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.findFirst({
      where: { id: eventId, status: 'ACTIVE' },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const buffer = Buffer.from(
      selfieBase64.replace(/^data:image\/\w+;base64,/, ''),
      'base64'
    )

    let photoIds: string[]
    try {
      photoIds = await searchFacesByImage(eventId, buffer)
    } catch (error: unknown) {
      if ((error as any).name === 'InvalidParameterException') {
        return NextResponse.json(
          { error: 'NO_FACE_DETECTED', matchCount: 0, photos: [] },
          { status: 200 }
        )
      }
      throw error
    }

    if (photoIds.length === 0) {
      return NextResponse.json({
        matchCount: 0,
        photos: [],
        sessionId: null,
      })
    }

    const photos = await prisma.photo.findMany({
      where: { id: { in: photoIds } },
      select: {
        id: true,
        url: true,
        thumbnailUrl: true,
        fileType: true,
      },
    })

    const session = await prisma.scanSession.create({
      data: {
        eventId,
        matchedPhotoIds: photoIds,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      matchCount: photos.length,
      photos,
    })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'SCAN_FAILED' },
      { status: 500 }
    )
  }
}
