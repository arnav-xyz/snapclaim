import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const photographerId = (session.user as any).id

    const [totalEvents, totalPhotos, totalScans] = await Promise.all([
      prisma.event.count({ where: { photographerId } }),
      prisma.photo.count({ where: { event: { photographerId } } }),
      prisma.scanSession.count({ where: { event: { photographerId } } }),
    ])

    return NextResponse.json({ totalEvents, totalPhotos, totalScans })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
