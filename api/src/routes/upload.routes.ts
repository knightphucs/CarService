import { Router, Response, Request } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import db from '../config/db';
import { ApiResponse, UploadResponse, MultipleUploadResponse } from '@shared/dto';
import { Image } from '../models/image.model';

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

/** Upload 1 ảnh và lưu vào DB */
router.post(
  '/',
  upload.single('image'),
  async (req: Request, res: Response<ApiResponse<UploadResponse>>) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
          data: { imageUrl: '' },
        });
      }

      const imageUrl = req.file.path;
      const altText = req.body.alt_text || req.file.originalname;
      const imageType = (req.body.image_type as 'Product' | 'Color' | 'Brand') || 'Product';

      // Lưu vào bảng image
      const savedImage = await Image.create({
        file_url: imageUrl,
        alt_text: altText,
        image_type: imageType,
      });

      return res.status(200).json({
        success: true,
        message: 'Upload successful',
        data: { imageUrl },
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error uploading image',
        data: { imageUrl: '' },
      });
    }
  }
);

/** Upload nhiều ảnh và lưu vào DB */
router.post(
  '/multiple',
  upload.array('images', 5),
  async (req: Request, res: Response<ApiResponse<MultipleUploadResponse>>) => {
    try {
      const files = Array.isArray(req.files)
        ? (req.files as (Express.Multer.File & { path: string })[])
        : [];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
          data: { images: [] },
        });
      }

      const imageType = (req.body.image_type as 'Product' | 'Color' | 'Brand') || 'Product';

      const createdImages = await Promise.all(
        files.map((f) =>
          Image.create({
            file_url: f.path,
            alt_text: f.originalname,
            image_type: imageType,
          })
        )
      );

      const images = files.map((f) => f.path);

      return res.status(200).json({
        success: true,
        message: 'Multiple upload successful',
        data: { images },
      });
    } catch (error) {
      console.error('Multiple upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error uploading multiple images',
        data: { images: [] },
      });
    }
  }
);

export default router;
