import { Request, Response } from 'express';
import { Product, Brand, Category, Image, Color } from '../../models';
import { ApiResponse, ProductResponse, ProductCreateDto, ProductUpdateDto } from '@shared/dto';
import { toProductResponse } from '../../utils/mappers/product/product-admin.mapper';

export const getAllProductsForAdmin = async (
  _req: Request,
  res: Response<ApiResponse<ProductResponse[]>>
): Promise<void> => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
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

    const mapped = products.map(toProductResponse);

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

//  Lấy sản phẩm theo ID
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<ProductResponse>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['name'] },
        { model: Image, as: 'images', attributes: ['file_url'] },
        { model: Color, as: 'colors', attributes: ['color_name'] },
      ],
    });

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null as any,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Fetched product successfully',
      data: toProductResponse(product),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      data: null as any,
    });
  }
};

// Thêm sản phẩm mới
export const createProduct = async (
  req: Request<{}, {}, ProductCreateDto>,
  res: Response<ApiResponse<ProductResponse>>
): Promise<void> => {
  try {
    const { image_ids, color_ids, ...productData } = req.body;

    const product = await Product.create(productData);

    if (color_ids?.length) await product.setColors(color_ids);
    if (image_ids?.length) await product.setImages(image_ids);

    const created = await Product.findByPk(product.id, {
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Image, as: 'images', attributes: ['file_url'] },
        { model: Color, as: 'colors', attributes: ['color_name'] },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: toProductResponse(created!),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      data: null as any,
    });
  }
};

// Cập nhật sản phẩm
export const updateProduct = async (
  req: Request<{ id: string }, {}, ProductUpdateDto>,
  res: Response<ApiResponse<ProductResponse>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const { image_ids, color_ids, ...updateData } = req.body;

    const [updated] = await Product.update(updateData, { where: { id } });
    if (!updated) {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null as any,
      });
      return;
    }

    const product = await Product.findByPk(id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found after update',
        data: null as any,
      });
      return;
    }

    if (color_ids) await product.setColors(color_ids);
    if (image_ids) await product.setImages(image_ids);

    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Image, as: 'images', attributes: ['file_url'] },
        { model: Color, as: 'colors', attributes: ['color_name'] },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: toProductResponse(updatedProduct!),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      data: null as any,
    });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (
  req: Request<{ id: string }>,
  res: Response<ApiResponse<null>>
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null,
      });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      data: null,
    });
  }
};
