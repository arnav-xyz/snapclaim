import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const [total, indexed] = await Promise.all([
      prisma.photo.count({ where: { eventId: eventId } }),
      prisma.photo.count({ where: { eventId: eventId, facesIndexed: true } }),
    ])

    const percentage = total > 0 ? Math.round((indexed / total) * 100) : 100
    const status = total > 0 && indexed >= total ? 'LIVE' : 'PROCESSING'

    if (status === 'LIVE') {
      await prisma.event.update({
        where: { id: eventId },
        data: { status: 'ACTIVE' },
      })
    }

    return NextResponse.json({ total, indexed, percentage, status })
  } catch (error) {
    console.error('Status GET error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
