const express = require('express');
const axios = require('axios');
const cors = require('cors');
const e = require('express');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS so your frontend can call your backend from a different origin
app.use(cors({
  origin: 'https://thienb2.github.io',
}));

// If you have JSON data in requests, you might want this:
app.use(express.json());

// GET endpoint for /weather
app.get('/weather', async (req, res) => {
  try {
    // "city" will come in via query param, e.g. /weather?city=London
    const city = req.query.city;
    
    // Make sure you have an API key from a weather provider like OpenWeather
    // Sign up at: https://openweathermap.org/api
    const apiKey = process.env.OPENWEATHER_API_KEY || 'ERROR';

    // Example endpoint for current weather data from OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch weather data
    const response = await axios.get(url);
    const weatherData = response.data;

    const forecastResponse = await axios.get(forecastUrl);
    const forecastData = forecastResponse.data.list;

    const groupedByDay = {};

    forecastData.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!groupedByDay[date]) {
            groupedByDay[date] = [];
        }
        groupedByDay[date].push(entry);
    });

    const result = Object.keys(groupedByDay).slice(1, 5).map(date => {
        const entries = groupedByDay[date];
        const minTemps = entries.map(e => e.main.temp_min); // Collect temperatures
        const maxTemps = entries.map(e => e.main.temp_max);
        const minTemp = Math.min(...minTemps);
        const maxTemp = Math.max(...maxTemps);

        const noonEntry = entries.reduce((closest, current) => {
            const currentHour = parseInt(current.dt_txt.split(" ")[1].split(":")[0], 10);
            return Math.abs(currentHour - 12) < Math.abs(parseInt(closest.dt_txt.split(" ")[1].split(":")[0], 10) - 12)
                ? current
                : closest;
        });

        const weatherDescription = noonEntry.weather[0].main;
        const dayOfWeek = new Date(noonEntry.dt * 1000).toLocaleString('en-US', { weekday: 'long' });

        return { date, dayOfWeek, minTemp, maxTemp, weatherDescription };
    });

    // Send the weather data back as JSON
    res.json({
      success: true,
      data: {
        weatherData,
        result,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong fetching the weather data.',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
