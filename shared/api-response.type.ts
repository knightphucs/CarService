/** Kiểu dữ liệu trả về chuẩn của mọi API */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
