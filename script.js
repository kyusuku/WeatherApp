document.addEventListener('click', function (event) {
    const elementsToBlur = ['Textbox', 'city', 'icon', 'temp', 'container-top']; // Removed 'result'

    elementsToBlur.forEach((id) => {
        const element = document.getElementById(id);
        if (element && !element.contains(event.target)) {
            element.blur(); // Blur the element if the click is outside
        }
    });
});


const resultTimeZone = document.getElementById('timezone'); // Make global variable, so can be updated 

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('Button');
    const textbox = document.getElementById('Textbox');
    const resultDiv = document.getElementById('container-mid'); // Now correctly accessed
    const resultIcon = document.getElementById('icon');
    const resultCity = document.getElementById('city');
    const resultTemp = document.getElementById('temp');
    const resultDesc = document.getElementById('desc');
    const resultMinmax = document.getElementById('minmax');
    const resultHumidity = document.getElementById('humidity');
    const resultWind = document.getElementById('wind');
    const resultFeelsLike = document.getElementById('feels-like');

    const errorMessage = document.getElementById('errorMessage'); 

    // Common function to fetch and display weather data
    const fetchWeather = async () => {
        const city = textbox.value.trim();

        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Remove error class if present
        textbox.classList.remove('error');

        if (!city) {
            textbox.classList.add('error');
            errorMessage.textContent = 'Please enter a city name.';
            errorMessage.style.display = 'block';
            return;
        }

        try {
            // Our Express server runs on localhost:3000 by default
            const response = await fetch(`https://weatherapp-krb6.onrender.com/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (data.success) {
                const weatherData = data.data;
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const weatherMain = weatherData.weather[0].main;
                const name = weatherData.name;
                const country = weatherData.sys.country; 

                const iconName = getWeatherIcon(weatherMain);

                // Display the results
                if (resultDiv) { resultDiv.style.display = 'flex';}
                if (resultIcon) {resultIcon.innerHTML = `<img src="${iconName}" alt="Weather Icon" style="width: 5em; height: 5em;">`;}
                if (resultCity) {resultCity.innerHTML = `<p>${capitalizeFirstLetter(name)}, ${country}</p>`;}
                if (resultTemp) {resultTemp.innerHTML = `<p>${Math.round(temp * 10) / 10}°</p>`;}
                if (resultDesc) {resultDesc.innerHTML = `<p>${capitalizeFirstLetter(description)}</p>`;}
                if (resultMinmax) {resultMinmax.innerHTML = `<p>${Math.round(weatherData.main.temp_min * 10) / 10}° / ${Math.round(weatherData.main.temp_max * 10) / 10}°</p>`;}
                if (resultHumidity) {resultHumidity.innerHTML = `<p>Humidity: ${weatherData.main.humidity}%</p>`;}
                if (resultWind) {resultWind.innerHTML = `<p>Wind Speed: ${weatherData.wind.speed}m/s</p>`;}
                if (resultFeelsLike) {resultFeelsLike.innerHTML = `<p>Feels Like: ${Math.round(weatherData.main.feels_like * 10) / 10}°</p>`;}

                if (resultTimeZone) {
                  updateTime(weatherData.timezone);
                }

            } else {
                // Display error message
                if (errorMessage) {
                    errorMessage.textContent = data.message || 'City not found. Please try again.';
                    errorMessage.style.display = 'block';
                }
                
                // Hide the result div
                if (resultDiv) {
                    resultDiv.style.display = 'none';
                }
            }
        } catch (error) {
            console.error(error);
            if (errorMessage) {
                errorMessage.textContent = 'Something went wrong. Please try again later.';
                errorMessage.style.display = 'block';
            }
            
            // Hide the result div
            if (resultDiv) {
                resultDiv.style.display = 'none';
            }
        }
    };

    // Event listener for the search button
    if (button) {
        button.addEventListener('click', fetchWeather);
    }

    // Event listener for the Enter key
    if (textbox) {
        textbox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission
                fetchWeather();
            }
        });
    }
});

// Utility function to capitalize the first letter
function capitalizeFirstLetter(val) {
    if (!val) return '';
    return String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase();
}

function getLocalTimeFromUTCOffset(utcOffsetInSeconds) {
    // Get the current time in milliseconds since the Unix epoch (UTC)
    const nowUTC = Date.now();
  
    // Calculate the target time in milliseconds by adding the UTC offset
    const targetTimeInMs = nowUTC + utcOffsetInSeconds * 1000;
  
    // Create a new Date object with the target time
    const targetDate = new Date(targetTimeInMs);
  
    // Extract UTC components to avoid local time zone interference
    const day = targetDate.getUTCDate(); // Day of the month (1-31)
    const monthNumber = targetDate.getUTCMonth(); // Month index (0-11)
    const year = targetDate.getUTCFullYear(); // Full year (e.g., 2024)
    const hours = targetDate.getUTCHours().toString().padStart(2, '0'); // Hours (00-23)
    const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0'); // Minutes (00-59)
  
    // Array to map month index to month name
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    // Get the month name from the array
    const month = monthNames[monthNumber];
  
    // Format the date string as "7 January 2024"
    const dateString = `${day} ${month} ${year}`;
  
    // Format the time string as "HH:MM"
    const timeString = `${hours}:${minutes}`;
  
    // Combine date and time
    return `${dateString}, ${timeString}`; // e.g., "7 January 2024 14:30"
}

function updateTime(data) {
  resultTimeZone.innerHTML =  `<p>${getLocalTimeFromUTCOffset(data)}</p>`;
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
