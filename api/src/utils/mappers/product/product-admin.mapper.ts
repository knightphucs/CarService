import { Product } from '../../../models/product.model';
import { ProductResponse } from '@shared/dto';

export const toProductResponse = (product: Product): ProductResponse => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    origin: product.origin,
    engine: product.engine,
    fuel: product.fuel,
    available: product.available,
    image: (product as any).images?.[0]?.file_url ?? '', // fallback
    color: (product as any).colors?.[0]?.color_name ?? '',
    seats: product.seats,
    transmission: product.transmission,
    made_in: product.made_in,
    brand_id: product.brand_id,
    category_id: product.category_id,
    type: product.type,
    created_at: product.created_at,
    brand: product.brand ? { id: product.brand.id, name: product.brand.name } : undefined,
    category: product.category
      ? { id: product.category.id, name: product.category.name }
      : undefined,
  };
};
