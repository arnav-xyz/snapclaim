import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ passcode: string }> }
) {
  try {
    const { passcode } = await params;
    const event = await prisma.event.findFirst({
      where: {
        passcode: passcode.toUpperCase(),
        status: 'ACTIVE',
      },
      include: {
        photographer: {
          select: { name: true, studioName: true },
        },
        _count: { select: { photos: true } },
      },
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Invalid event code' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: event.id,
      name: event.name,
      eventType: event.eventType,
      eventDate: event.eventDate,
      description: event.description,
      passcode: event.passcode,
      photographer: event.photographer,
      totalPhotos: event._count.photos,
    })
  } catch (error) {
    console.error('Passcode lookup error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
