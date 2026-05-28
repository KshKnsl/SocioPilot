import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadBuffer(buffer, filename, folder = 'socio-pilot') {
  const dataUri = `data:image/png;base64,${buffer.toString('base64')}`;
  const publicId = filename.replace(/\.[^/.]+$/, '');
  const res = await cloudinary.uploader.upload(dataUri, {
    public_id: publicId,
    folder,
    overwrite: true,
    resource_type: 'image',
  });
  return res;
}
