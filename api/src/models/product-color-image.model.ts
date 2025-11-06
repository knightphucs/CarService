import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

export class ProductColorImage extends Model {
  declare product_id: string;
  declare color_id: string;
  declare image_id: string;
}

ProductColorImage.init(
  {
    product_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
    color_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
    image_id: { type: DataTypes.STRING(20), allowNull: false, primaryKey: true },
  },
  { sequelize, tableName: 'product_color_image', timestamps: false }
);
