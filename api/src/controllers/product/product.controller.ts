import { Request, Response } from 'express';
import { Product, Brand, Category, Image } from '../../models/';
import { ApiResponse } from '@shared/dto';
import { ProductHomeResponse } from '@shared/dto/product/product-home.dto';
import { ProductListResponse } from '@shared/dto/product/product-list.dto';
import { ProductDetailResponse } from '@shared/dto/product/product-detail.dto';
import { Color } from '../../models/color.model';
import { toProductListResponse } from '../../utils/mappers/product/product-list.mapper';
import { toProductDetailResponse } from '../../utils/mappers/product/product-detail.mapper';

export const getProductsForHome = async (
  _req: Request,
  res: Response<ApiResponse<ProductHomeResponse[]>>
): Promise<void> => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
        {
          model: Image,
          as: 'images',
          attributes: ['file_url'],
          through: { attributes: [] },
        },
      ],
      attributes: ['name'],
    });

    const mappedProducts: ProductHomeResponse[] = (products as any[]).map((p) => ({
      brand: p.brand?.name ?? '',
      name: p.name,
      image: p.images?.[0]?.file_url ?? '', // ảnh đầu tiên
    }));

    res.status(200).json({
      success: true,
      message: 'Fetched home products successfully',
      data: mappedProducts,
    });
  } catch (error) {
    console.error('❌ Error fetching home products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching home products',
      data: [],
    });
  }
};

export const getProductsList = async (
  _req: Request,
  res: Response<ApiResponse<ProductListResponse[]>>
): Promise<void> => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
        { model: Image, as: 'images', attributes: ['file_url'], through: { attributes: [] } },
      ],
      attributes: ['id', 'name', 'price', 'description'],
    });

    const mapped = products.map(toProductListResponse);

    res.status(200).json({
      success: true,
      message: 'Fetched all products successfully',
      data: mapped,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      data: [],
    });
  }
};

export const getProductDetails = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<ProductDetailResponse | null>>
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
        {
          model: Image,
          as: 'images',
          attributes: ['file_url'],
          through: { attributes: [] },
        },
        {
          model: Color,
          as: 'colors',
          attributes: ['color_name'],
          through: { attributes: ['additional_price'] },
        },
      ],
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null,
      });
      return;
    }

    const detail = toProductDetailResponse(product);

    res.status(200).json({
      success: true,
      message: 'Fetched product details successfully',
      data: detail,
    });
  } catch (error) {
    console.error('❌ Error fetching product details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product details',
      data: null,
    });
  }
};

//  Lấy sản phẩm theo category
export const getProductsByCategory = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<ProductListResponse[]>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const products = await Product.findAll({
      where: { category_id: id },
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });

    const mapped = products.map(toProductListResponse);

    res.status(200).json({
      success: true,
      message: 'Fetched products by brand',
      data: mapped,
    });
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by brand',
      data: [],
    });
  }
};
