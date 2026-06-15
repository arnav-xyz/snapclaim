import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' = 'image'
): Promise<{ publicId: string; url: string; thumbnailUrl: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `snapclaim/${folder}`,
        resource_type: resourceType,
        transformation: resourceType === 'image'
          ? [{ quality: 'auto', fetch_format: 'auto' }]
          : undefined,
      },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          thumbnailUrl: resourceType === 'video'
            ? cloudinary.url(result.public_id, {
                resource_type: 'video',
                format: 'jpg',
                transformation: [{ width: 400, crop: 'fill' }]
              })
            : cloudinary.url(result.public_id, {
                transformation: [
                  { width: 400, crop: 'fill', quality: 'auto' }
                ]
              }),
        })
      }
    ).end(buffer)
  })
}

export async function deleteFromCloudinary(publicId: string) {
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary
