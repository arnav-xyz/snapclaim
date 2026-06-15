import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { createCollectionIfNotExists } from '@/lib/rekognition'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const events = await prisma.event.findMany({
      where: { photographerId: (session.user as any).id },
      include: {
        _count: { select: { photos: true, scanSessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Events GET error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  eventType: z.string().min(1),
  eventDate: z.string(),
  passcode: z.string().min(4).max(8).transform(v => v.toUpperCase()),
  description: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = createEventSchema.parse(body)

    // Check passcode uniqueness
    const existing = await prisma.event.findUnique({
      where: { passcode: data.passcode },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'This passcode is already taken. Try another.' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        photographerId: (session.user as any).id,
        name: data.name,
        eventType: data.eventType,
        eventDate: new Date(data.eventDate),
        passcode: data.passcode,
        description: data.description || null,
      },
    })

    // Create AWS Rekognition collection for this event
    try {
      await createCollectionIfNotExists(event.id)
    } catch (err) {
      console.error('Failed to create Rekognition collection:', err)
    }

    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      const zodErr = err as any;
      return NextResponse.json(
        { error: zodErr.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Events POST error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
