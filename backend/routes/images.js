const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/images/random?query=...
router.get('/random', async (req, res) => {
  try {
    const { query = 'cafe, coffee shop' } = req.query;
    const unsplashUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}`;
    const resp = await axios.get(unsplashUrl, { responseType: 'stream', maxRedirects: 5 });
    res.setHeader('Content-Type', resp.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    resp.data.pipe(res);
  } catch (err) {
    console.error('Image proxy error', err?.response?.data || err.message || err);
    res.status(500).json({ message: 'Failed to fetch photo' });
  }
});

module.exports = router;
