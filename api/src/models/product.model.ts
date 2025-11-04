import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { Brand } from './brand.model';
import { Category } from './category.model';
import { randomBytes } from 'crypto';

interface ProductAttributes {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  engine: number;
  fuel: string;
  available: string;
  image: string;
  seats: string;
  transmission: string;
  made_in: string;
  created_at?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public brand_id!: string;
  public category_id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public engine!: number;
  public fuel!: string;
  public available!: string;
  public image!: string;
  public seats!: string;
  public transmission!: string;
  public made_in!: string;
  public readonly created_at!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    brand_id: {
      type: DataTypes.STRING,
      field: 'brand_id',
      allowNull: false,
    },
    category_id: {
      type: DataTypes.STRING,
      field: 'category_id',
      allowNull: false,
    },
    name: { type: DataTypes.STRING(45) },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 0) },
    engine: { type: DataTypes.FLOAT },
    fuel: { type: DataTypes.STRING(45) },
    available: { type: DataTypes.STRING(45) },
    image: { type: DataTypes.STRING(256) },
    seats: { type: DataTypes.STRING(45) },
    transmission: { type: DataTypes.STRING(45) },
    made_in: {
      type: DataTypes.STRING(45),
      field: 'made_in',
    },
    created_at: { type: DataTypes.DATE, field: 'created_at' },
  },
  {
    sequelize,
    tableName: 'product',
    timestamps: false,
  }
);

// Hook tự tạo ID
Product.beforeCreate((product: any) => {
  const unique = randomBytes(3).toString('hex').toUpperCase();
  product.id = `PROD-${unique}`;
});

// Liên kết quan hệ
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
