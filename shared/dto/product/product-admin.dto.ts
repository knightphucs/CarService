import { BaseEntityDto } from './../base.dto';
import { BrandResponse } from './../brand/brand.dto';
import { CategoryResponse } from './../category/category.dto';

export interface ProductBase {
  name: string;
  description?: string;
  price: number;
  origin: string;
  engine: string;
  fuel: string;
  available: string;
  image: string;
  color: string;
  type: string;
  seats: number;
  transmission: string;
  made_in: string;
  brand_id: string;
  category_id: string;
}

export interface ProductResponse extends ProductBase, BaseEntityDto {
  brand?: BrandResponse;
  category?: CategoryResponse;
}

export interface ProductCreateDto extends ProductBase {
  image_ids?: string[];
  color_ids?: string[];
}

export interface ProductUpdateDto extends Partial<ProductBase> {
  image_ids?: string[];
  color_ids?: string[];
}
