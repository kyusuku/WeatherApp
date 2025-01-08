document.addEventListener('click', function (event) {
    const elementsToBlur = ['Textbox', 'city', 'icon', 'temp', 'container-top'];

    elementsToBlur.forEach((id) => {
        const element = document.getElementById(id);
        if (element && !element.contains(event.target)) {
            element.blur(); // Blur the element if the click is outside
        }
    });
});

const resultTimeZone = document.getElementById('timezone'); 

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('Button');
    const textbox = document.getElementById('Textbox');
    const resultDiv = document.getElementById('container-mid');
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

        // Hide error messages
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
        textbox.classList.remove('error');

        if (!city) {
            // Show an error if empty
            textbox.classList.add('error');
            errorMessage.textContent = 'Please enter a city name.';
            errorMessage.style.display = 'block';
            // Hide results
            resultDiv.classList.remove('show');
            return;
        }

        try {
            // Call your weather API endpoint (local or remote)
            const response = await fetch(`https://weatherappprivate.onrender.com/weather?city=${encodeURIComponent(city)}`);
            const data = await response.json();

            if (data.success) {
                const weatherData = data.data;
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].description;
                const weatherMain = weatherData.weather[0].main;
                const name = weatherData.name;
                const country = weatherData.sys.country; 

                // Utility: pick an icon
                const iconName = getWeatherIcon(weatherMain);

                // Fill in the DOM
                if (resultIcon) {
                    resultIcon.innerHTML = `<img src="${iconName}" alt="Weather Icon" style="width: 5em; height: 5em;">`;
                }
                if (resultCity) {
                    resultCity.innerHTML = `<p>${capitalizeFirstLetter(name)}, ${country}</p>`;
                }
                if (resultTemp) {
                    resultTemp.innerHTML = `<p>${Math.round(temp * 10) / 10}°</p>`;
                }
                if (resultDesc) {
                    resultDesc.innerHTML = `<p>${capitalizeFirstLetter(description)}</p>`;
                }
                if (resultMinmax) {
                    resultMinmax.innerHTML = `<p>${Math.round(weatherData.main.temp_min * 10) / 10}° / ${Math.round(weatherData.main.temp_max * 10) / 10}°</p>`;
                }
                if (resultHumidity) {
                    resultHumidity.innerHTML = `<p>Humidity: ${weatherData.main.humidity}%</p>`;
                }
                if (resultWind) {
                    resultWind.innerHTML = `<p>Wind Speed: ${weatherData.wind.speed} m/s</p>`;
                }
                if (resultFeelsLike) {
                    resultFeelsLike.innerHTML = `<p>Feels Like: ${Math.round(weatherData.main.feels_like * 10) / 10}°</p>`;
                }

                // Update time zone if present
                if (resultTimeZone && typeof weatherData.timezone !== 'undefined') {
                    updateTime(weatherData.timezone);
                }

                // Finally, show the results container with a smooth “open” effect
                resultDiv.classList.add('show');

            } else {
                // Show error from server
                if (errorMessage) {
                    errorMessage.textContent = data.message || 'City not found. Please try again.';
                    errorMessage.style.display = 'block';
                }
                // Hide the result container
                resultDiv.classList.remove('show');
            }
        } catch (error) {
            console.error(error);
            errorMessage.textContent = 'Something went wrong. Please try again later.';
            errorMessage.style.display = 'block';
            // Hide results
            resultDiv.classList.remove('show');
        }
    };

    // On click
    if (button) {
        button.addEventListener('click', fetchWeather);
    }

    // On Enter key
    if (textbox) {
        textbox.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                fetchWeather();
            }
        });
    }
});

/* Utility: Capitalize first letter */
function capitalizeFirstLetter(val) {
    if (!val) return '';
    return String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase();
}

/* Utility: Convert UTC offset into local time string */
function getLocalTimeFromUTCOffset(utcOffsetInSeconds) {
    const nowUTC = Date.now();
    const targetTimeInMs = nowUTC + utcOffsetInSeconds * 1000;
    const targetDate = new Date(targetTimeInMs);

    const day = targetDate.getUTCDate();
    const monthNumber = targetDate.getUTCMonth();
    const year = targetDate.getUTCFullYear();
    const hours = targetDate.getUTCHours().toString().padStart(2, '0');
    const minutes = targetDate.getUTCMinutes().toString().padStart(2, '0');

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[monthNumber];

    const dateString = `${day} ${month} ${year}`;
    const timeString = `${hours}:${minutes}`;

    return `${dateString}, ${timeString}`;
}

/* Update the timezone element */
function updateTime(utcOffset) {
    const resultTimeZone = document.getElementById('timezone');
    if (resultTimeZone) {
        resultTimeZone.innerHTML = `<p>${getLocalTimeFromUTCOffset(utcOffset)}</p>`;
    }
}

/* Utility: pick an icon based on weatherMain */
function getWeatherIcon(weatherMain) {
    const mainLower = weatherMain.toLowerCase();

    switch (mainLower) {
        case 'clear':
        case 'sunny':
            return 'design/icons/clear-day.svg';
        case 'clouds':
            return 'design/icons/cloudy.svg';
        case 'rain':
        case 'drizzle':
            return 'design/icons/rain.svg';
        case 'thunderstorm':
            return 'design/icons/thunderstorms.svg';
        case 'snow':
            return 'design/icons/snow.svg';
        case 'mist':
        case 'fog':
        case 'haze':
        case 'smoke':
            return 'design/icons/fog.svg';
        default:
            return 'design/icons/not-available.svg';
    }
}
