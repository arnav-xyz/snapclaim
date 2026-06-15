import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string; photoId: string }> }
) {
  try {
    const { eventId, photoId } = await params;
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

    const photo = await prisma.photo.findFirst({
      where: { id: photoId, eventId: eventId },
    })
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    await deleteFromCloudinary(photo.cloudinaryId)
    await prisma.photo.delete({ where: { id: photoId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Photo DELETE error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
