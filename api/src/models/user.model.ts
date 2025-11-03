import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

// Các field có thể có khi tạo User
interface UserAttributes {
  user_id: number;
  user_name: string;
  password: string;
  role: string; // Thêm role
  remember_me?: boolean;
}

// Cho phép user_id auto-increment
interface UserCreationAttributes extends Optional<UserAttributes, 'user_id'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: number;
  public user_name!: string;
  public password!: string;
  public role!: string;
  public remember_me?: boolean;
}

// Định nghĩa model Sequelize
User.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('Admin', 'User', 'Producer', 'PremiumUser'),
      allowNull: false,
      defaultValue: 'User',
    },
    remember_me: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'User',
    timestamps: false,
  }
);
