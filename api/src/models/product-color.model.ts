import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

export class ProductColor extends Model {
  public product_id!: string;
  public color_id!: string;
  public additional_price!: number;
}

ProductColor.init(
  {
    product_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
    color_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
    additional_price: { type: DataTypes.DECIMAL(10, 0), defaultValue: 0 },
  },
  { sequelize, tableName: 'product_color', timestamps: false }
);
