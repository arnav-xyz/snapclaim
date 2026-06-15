const fs = require('fs');

const routeContents = {
  'src/app/api/events/by-passcode/[passcode]/route.ts': import { NextResponse } from 'next/server'
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
},

  'src/app/api/events/by-passcode/[passcode]/photos/route.ts': import { NextResponse } from 'next/server'
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
},

  'src/app/api/events/[eventId]/route.ts': import { NextResponse } from 'next/server'
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
},

  'src/app/api/events/[eventId]/photos/route.ts': import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') || 'ALL'

    const where: any = { eventId: eventId }
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
          uploadedAt: true,
          cloudinaryId: true,
        },
      }),
      prisma.photo.count({ where }),
    ])

    return NextResponse.json({
      photos,
      total,
      hasMore: page * limit < total,
      page,
    })
  } catch (error) {
    console.error('Photos GET error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
},

  'src/app/api/events/[eventId]/photos/[photoId]/route.ts': import { NextResponse } from 'next/server'
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
},

  'src/app/api/events/[eventId]/status/route.ts': import { NextResponse } from 'next/server'
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
},

  'src/app/api/events/[eventId]/upload/route.ts': import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { indexFacesForPhoto } from '@/lib/rekognition'

export async function POST(
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

    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const uploadedPhotos = []

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const isVideo = file.type.startsWith('video/')
      const resourceType = isVideo ? 'video' : 'image'

      const result = await uploadToCloudinary(
        buffer,
        eventId,
        resourceType as 'image' | 'video'
      )

      const photo = await prisma.photo.create({
        data: {
          eventId: eventId,
          cloudinaryId: result.publicId,
          url: result.url,
          thumbnailUrl: result.thumbnailUrl,
          fileType: isVideo ? 'VIDEO' : 'IMAGE',
          fileSizeBytes: file.size,
        },
      })

      uploadedPhotos.push(photo)

      if (!isVideo) {
        indexFacesForPhoto(photo.id, eventId, result.url)
          .catch(err => console.error('Face indexing failed:', err))
      }
    }

    return NextResponse.json({
      uploaded: uploadedPhotos.length,
      photos: uploadedPhotos,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
};

for (const [filePath, content] of Object.entries(routeContents)) {
  fs.writeFileSync(filePath, content);
  console.log('Fixed', filePath);
}
