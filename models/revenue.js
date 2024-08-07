const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Revenue = sequelize.define('Revenue', {
  revenue_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  total_revenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  recorded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
}, {
  tableName: 'revenues',
  timestamps: false, // Use false if you don't need createdAt/updatedAt fields
});

module.exports = Revenue;
