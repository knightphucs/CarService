import { BaseEntityDto } from '../base.dto';

export interface ColorImageDto {
  image_id: string;
  file_url: string;
}

export interface ProductColorResponse extends BaseEntityDto {
  color_id: string;
  color_name: string;
  color_code: string;
  images: ColorImageDto[];
}

export interface ProductColorsResponse {
  product_id: string;
  product_name: string;
  colors: ProductColorResponse[];
}
