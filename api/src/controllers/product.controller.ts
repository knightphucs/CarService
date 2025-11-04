import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { Category } from '../models/category.model';
import { ProductResponse, ProductCreateDto, ProductUpdateDto } from '@shared/types/product.type';
import { ApiResponse } from '@shared/types/api-response.type';

export const getAllProducts = async (
  _req: Request,
  res: Response<ApiResponse<ProductResponse[]>>
): Promise<void> => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
      ],
    });
    res.status(200).json({
      success: true,
      message: 'Fetched all products successfully',
      data: products,
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

// Lấy sản phẩm cho trang Home
export const getHomeProducts = async (
  _req: Request,
  res: Response<ApiResponse<ProductResponse[]>>
): Promise<void> => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'image', 'price', 'available'],
      include: [
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
      ],
      limit: 4,
      order: [['price', 'DESC']],
    });

    const formatted = products.map((p) => ({
      ...p.toJSON(),
      priceFormatted: new Intl.NumberFormat('vi-VN').format(Number(p.price)) + ' ₫',
    }));

    res.status(200).json({
      success: true,
      message: 'Fetched home products',
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching home products:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
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
        { model: Brand, as: 'brand', attributes: ['name'] },
        { model: Category, as: 'category', attributes: ['name'] },
      ],
    });

    if (product) {
      res.status(200).json({
        success: true,
        message: 'Fetched product successfully',
        data: product,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null as any,
      });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      data: null as any,
    });
  }
};

//  Lấy sản phẩm theo brand
export const getProductsByBrand = async (
  req: Request<{ brandId: string }>,
  res: Response<ApiResponse<ProductResponse[]>>
): Promise<void> => {
  try {
    const { brandId } = req.params;
    const products = await Product.findAll({
      where: { brand_id: brandId },
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });

    res.status(200).json({
      success: true,
      message: 'Fetched products by brand',
      data: products,
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

// Thêm sản phẩm mới
export const createProduct = async (
  req: Request<{}, {}, ProductCreateDto>,
  res: Response<ApiResponse<ProductResponse>>
): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
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
    const [updated] = await Product.update(req.body, { where: { id } });
    if (updated) {
      const updatedProduct = await Product.findByPk(id);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct!,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
        data: null as any,
      });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      data: null as any,
    });
  }
};

// ✅ Xóa sản phẩm
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
