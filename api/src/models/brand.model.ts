import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

interface BrandAttributes {
  id: string;
  name: string;
}

interface BrandCreationAttributes extends Optional<BrandAttributes, 'id'> {}

export class Brand
  extends Model<BrandAttributes, BrandCreationAttributes>
  implements BrandAttributes
{
  public id!: string;
  public name!: string;
}

Brand.init(
  {
    id: {
      type: DataTypes.STRING(36),
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
