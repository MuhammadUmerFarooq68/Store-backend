// services/productService.js
const Product = require('../models/product');
const Statistics = require('../models/statistics');
const Sales = require('../models/sales');
const sequelize = require('../config/database');

const { Op,fn, col, literal } = require('sequelize');

const getAllProducts = async () => {
  try {
    return await Product.findAll();
  } catch (error) {
    throw new Error('Error fetching products: ' + error.message);
  }
};

const createProduct = async (productData) => {
  try {
    const { product_name, category, unit_price } = productData;
    if (!product_name || !category || !unit_price) {
      throw new Error('Missing required fields');
    }
    return await Product.create({ product_name, category, unit_price });
  } catch (error) {
    throw new Error('Error creating product: ' + error.message);
  }
};

// Retrieve the product_name and unit_price from the Products table.

const getProductNamesAndPrices = async () => {
    try {
      // Query to select only `product_name` and `unit_price`
      return await Product.findAll({
        attributes: ['product_name', 'unit_price']
      });
    } catch (error) {
      throw new Error('Error fetching product names and prices: ' + error.message);
    }
  };
//    Filter the Products table to show only products in the ‘Electronics’ category.
  const getProductsByCategory = async (category) => {
    try {
     
      return await Product.findAll({
        where: {
          category: {
            [Op.eq]: category 
          }
        }
      });
    } catch (error) {
      throw new Error('Error fetching products by category: ' + error.message);
    }
  };
//  Retrieve the product_id and product_name from the Products table for products with a unit_price greater than $100
  const getProductsWithHighPrice = async () => {
    try {
     
      return await Product.findAll({
        attributes: ['product_id', 'product_name'],
        where: {
          unit_price: {
            [Op.gt]: 100 
          }
        }
      });
    } catch (error) {
      throw new Error('Error fetching products with unit price greater than $100: ' + error.message);
    }
  };
  // Calculate the average unit_price of products in the Products table.
  const getAverageUnitPrice = async () => {
    try {
      const result = await Product.findAll({
        attributes: [
          [fn('AVG', col('unit_price')), 'average_price']
        ]
      });
      return result[0].get('average_price');
    } catch (error) {
      throw new Error('Error calculating average unit price: ' + error.message);
    }
  };
  
  const saveAverageUnitPrice = async (averagePrice) => {
    try {
     
      return await Statistics.create({
        average_unit_price: averagePrice
      });
    } catch (error) {
      throw new Error('Error saving average unit price: ' + error.message);
    }
  };
// Retrieve the product_name and unit_price from the Products table, ordering the results by unit_price in descending order
  const getProductsOrderedByPrice = async () => {
    try {
      return await Product.findAll({
        attributes: ['product_name', 'unit_price'],
        order: [['unit_price', 'DESC']] 
      });
    } catch (error) {
      throw new Error('Error retrieving products ordered by price: ' + error.message);
    }
  };
// Find the product category with the highest average unit price.
const getCategoryWithHighestAveragePrice = async () => {
  try {
    const results = await Product.findAll({
      attributes: [
        'category',
        [fn('AVG', col('unit_price')), 'averagePrice']
      ],
      group: 'category',
      order: literal('averagePrice DESC'),
      limit: 1,
      raw: true
    });
    const highestCategory = results[0];
    if (highestCategory) {
      const totalQuantity = await Sales.sum('quantity_sold', {
        include: [{
          model: Product,
          attributes: [],
          where: { category: highestCategory.category }
        }]
      });
         const quantitySold = totalQuantity || 0;
      await Statistics.create({
        average_unit_price: highestCategory.averagePrice,
        total_quantity_sold: quantitySold
      });
    }

    return highestCategory;
  } catch (error) {
    console.error('Error finding or storing category with highest average price:', error);
    throw error;
  }
};
//  Identify products with total sales exceeding 30
const getProductsWithTotalSalesExceeding = async (threshold = 30) => {
  try {
    const results = await Product.findAll({
      attributes: [
        'product_id',
        'product_name',
        [fn('SUM', col('Sales.quantity_sold')), 'totalQuantitySold']
      ],
      include: [{
        model: Sales,
        attributes: []
      }],
      group: ['Product.product_id'],
      having: {
        totalQuantitySold: {
          [Op.gt]: threshold
        }
      },
      raw: true
    });
  return results;
  } catch (error) {
    console.error('Error finding products with total sales exceeding threshold:', error);
    throw error;
  }
};
// 
const totalSaleRevenueForEachh = async () => {
  try {
   const productRevenues = await Product.findAll({
      attributes: [
        'product_name',
        [fn('SUM', col('Sales.total_price')), 'total_revenue']
      ],
      include: [
        {
          model: Sales,
          attributes: []
        }
      ],
      group: ['Product.product_name']
    });
    for (const product of productRevenues) {
      await Statistics.upsert({
        product_name: product.product_name,
        total_revenue: product.total_revenue
      });
    }
    return productRevenues;
  } catch (error) {
    console.error('Error calculating and saving statistics:', error);
    throw error;
  }
};
module.exports = {
  getAllProducts,
  createProduct,
  getProductNamesAndPrices,
  getProductsByCategory,
  getProductsWithHighPrice,
  getAverageUnitPrice,
  saveAverageUnitPrice,
  getProductsOrderedByPrice,
  getCategoryWithHighestAveragePrice,
  getProductsWithTotalSalesExceeding,
  totalSaleRevenueForEachh
};
