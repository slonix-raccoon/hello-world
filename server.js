const express = require('express');
const https = require('https');
const path = require('path');
const { version } = require('./package.json');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', (req, res) => {
  https.get('https://wttr.in/?format=j1', (response) => {
    response.setEncoding('utf8');
    let data = '';
    response.on('data', chunk => { data += chunk; });
    response.on('end', () => {
      try {
        const weather = JSON.parse(data);
        const current = weather.current_condition[0];
        const area = weather.nearest_area[0];
        res.json({
          location: `${area.areaName[0].value}, ${area.country[0].value}`,
          temp_c: current.temp_C,
          temp_f: current.temp_F,
          description: current.weatherDesc[0].value,
          humidity: current.humidity,
          wind_kmph: current.windspeedKmph,
          feels_like_c: current.FeelsLikeC,
          feels_like_f: current.FeelsLikeF
        });
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse weather data' });
      }
    });
  }).on('error', () => {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  });
});

app.get('/api/version', (req, res) => {
  res.json({ version });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
