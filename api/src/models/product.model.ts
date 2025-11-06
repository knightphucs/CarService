import {
  DataTypes,
  Model,
  Optional,
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
} from 'sequelize';
import sequelize from '../config/db';
import { Brand } from './brand.model';
import { Category } from './category.model';
import { randomBytes } from 'crypto';
import { Color } from './color.model';
import { Image } from './image.model';
import { ProductColor } from './product-color.model';
import { ProductImage } from './product-image.model';
import { ProductColorImage } from './product-color-image.model';

interface ProductAttributes {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  origin: string;
  engine: string;
  fuel: string;
  available: string;
  seats: number;
  type: string;
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
  public origin!: string;
  public engine!: string;
  public fuel!: string;
  public available!: string;
  public seats!: number;
  public type!: string;
  public transmission!: string;
  public made_in!: string;
  public readonly created_at!: Date;

  // Product <-> Color association mixins
  public addColor!: BelongsToManyAddAssociationMixin<Color, string>;
  public addColors!: BelongsToManyAddAssociationsMixin<Color, string>;
  public getColors!: BelongsToManyGetAssociationsMixin<Color>;
  public setColors!: BelongsToManySetAssociationsMixin<Color, string>;
  public removeColor!: BelongsToManyRemoveAssociationMixin<Color, string>;

  // Product <-> Image association mixins
  public addImage!: BelongsToManyAddAssociationMixin<Image, string>;
  public addImages!: BelongsToManyAddAssociationsMixin<Image, string>;
  public getImages!: BelongsToManyGetAssociationsMixin<Image>;
  public setImages!: BelongsToManySetAssociationsMixin<Image, string>;
  public removeImage!: BelongsToManyRemoveAssociationMixin<Image, string>;

  public readonly brand?: Brand;
  public readonly category?: Category;
  public readonly colors?: Color[];
  public readonly images?: Image[];
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
    name: { type: DataTypes.STRING(100) },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(12, 0) },
    origin: { type: DataTypes.STRING(45) },
    engine: { type: DataTypes.STRING(100) },
    fuel: { type: DataTypes.STRING(45) },
    available: { type: DataTypes.STRING(45) },
    seats: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING(100) },
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

// Liên kết quan hệ
Product.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' });
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Product ↔ Color
Product.belongsToMany(Color, {
  through: ProductColor,
  foreignKey: 'product_id',
  otherKey: 'color_id',
  as: 'colors',
});
Color.belongsToMany(Product, {
  through: ProductColor,
  foreignKey: 'color_id',
  otherKey: 'product_id',
  as: 'products',
});

// Product ↔ Image
Product.belongsToMany(Image, {
  through: ProductImage,
  foreignKey: 'product_id',
  otherKey: 'image_id',
  as: 'images',
});
Image.belongsToMany(Product, {
  through: ProductImage,
  foreignKey: 'image_id',
  otherKey: 'product_id',
  as: 'products',
});

// ProductColor ↔ ProductColorImage
ProductColor.hasMany(ProductColorImage, {
  foreignKey: 'product_id',
  as: 'colorImages',
});

// Image ↔ ProductColorImage
Image.hasMany(ProductColorImage, {
  foreignKey: 'image_id',
  as: 'colorImageLinks',
});
