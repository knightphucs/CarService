export interface ProductBase {
  id?: string;
  name: string;
  description?: string;
  price: number;
  engine: number;
  fuel: string;
  available: string;
  image: string;
  seats: number;
  transmission: string;
  made_in: string;
  brand_id: string;
  category_id: string;
}

export interface ProductResponse extends ProductBase {
  brand?: BrandResponse;
  category?: CategoryResponse;
}

export interface ProductCreateDto extends Omit<ProductBase, 'id'> {}
export interface ProductUpdateDto extends Partial<ProductBase> {}

export interface BrandResponse {
  id: string;
  name: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
}
