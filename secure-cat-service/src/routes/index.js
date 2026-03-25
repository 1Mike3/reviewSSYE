// Public Routes (Login & Registration)
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

// GET /login - Serve login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login - Handle login submission
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Server-side input validation
  if (!username || !password) {
    return res.render('login', { error: 'Please provide both a username and password.' });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{1,100}$/;
  if (!usernameRegex.test(username) || username.length < 3 || password.length < 8) { // Register criteria
    return res.render('login', { error: 'Invalid credentials.' }); 
  }

  // Artificial delay for brute-force mitigation
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Authenticate with Auth Service
    const response = await axios.post(`${config.authServiceUrl}/login`, {
      username,
      password
    });

    const token = response.data.jwt;

    // Store JWT securely
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.redirect('/cats');

  } catch (error) {
    console.error('Login failed:', error.message);
    const errorMessage = error.response?.data?.error || 'Invalid credentials or Auth Service unavailable.';
    res.render('login', { error: errorMessage });
  }
});

// GET /register - Serve registration page
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST /register - Handle user registration
router.post('/register', async (req, res) => {
  const { username, password, passwordRepeat } = req.body;

  // Server-side input validation
  if (!username || !password || !passwordRepeat) {
    return res.render('register', { error: 'Please fill in all fields.' });
  }

  if (password !== passwordRepeat) {
    return res.render('register', { error: 'Passwords do not match.' });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{1,100}$/;
  if (!usernameRegex.test(username)) {
    return res.render('register', { error: 'Username can only contain letters, numbers, and underscores, and must be at most 100 characters long.' });
  }

  if (username.length < 3) {
    return res.render('register', { error: 'Username must be at least 3 characters long.' });
  }

  if (password.length < 8) {
    return res.render('register', { error: 'Password must be at least 8 characters long.' });
  }

  try {
    // Register with Auth Service
    const response = await axios.post(`${config.authServiceUrl}/register`, {
      username,
      password
    });

    const token = response.data.jwt;

    // Store JWT securely
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.redirect('/cats');

  } catch (error) {
    console.error('Registration failed:', error.message);
    const errorMessage = error.response?.data?.error || 'Registration failed or Auth Service unavailable.';
    res.render('register', { error: errorMessage });
  }
});

// POST /logout - Logout the user
router.post('/logout', (req, res) => {
    // Delete JWT in the browser
    res.clearCookie('auth_token');
    // Redirect to login page
    res.redirect('/login');
});


module.exports = router;
