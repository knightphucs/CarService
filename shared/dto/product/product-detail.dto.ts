export interface ProductDetailResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  brand?: string;
  origin: string;
  made_in: string;
  engine: string;
  fuel: string;
  transmission: string;
  image?: string;
  seats: number;
  type?: string;
  color?: string;
}
