import { ProductDetailResponse } from '@shared/dto';
import { Product } from 'src/models/product.model';

export const toProductDetailResponse = (product: Product): ProductDetailResponse => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    brand: product.brand?.name ?? '',
    origin: product.origin,
    made_in: product.made_in,
    engine: String(product.engine),
    fuel: product.fuel,
    transmission: product.transmission,
    image: product.images?.[0]?.file_url ?? '',
    seats: Number(product.seats),
    type: product.category?.name,
    color: product.colors?.map((c: any) => c.color_name).join(', ') ?? '',
  };
};
