// controllers/productController.js
const productService = require('../services/productService');
const salesService = require('../services/salesService');

const getProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getProductNamesAndPrices = async (req, res) => {
    try {
      const products = await productService.getProductNamesAndPrices();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getProductsByCategory = async (req, res) => {
    try {
      const category = req.query.category || 'Electronics'; // Default to 'Electronics' if no query parameter is provided
      const products = await productService.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getProductsWithHighPrice = async (req, res) => {
    try {
      const products = await productService.getProductsWithHighPrice();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getAverageUnitPrice = async (req, res) => {
    try {
      const averagePrice = await productService.getAverageUnitPrice();
      await productService.saveAverageUnitPrice(averagePrice); 
      res.json({ average_unit_price: averagePrice });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const calculateAndSaveStatistics = async (req, res) => {
    try {
      const averagePrice = await productService.getAverageUnitPrice();
      const totalQuantitySold = await salesService.getTotalQuantitySold();
  
      if (averagePrice === null || totalQuantitySold === null) {
        throw new Error('Calculated values are null');
      }
  
      await salesService.saveStatistics(averagePrice, totalQuantitySold); 
      res.json({
        average_unit_price: averagePrice,
        total_quantity_sold: totalQuantitySold
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getProductsOrderedByPrice = async (req, res) => {
    try {
      const products = await productService.getProductsOrderedByPrice();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getCategoryWithHighestAveragePrice = async (req, res) => {
    try {
      const category = await productService.getCategoryWithHighestAveragePrice();
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while finding the category with the highest average unit price' });
    }
  };
  const getProductsWithTotalSalesExceeding = async (req, res) => {
    try {
      const threshold = parseInt(req.query.threshold) || 30; 
      const products = await productService.getProductsWithTotalSalesExceeding(threshold);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while retrieving products with total sales exceeding the threshold' });
    }
  };
  const totalSaleRevenueForEach = async (req, res) => {
    try {
      const result = await productService.totalSaleRevenueForEachh();
      res.json({ message: 'Statistics updated successfully', data: result });
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
module.exports = {
  getProducts,
  addProduct,
  getProductNamesAndPrices,
  getProductsByCategory,
  getProductsWithHighPrice,
  getAverageUnitPrice,
  calculateAndSaveStatistics,
  getProductsOrderedByPrice,
  getCategoryWithHighestAveragePrice,
  getProductsWithTotalSalesExceeding,
  totalSaleRevenueForEach
};
