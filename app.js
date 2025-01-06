const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS so your frontend can call your backend from a different origin
app.use(cors());

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

    // Fetch weather data
    const response = await axios.get(url);
    const weatherData = response.data;

    // Send the weather data back as JSON
    res.json({
      success: true,
      data: weatherData,
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
