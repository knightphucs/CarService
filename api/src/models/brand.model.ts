import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface BrandAttributes {
  id: number;
  name: string;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id'> {}

export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  public id!: number;
  public name!: string;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'brand',
    timestamps: false,
  }
);
