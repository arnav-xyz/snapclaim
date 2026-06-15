import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  studioName: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const photographer = await prisma.photographer.findUnique({
      where: { id: (session.user as any).id },
      select: {
        id: true, name: true, email: true,
        studioName: true, city: true, phone: true,
      },
    })

    return NextResponse.json(photographer)
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = profileSchema.parse(body)

    const updated = await prisma.photographer.update({
      where: { id: (session.user as any).id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.studioName !== undefined && { studioName: data.studioName }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.phone !== undefined && { phone: data.phone }),
      },
      select: {
        id: true, name: true, email: true,
        studioName: true, city: true, phone: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodErr = error as any;
      return NextResponse.json({ error: zodErr.errors[0].message }, { status: 400 })
    }
    console.error('Profile PATCH error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
