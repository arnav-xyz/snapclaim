import { NextResponse } from 'next/server'
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
