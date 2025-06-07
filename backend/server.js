const cors = require('cors');
const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(cors());

app.get('/api/artist/:id/albums', async (req, res) => {
  try {
    const artistId = req.params.id;
    const response = await fetch(`https://api.deezer.com/artist/${artistId}/albums`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Deezer data' });
  }
});

app.listen(5000, () => console.log('Proxy server running on http://localhost:5000'));