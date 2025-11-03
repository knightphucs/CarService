import { Request } from 'express';
import { CloudinaryUploadedFile } from '@shared';

export interface SingleUploadRequest extends Request {
  file?: Express.Multer.File & CloudinaryUploadedFile;
}

export interface MultipleUploadRequest extends Request {
  files?: (Express.Multer.File & CloudinaryUploadedFile)[];
}
