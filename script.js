document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('Button');
  const textbox = document.getElementById('Textbox');
  const resultDiv = document.getElementById('result');
  const resultIcon = document.getElementById('icon');
  const resultCity = document.getElementById('city');
  const resultTemp = document.getElementById('temp');
  const resultDesc = document.getElementById('desc');
  const resultMinmax = document.getElementById('minmax');

  // Common function to fetch and display weather data
  const fetchWeather = async () => {
      const city = textbox.value.trim();

      // Remove error class if present
      textbox.classList.remove('error');

      if (!city) {
          textbox.classList.add('error');
          return;
      }

      try {
          // Our Express server runs on localhost:3000 by default
          const response = await fetch(`http://localhost:3000/weather?city=${city}`);
          const data = await response.json();

          if (data.success) {
              const weatherData = data.data;
              const temp = weatherData.main.temp;
              const description = weatherData.weather[0].description;
              const weatherMain = weatherData.weather[0].main;

              const iconName = getWeatherIcon(weatherMain);

              resultDiv.style.display = 'block';
              resultIcon.innerHTML = `<img src="${iconName}" alt="Weather Icon" style="width: 8em; height: 8em;">`;
              resultCity.innerHTML = `<h2>${capitalizeFirstLetter(city)}</h2>`;
              resultTemp.innerHTML = `<p>${Math.round(temp * 10) / 10}°</p>`;
              resultDesc.innerHTML = `<p>${capitalizeFirstLetter(description)}</p>`;
              resultMinmax.innerHTML = `<p>${weatherData.main.temp_min}° / ${weatherData.main.temp_max}°</p>`;
          } else {
              // Display an error message if the response indicates failure
              resultDiv.style.display = 'block';
              resultDiv.textContent = 'City not found. Please try again.';
          }
      } catch (error) {
          console.error(error);
          resultDiv.style.display = 'block';
          resultDiv.textContent = 'Something went wrong. Please try again later.';
      }
  };

  // Event listener for the search button
  button.addEventListener('click', fetchWeather);

  // Event listener for the Enter key
  textbox.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent form submission
          fetchWeather();
      }
  });
});

// Utility function to capitalize the first letter
function capitalizeFirstLetter(val) {
  let toReturn = String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase();
  if (toReturn.length > 12) {
      return toReturn.substring(0, 12);
  }
  return toReturn;
}

// Utility function to get the weather icon based on weather conditions
function getWeatherIcon(weatherMain) {
  // Convert to lowercase so we don’t worry about capitalization
  const mainLower = weatherMain.toLowerCase();

  switch (mainLower) {
      case 'clear':
      case 'sunny':
          return 'design/icons/clear-day.svg'; // Path to sunny icon
      case 'clouds':
          return 'design/icons/cloudy.svg'; // Path to cloudy icon
      case 'rain':
      case 'drizzle':
          return 'design/icons/rain.svg'; // Path to rain icon
      case 'thunderstorm':
          return 'design/icons/thunderstorms.svg'; // Path to thunderstorm icon
      case 'snow':
          return 'design/icons/snow.svg'; // Path to snow icon
      case 'mist':
      case 'fog':
      case 'haze':
      case 'smoke':
          return 'design/icons/fog.svg'; // Path to fog icon
      default:
          return 'design/icons/not-available.svg'; // Fallback icon
  }
}