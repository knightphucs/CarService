import { Product } from '../../../models/product.model';
import { ProductListResponse } from '@shared/dto';

export const toProductListResponse = (product: Product): ProductListResponse => {
  return {
    name: product.name,
    brand: product.brand ? product.brand.name : '',
    category: product.category ? product.category.name : '',
    price: Number(product.price),
    description: product.description,
    image: (product as any).images?.[0]?.file_url ?? '', // fallback;
  };
};
