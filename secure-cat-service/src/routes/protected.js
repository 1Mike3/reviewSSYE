// Protected Routes (Dashboard & Image Serving)
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const config = require('../config');
const { getSafePath } = require('../utils/fileValidator');

// Apply JWT authentication middleware to all protected routes
router.use(verifyToken);

// GET /cats - Dashboard Image Gallery
router.get('/cats', (req, res) => {
  try {
    fs.readdir(config.imageDir, (err, files) => {
      if (err) {
        console.error('Error reading image dir:', err);
        return res.status(500).render('error', { message: 'Could not load images' });
      }

      // Filter for supported image extensions
      const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));

      res.render('dashboard', {
        username: req.user.sub || 'User',
        images: images
      });
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Server Error' });
  }
});

// GET /cat/:filename - Individual Image Serving
router.get('/cat/:filename', (req, res) => {
  try {
    const filename = req.params.filename;

    // Validate filename and resolve safe absolute path
    const filePath = getSafePath(filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Image not found');
    }

    res.sendFile(filePath);

  } catch (error) {
    // Handle security violations and unexpected errors
    if (error.message.includes('Invalid') || error.message.includes('Access denied')) {
        console.warn(`Security Event: ${req.ip} attempted access to ${req.params.filename}`);
        return res.status(403).send('Access Denied');
    }
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
