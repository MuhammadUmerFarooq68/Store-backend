const express = require('express')
const sequelize = require('./config/database');
const useroutes = require('./routes/salesRoutes');
const app = express()
const PORT = 3000

app.use(express.json())


app.use('/api', useroutes);

sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });