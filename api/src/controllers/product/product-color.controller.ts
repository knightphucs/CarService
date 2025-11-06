import { Request, Response } from 'express';
import { Product, Color, ProductColorImage, Image } from '../../models';
import { ApiResponse } from '@shared/dto';
import { ProductColorsResponse } from '@shared/dto/product/product-color.dto';

export const getProductColorsWithImages = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<ProductColorsResponse>>
) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      attributes: ['id', 'name'],
      include: [
        {
          model: Color,
          as: 'colors',
          attributes: ['id', 'color_name', 'color_code'],
          include: [
            {
              model: ProductColorImage,
              as: 'colorImages',
              include: [
                {
                  model: Image,
                  as: 'linkedImage',
                  attributes: ['id', 'file_url'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null as any,
      });
    }

    const response: ProductColorsResponse = {
      product_id: product.id,
      product_name: product.name,
      colors:
        product.colors?.map((color) => ({
          id: color.id,
          color_id: color.id,
          color_name: color.color_name,
          color_code: color.color_code,
          images:
            (color as any).colorImages?.map((ci: any) => ({
              image_id: ci.linkedImage.id,
              file_url: ci.linkedImage.file_url,
            })) ?? [],
        })) ?? [],
    };

    return res.status(200).json({
      success: true,
      message: 'Fetched product colors and images successfully',
      data: response,
    });
  } catch (error) {
    console.error('Error fetching product colors with images:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      data: null as any,
    });
  }
};
