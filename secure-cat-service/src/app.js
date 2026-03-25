// Express Application Setup
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const publicRoutes = require('./routes/index');
const protectedRoutes = require('./routes/protected');

const app = express();

// Middleware Registration
app.use(helmet()); // Security headers
app.use(morgan('combined')); // HTTP request logging

// View Engine Configuration
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Static File Serving
app.use(express.static(path.join(__dirname, '../public')));

// Request Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie Parser
app.use(cookieParser());

// Route Registration
app.use('/', publicRoutes);
app.use('/', protectedRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('error', {
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
