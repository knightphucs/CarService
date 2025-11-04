import { Router, Response } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { ApiResponse, UploadResponse, MultipleUploadResponse } from '@shared/types';

dotenv.config();

const router = Router();

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME']!,
  api_key: process.env['CLOUDINARY_API_KEY']!,
  api_secret: process.env['CLOUDINARY_API_SECRET']!,
});

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req) => ({
    folder: (req.query['folder'] as string)
      ? `car_service/${req.query['folder']}`
      : 'car_service/products',
    allowed_formats: ALLOWED_FORMATS,
    public_id: `${Date.now()}`,
  }),
});

const upload = multer({ storage });

/** Upload 1 ảnh */
router.post(
  '/',
  upload.single('image'),
  async (req, res: Response<ApiResponse<UploadResponse>>) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded', data: { imageUrl: '' } });
    }

    // req.file được type sẵn luôn, không cần ép kiểu
    const imageUrl = req.file.path;

    return res.status(200).json({
      success: true,
      message: 'Upload successful',
      data: { imageUrl },
    });
  }
);

/** Upload nhiều ảnh */
router.post(
  '/multiple',
  upload.array('images', 5),
  async (req, res: Response<ApiResponse<MultipleUploadResponse>>) => {
    const files = Array.isArray(req.files)
      ? (req.files as (Express.Multer.File & { path: string })[])
      : [];

    if (!files || files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No files uploaded', data: { images: [] } });
    }

    // req.files cũng có type chính xác
    const images = files.map((f) => f.path);

    return res.status(200).json({
      success: true,
      message: 'Multiple upload successful',
      data: { images },
    });
  }
);

export default router;
