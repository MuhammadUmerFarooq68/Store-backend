// controllers/salesController.js
const salesService = require('../services/salesService');

const getSales = async (req, res) => {
  try {
    const sales = await salesService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addSale = async (req, res) => {
  try {
    const sale = await salesService.createSale(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getSaleIdsAndDates = async (req, res) => {
    try {
      const sales = await salesService.getSaleIdsAndDates();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getSalesWithHighPrice = async (req, res) => {
    try {
      const sales = await salesService.getSalesWithHighPrice();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getSalesByDate = async (req, res) => {
    try {
      const date = req.query.date || '2024-01-03'; 
      const sales = await salesService.getSalesByDate(date);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getTotalRevenueController = async (req, res) => {
    try {
      const totalRevenue = await salesService.getTotalRevenue();
      await salesService.saveTotalRevenue(totalRevenue); // Save the total revenue
      res.json({ total_revenue: totalRevenue });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  const getTotalRevenue = async (req, res) => {
    try {
      const revenueData = await salesService.calculateTotalRevenue();
      res.json(revenueData);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while calculating total revenue' });
    }
  };
  const getMonthlySalesCount = async (req, res) => {
    try {
      await salesService.getMonthlySalesCount();
      res.status(200).json({ message: 'Monthly sales counts updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating monthly sales counts' });
    }
  };
  const getcomputeAndSaveSalesCategory = async (req, res) => {
    try {
      const sales = await salesService.computeAndSaveSalesCategory();
      res.json({ message: 'Sales categories computed and saved successfully', data: sales });
    } catch (error) {
      console.error('Error in controller:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
module.exports = {
  getSales,
  addSale,
  getSaleIdsAndDates,
  getSalesWithHighPrice,
  getSalesByDate,
  getTotalRevenueController,
  getTotalRevenue,
  getMonthlySalesCount,
  getcomputeAndSaveSalesCategory
};
