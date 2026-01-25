const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Statik site için gevşek politika, gerekirse sıkılaştırılabilir
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes Placeholder
// app.use('/api/settings', require('./routes/settings'));
// app.use('/api/blog', require('./routes/blog'));
// app.use('/api/stats', require('./routes/stats'));
// app.use('/api/products', require('./routes/products'));
// app.use('/api/auth', require('./routes/auth'));

// Catch-all for SPA (Admin Panel) or 404
app.get(/^\/admin.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
