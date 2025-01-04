// src/models/campaign.ts
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import User from './user';

class Campaign extends Model {
  public id!: number;
  public name!: string;
  public status!: 'active' | 'paused' | 'completed';
  public userId!: number;
  public clicks!: number;
  public conversions!: number;
  public conversionRate!: number;
  public targetAudience!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Campaign.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'completed'),
      defaultValue: 'active',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    conversions: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    conversionRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    targetAudience: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'Campaign',
    hooks: {
      beforeSave: (campaign: Campaign) => {
        if (campaign.clicks > 0) {
          campaign.conversionRate = (campaign.conversions / campaign.clicks) * 100;
        }
      },
    },
  }
);

export default Campaign;