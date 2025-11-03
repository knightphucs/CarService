import { Router } from 'express';
import {
  getAllProducts,
  getHomeProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByBrand,
} from '../controllers/product.controller';

const router = Router();

router.get('/', getAllProducts);
router.get('/home', getHomeProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/brand/:brandId', getProductsByBrand);

export default router;
