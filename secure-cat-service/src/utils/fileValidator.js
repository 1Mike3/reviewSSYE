// Filename Validation & Path Traversal Prevention
const path = require('path');
const config = require('../config');

/**
 * Validates a filename and returns a safe absolute file path.
 * Ensures the path resolves within the configured image directory.
 */
function getSafePath(filename) {
  // Layer 1: Allowlist Regex
  const allowedPattern = /^[a-zA-Z0-9-_]+\.(jpg|jpeg|png|gif)$/;

  if (!filename || !allowedPattern.test(filename)) {
    throw new Error('Invalid filename format.');
  }

  // Layer 2: Explicit Directory Traversal Check
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new Error('Path traversal attempt detected.');
  }

  // Layer 3: Resolved Path Verification
  const resolvedPath = path.resolve(config.imageDir, filename);

  if (!resolvedPath.startsWith(path.resolve(config.imageDir))) {
    throw new Error('Access denied: File outside of image directory.');
  }

  return resolvedPath;
}

module.exports = { getSafePath };
