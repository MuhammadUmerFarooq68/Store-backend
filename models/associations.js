const Product = require('./product');
const Sale = require('./sales');
const Revenue = require('./revenue');
const Statistics = require('./statistics');

Product.hasMany(Sale, { foreignKey: 'product_id' });
Sale.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { Product, Sale,Revenue,Statistics  };