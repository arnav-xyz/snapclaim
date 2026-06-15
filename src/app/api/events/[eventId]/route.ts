import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        photographerId: (session.user as any).id,
      },
      include: {
        photos: { orderBy: { uploadedAt: 'desc' } },
        _count: { select: { photos: true, scanSessions: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Event GET error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        photographerId: (session.user as any).id,
      },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const body = await req.json()
    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.status && { status: body.status }),
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Event PATCH error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        photographerId: (session.user as any).id,
      },
      include: { photos: true },
    })
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const { deleteFromCloudinary } = await import('@/lib/cloudinary')
    await Promise.allSettled(
      event.photos.map(p => deleteFromCloudinary(p.cloudinaryId))
    )

    await prisma.event.delete({ where: { id: eventId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event DELETE error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
