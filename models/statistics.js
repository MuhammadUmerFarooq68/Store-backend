// models/statistics.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Statistics = sequelize.define('Statistics', {
  average_unit_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  calculated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  total_quantity_sold: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sales_count: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  month: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true 
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total_revenue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  recorded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  }
});

module.exports = Statistics;
