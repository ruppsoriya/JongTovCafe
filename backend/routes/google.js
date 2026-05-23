const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.warn('Google Places API key not set (GOOGLE_PLACES_API_KEY) — /api/google/photo will not work');
}

// GET /api/google/photo?photoReference=... OR ?placeId=... OR ?query=...
router.get('/photo', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ message: 'Server missing GOOGLE_PLACES_API_KEY' });

    const { photoReference, placeId, query } = req.query;
    let ref = photoReference;

    if (!ref && placeId) {
      // get place details
      const detUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=photos&key=${API_KEY}`;
      const det = await axios.get(detUrl);
      ref = det.data?.result?.photos?.[0]?.photo_reference;
    }

    if (!ref && query) {
      // find place from text
      const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=photos,place_id&key=${API_KEY}`;
      const found = await axios.get(findUrl);
      ref = found.data?.candidates?.[0]?.photos?.[0]?.photo_reference;
      if (!ref && found.data?.candidates?.[0]?.place_id) {
        // try details
        const detUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(found.data.candidates[0].place_id)}&fields=photos&key=${API_KEY}`;
        const det = await axios.get(detUrl);
        ref = det.data?.result?.photos?.[0]?.photo_reference;
      }
    }

    if (!ref) return res.status(404).json({ message: 'No photo reference found for that query' });

    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${encodeURIComponent(ref)}&key=${API_KEY}`;

    // Request the photo and stream back to client
    const resp = await axios.get(photoUrl, { responseType: 'stream', maxRedirects: 5 });
    res.setHeader('Content-Type', resp.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    resp.data.pipe(res);
  } catch (err) {
    console.error('Google photo proxy error', err?.response?.data || err.message || err);
    res.status(500).json({ message: 'Failed to fetch photo' });
  }
});

module.exports = router;
