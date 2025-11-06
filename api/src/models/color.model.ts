import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { Image } from './image.model';
import { ProductColorImage } from './product-color-image.model';

interface ColorAttributes {
  id: string;
  color_name: string;
  color_code: string;
  description?: string;
}

interface ColorCreationAttributes extends Optional<ColorAttributes, 'id'> {}

export class Color
  extends Model<ColorAttributes, ColorCreationAttributes>
  implements ColorAttributes
{
  public id!: string;
  public color_name!: string;
  public color_code!: string;
  public description?: string;
}

Color.init(
  {
    id: { type: DataTypes.STRING(20), primaryKey: true },
    color_name: { type: DataTypes.STRING(100), allowNull: false },
    color_code: { type: DataTypes.STRING(20), allowNull: false },
    description: { type: DataTypes.STRING(200), allowNull: true },
  },
  { sequelize, tableName: 'color', timestamps: false }
);

Color.hasMany(ProductColorImage, {
  foreignKey: 'color_id',
  as: 'colorImages',
});

ProductColorImage.belongsTo(Color, {
  foreignKey: 'color_id',
  as: 'color',
});

ProductColorImage.belongsTo(Image, {
  foreignKey: 'image_id',
  as: 'linkedImage',
});
