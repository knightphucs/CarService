import { Router } from 'express';
import {
  getProductDetails,
  getProductsByCategory,
  getProductsForHome,
  getProductsList,
} from '../controllers/product/product.controller';
import { getProductColorsWithImages } from '../controllers/product/product-color.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm (trang chủ, danh mục, chi tiết, và màu sắc)
 */

/**
 * @swagger
 * /api/products/home:
 *   get:
 *     summary: Lấy danh sách sản phẩm hiển thị trên trang chủ
 *     tags: [Products]
 *     description: Trả về danh sách các sản phẩm nổi bật hoặc được hiển thị trên trang chủ.
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponse'
 */
router.get('/home', getProductsForHome);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Products]
 *     description: Trả về danh sách tất cả sản phẩm trong hệ thống, có thể hỗ trợ phân trang.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại (phân trang)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số sản phẩm mỗi trang
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponse'
 */
router.get('/', getProductsList);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     description: Trả về thông tin chi tiết về một sản phẩm (thương hiệu, danh mục, thông số kỹ thuật, v.v.)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Lấy chi tiết sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id', getProductDetails);

/**
 * @swagger
 * /api/products/{id}/colors:
 *   get:
 *     summary: Lấy danh sách màu sắc và ảnh tương ứng cho sản phẩm
 *     tags: [Products]
 *     description: Trả về danh sách tất cả các màu của sản phẩm cùng với các ảnh riêng từng màu.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID sản phẩm
 *     responses:
 *       200:
 *         description: Lấy danh sách màu và ảnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/ProductColorsResponse'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/:id/colors', getProductColorsWithImages);

/**
 * @swagger
 * /api/products/category/{id}:
 *   get:
 *     summary: Lấy danh sách sản phẩm theo danh mục
 *     tags: [Products]
 *     description: Trả về danh sách tất cả sản phẩm thuộc danh mục cụ thể.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID danh mục
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm theo danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductResponse'
 *       404:
 *         description: Không tìm thấy danh mục hoặc không có sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/category/:id', getProductsByCategory);

export default router;
