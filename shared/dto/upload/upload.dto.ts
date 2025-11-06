export interface CloudinaryUploadedFile {
  path: string;
  filename: string;
  mimetype: string;
  size: number;
  originalname: string;
}

/** Dữ liệu trả về cho upload 1 file */
export interface UploadResponse {
  imageUrl: string;
}

/** Dữ liệu trả về cho upload nhiều file */
export interface MultipleUploadResponse {
  images: string[];
}
