import 'express';
import { CloudinaryUploadedFile } from '@shared/types/upload.type';

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File & CloudinaryUploadedFile;
    files?: (Express.Multer.File & CloudinaryUploadedFile)[];
  }
}
