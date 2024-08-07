// services/salesService.js
const Sales = require('../models/sales');
const Revenue = require('../models/revenue');
const Statistics = require('../models/statistics');8
const { Sequelize } = require('sequelize');
const { Op, fn, col, literal } = require('sequelize');
const {Product , Sale} = require('../models/associations');

const getAllSales = async () => {
  try {
    return await Sales.findAll();
  } catch (error) {
    throw new Error('Error fetching sales: ' + error.message);
  }
};
const createSale = async (saleData) => {
  try {
    const { product_id, quantity_sold, sale_date, total_price } = saleData;
    if (!product_id || !quantity_sold || !sale_date || !total_price) {
      throw new Error('Missing required fields');
    }
    return await Sales.create({ product_id, quantity_sold, sale_date, total_price });
  } catch (error) {
    throw new Error('Error creating sale: ' + error.message);
  }
};
//  Retrieve the sale_id and sale_date from the Sales table.
const getSaleIdsAndDates = async () => {
  try {
    // Query to select only `sale_id` and `sale_date`
    return await Sales.findAll({
      attributes: ['sale_id', 'sale_date']
    });
  } catch (error) {
    throw new Error('Error fetching sale IDs and dates: ' + error.message);
  }
};
// Filter the Sales table to show only sales with a total_price greater than $100.
const getSalesWithHighPrice = async () => {
  try {
    // Query to select sales where total_price > 100
    return await Sales.findAll({
      where: {
        total_price: {
          [Sequelize.Op.gt]: 100  // Using Sequelize.Op.gt for greater than
        }
      }
    });
  } catch (error) {
    throw new Error('Error fetching sales with total price greater than $100: ' + error.message);
  }
};
//  Retrieve the sale_id and total_price from the Sales table for sales made on January 3, 2024.
const getSalesByDate = async (date) => {
  try {
    // Query to select sales where sale_date = the given date
    return await Sales.findAll({
      attributes: ['sale_id', 'total_price'],
      where: {
        sale_date: {
          [Op.eq]: date // Using Sequelize.Op.eq for equality check
        }
      }
    });
  } catch (error) {
    throw new Error('Error fetching sales by date: ' + error.message);
  }
};
//  Calculate the total revenue generated from all sales in the Sales table.
const getTotalRevenue = async () => {
  try {
    const totalRevenue = await Sales.sum('total_price');
    return totalRevenue || 0; // Return 0 if no revenue found
  } catch (error) {
    throw new Error('Error calculating total revenue: ' + error.message);
  }
};
// //  Calculate the total revenue generated from all sales in the Sales table.
const saveTotalRevenue = async (totalRevenue) => {
  try {
    return await Revenue.create({ total_revenue: totalRevenue });
  } catch (error) {
    throw new Error('Error saving total revenue: ' + error.message);
  }
};
// Calculate the total quantity_sold from the Sales table.
const getTotalQuantitySold = async () => {
  try {
    const result = await Sales.sum('quantity_sold');
    return result;
  } catch (error) {
    throw new Error('Error calculating total quantity sold: ' + error.message);
  }
};
const saveStatistics = async (averagePrice, totalQuantitySold) => {
  try {
        return await Statistics.create({
      average_unit_price: averagePrice,
      total_quantity_sold: totalQuantitySold
    });
  } catch (error) {
    throw new Error('Error saving statistics: ' + error.message);
  }
};
//  Calculate the total revenue generated from sales for each product category.
const calculateTotalRevenue = async () => {
  try {
    const results = await Product.findAll({
      attributes: [
        'category',
        [fn('SUM', col('Sales.total_price')), 'totalRevenue']
      ],
      include: [{
        model: Sale,
        attributes: [],
      }],
      group: 'Product.category',
      raw: true
    });

    return results;
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    throw error;
  }
};
// Count the number of sales made in each month.
const countMonthlySales = async () => {
  try {
    const salesCounts = await Sales.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('sale_date'), '%Y-%m'), 'month'], 
        [fn('COUNT', col('sale_id')), 'salesCount']
      ],
      group: [fn('DATE_FORMAT', col('sale_date'), '%Y-%m')],
      raw: true
    });
    for (const entry of salesCounts) {
      await Statistics.create({
        sales_count: entry.salesCount,
        calculated_at: new Date(`${entry.month}-01`), 
      });
    }
  } catch (error) {
    console.error('Error counting and storing monthly sales:', error);
    throw error;
  }
};
// Count the number of sales made in each month.
const getMonthlySalesCount = async () => {
  try {
    const salesCounts = await Sales.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('sale_date'), '%Y-%m'), 'month'], // Format date to YYYY-MM
        [fn('COUNT', col('sale_id')), 'salesCount']
      ],
      group: [fn('DATE_FORMAT', col('sale_date'), '%Y-%m')],
      raw: true
    });

    for (const entry of salesCounts) {
      await Statistics.upsert({
        month: entry.month,
        sales_count: entry.salesCount,
        calculated_at: new Date(`${entry.month}-01`), // Set the calculated_at field to the first day of the month
      });
    }
  } catch (error) {
    console.error('Error retrieving and storing monthly sales count:', error);
    throw error;
  }
};
// Categorize sales as “High”, “Medium”, or “Low” based on total price (e.g., > $200 is High, $100-$200 is Medium, < $100 is Low).
const computeAndSaveSalesCategory = async () => {
  try {
    // Fetch all sales and compute the category
    const sales = await Sales.findAll({
      attributes: [
        'sale_id',
        'total_price',
        [literal(`
          CASE 
              WHEN total_price > 200 THEN 'High'
              WHEN total_price BETWEEN 100 AND 200 THEN 'Medium'
              ELSE 'Low'
          END
        `), 'sales_category']
      ]
    });
    for (const sale of sales) {
      await Sales.update(
        { sales_category: sale.sales_category },
        { where: { sale_id: sale.sale_id } }
      );
    }
    return sales;
  } catch (error) {
    console.error('Error computing and saving sales category:', error);
    throw error;
  }
};

module.exports = {
  getAllSales,
  createSale,
  getSaleIdsAndDates,
  getSalesWithHighPrice,
  getSalesByDate,
  getTotalRevenue,
  saveTotalRevenue,
  getTotalQuantitySold,
  saveStatistics,
  calculateTotalRevenue,
  countMonthlySales,
  getMonthlySalesCount,
  computeAndSaveSalesCategory

};
