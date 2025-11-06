import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface ImageAttributes {
  id: string;
  file_url: string;
  alt_text?: string;
  image_type?: 'Product' | 'Color' | 'Brand';
  created_at?: Date;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id'> {}

export class Image
  extends Model<ImageAttributes, ImageCreationAttributes>
  implements ImageAttributes
{
  public id!: string;
  public file_url!: string;
  public alt_text?: string;
  public image_type?: 'Product' | 'Color' | 'Brand';
  public readonly created_at?: Date;
}

Image.init(
  {
    id: { type: DataTypes.STRING(20), primaryKey: true },
    file_url: { type: DataTypes.STRING(255), allowNull: false },
    alt_text: { type: DataTypes.STRING(200), allowNull: true },
    image_type: {
      type: DataTypes.ENUM('Product', 'Color', 'Brand'),
      defaultValue: 'Product',
    },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: 'image', timestamps: false }
);
