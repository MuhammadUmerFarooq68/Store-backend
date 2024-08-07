
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const Sales = sequelize.define('Sales', {
  sale_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity_sold: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sale_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sales_category: {
    type: DataTypes.STRING, 
    allowNull: true,
  },
}, {
  tableName: 'sales',
  timestamps: false, 
});

module.exports = Sales;
