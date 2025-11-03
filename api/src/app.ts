import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/db';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import uploadRoutes from './routes/upload.routes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => console.log('✅ Connected to MySQL'))
  .catch((err) => console.error('❌ DB connection failed:', err));

app.listen(PORT, () => {
  console.log(`🚗 Car Service API running on http://localhost:${PORT}`);
});
