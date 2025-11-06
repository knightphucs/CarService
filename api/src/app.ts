import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import authRoutes from './routes/auth.routes';
import adminProductRoutes from './routes/admin/product-admin.routes';
import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';
import { setupSwagger } from './config/swagger';
import { setupSwaggerHotReload } from './config/swagger-hot';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env['PORT'] || 3000;

sequelize
  .authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch((err) => console.error('❌ DB connection failed:', err));

const server = app.listen(PORT, () => {
  console.log(`🚗 Car Service API running on http://localhost:${PORT}`);
});

setupSwaggerHotReload(server);
