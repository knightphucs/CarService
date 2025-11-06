import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

export class ProductImage extends Model {
  public product_id!: string;
  public image_id!: string;
}

ProductImage.init(
  {
    product_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
    image_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
  },
  { sequelize, tableName: 'product_image', timestamps: false }
);
