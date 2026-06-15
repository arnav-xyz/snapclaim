import {
  RekognitionClient,
  CreateCollectionCommand,
  IndexFacesCommand,
  SearchFacesByImageCommand,
} from '@aws-sdk/client-rekognition'
import prisma from './prisma'

const client = new RekognitionClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const PREFIX = process.env.AWS_REKOGNITION_COLLECTION_PREFIX || 'snapclaim'

export function getCollectionId(eventId: string) {
  return `${PREFIX}-${eventId}`
}

export async function createCollectionIfNotExists(eventId: string) {
  const collectionId = getCollectionId(eventId)
  try {
    await client.send(new CreateCollectionCommand({ CollectionId: collectionId }))
  } catch (err: unknown) {
    if (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name !== 'ResourceAlreadyExistsException') throw err
  }
  return collectionId
}

export async function indexFacesForPhoto(
  photoId: string,
  eventId: string,
  imageUrl: string
) {
  try {
    const collectionId = await createCollectionIfNotExists(eventId)
    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const imageBytes = new Uint8Array(arrayBuffer)

    const command = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: { Bytes: imageBytes },
      ExternalImageId: photoId,
      MaxFaces: 10,
      DetectionAttributes: [],
    })

    const result = await client.send(command)

    if (result.FaceRecords && result.FaceRecords.length > 0) {
      await Promise.all(
        result.FaceRecords.map((record) =>
          prisma.faceIndex.create({
            data: {
              photoId,
              eventId,
              rekognitionFaceId: record.Face!.FaceId!,
              boundingBox: record.Face!.BoundingBox as any,
              confidence: record.Face!.Confidence!,
            },
          })
        )
      )
    }

    await prisma.photo.update({
      where: { id: photoId },
      data: { facesIndexed: true },
    })

    return result.FaceRecords?.length || 0
  } catch (error) {
    console.error('Face indexing error for photo', photoId, error)
    return 0
  }
}

export async function searchFacesByImage(
  eventId: string,
  imageBuffer: Buffer
): Promise<string[]> {
  const collectionId = getCollectionId(eventId)
  try {
    const command = new SearchFacesByImageCommand({
      CollectionId: collectionId,
      Image: { Bytes: new Uint8Array(imageBuffer) },
      FaceMatchThreshold: 80,
      MaxFaces: 100,
    })

    const result = await client.send(command)

    if (!result.FaceMatches || result.FaceMatches.length === 0) {
      return []
    }

    const photoIds = [
      ...new Set(
        result.FaceMatches
          .filter(m => m.Similarity! >= 80)
          .map(m => m.Face!.ExternalImageId!)
          .filter(Boolean)
      )
    ]

    return photoIds
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'name' in error && (error as { name: string }).name === 'ResourceNotFoundException') return []
    throw error
  }
}
