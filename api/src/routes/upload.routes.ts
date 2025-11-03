import { Router, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { SingleUploadRequest, MultipleUploadRequest } from '../types/express';
import { ApiResponse, UploadResponse, MultipleUploadResponse } from '@shared';

dotenv.config();

const router = Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req) => ({
    folder: (req.query.folder as string)
      ? `car_service/${req.query.folder}`
      : 'car_service/products',
    allowed_formats: ALLOWED_FORMATS,
    public_id: `${Date.now()}`,
  }),
});

const upload = multer({ storage });

// ✅ Upload 1 ảnh
router.post(
  '/',
  upload.single('image'),
  async (req: SingleUploadRequest, res: Response<ApiResponse<UploadResponse>>) => {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded', data: { imageUrl: '' } });

    const imageUrl = (req.file as any).path;

    res.status(200).json({
      success: true,
      message: 'Upload successful',
      data: { imageUrl },
    });
  }
);

// ✅ Upload nhiều ảnh
router.post(
  '/multiple',
  upload.array('images', 5),
  async (req: MultipleUploadRequest, res: Response<ApiResponse<MultipleUploadResponse>>) => {
    if (!req.files || req.files.length === 0)
      return res
        .status(400)
        .json({ success: false, message: 'No files uploaded', data: { images: [] } });

    const images = (req.files as any[]).map((f) => f.path);

    res.status(200).json({
      success: true,
      message: 'Multiple upload successful',
      data: { images },
    });
  }
);

export default router;
