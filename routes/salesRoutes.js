
const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const productController = require('../controllers/productController');
// routes for creating sales table
router.get('/salestable', salesController.getSales);
router.post('/salestable', salesController.addSale);
router.get('/sale-ids-dates', salesController.getSaleIdsAndDates);
router.get('/sales-high-price', salesController.getSalesWithHighPrice);
router.get('/sales-by-date', salesController.getSalesByDate);
router.get('/total-revenue', salesController.getTotalRevenueController);
router.get('/total-revenue-for-each', salesController.getTotalRevenue);
router.get('/total-sales-exceeding', productController.getProductsWithTotalSalesExceeding);
router.get('/monthly-sales-count', salesController.getMonthlySalesCount)
router.get('/sales-categories', salesController.getcomputeAndSaveSalesCategory );
// routes for creating product table
router.get('/productstable', productController.getProducts);
router.post('/productstable', productController.addProduct);
router.get('/product-names-prices', productController.getProductNamesAndPrices);
router.get('/products-by-category', productController.getProductsByCategory);
router.get('/products-high-price', productController.getProductsWithHighPrice);
router.get('/average-unit-price', productController.getAverageUnitPrice);
router.get('/calculate-and-save-statistics', productController.calculateAndSaveStatistics);
router.get('/products-ordered-by-price', productController.getProductsOrderedByPrice);
router.get('/highest-average-price', productController.getCategoryWithHighestAveragePrice);
router.get('/total-revenu-for-each-product', productController.totalSaleRevenueForEach);
module.exports = router;
