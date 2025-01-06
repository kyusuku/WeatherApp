document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('Button');
    const textbox = document.getElementById('Textbox');
    const resultDiv = document.getElementById('result');
    const resultIcon = document.getElementById('icon');
    const resultCity = document.getElementById('city');
    const resultTemp = document.getElementById('temp');
    const resultDesc = document.getElementById('desc');
    const resultMinmax = document.getElementById('minmax');
  
    button.addEventListener('click', async () => {
      const city = textbox.value.trim();
  
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
          resultIcon.innerHTML = `<span class="material-symbols-outlined" style="font-size:35px;">${iconName}</span>`;
          resultCity.innerHTML = `<h2>${capitalizeFirstLetter(city)}</h2>`;
          resultTemp.innerHTML = `<p>${temp}°</p>`;
          resultDesc.innerHTML = `<p>${capitalizeFirstLetter(description)}</p>`;
          resultMinmax.innerHTML = `<p>${weatherData.main.temp_min}°/ ${weatherData.main.temp_max}°</p>`;
  
        //   resultDiv.innerHTML = `
        //     <h2>${capitalizeFirstLetter(city)}</h2>
        //     <span class="material-symbols-outlined" style="font-size:35px;">${iconName}</span>
        //     <!--<p>${iconName}</p>-->
        //     <p>${temp}°</p>
        //     <p>${capitalizeFirstLetter(description)}</p>
        //     <p>${weatherData.main.temp_min}°/ ${weatherData.main.temp_max}°</p>
        //   `;
        } else {
            //textbox.classList.add('error');
        }
      } catch (error) {
        console.error(error);
        resultDiv.textContent = 'Something went wrong.';
      }
    });
  });
  
function capitalizeFirstLetter(val) {
    let toReturn =  String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase();
    if (toReturn.length > 12) {
        return toReturn.substring(0, 12);
    }
    return toReturn;
}

function getWeatherIcon(weatherMain) {
    // Convert to lowercase so we don’t worry about capitalization
    const mainLower = weatherMain.toLowerCase();
  
    switch (mainLower) {
      case 'clear':
      case 'sunny':
        return 'wb_sunny';          // material-icon "sunny"
      case 'clouds':
        return 'cloud';          // material-icon "cloud"
      case 'rain':
      case 'drizzle':
        return 'rainy';           // material-icon "rain"
      case 'thunderstorm':
        return 'thunderstorm';   // material-icon "thunderstorm"
      case 'snow':
        return 'ac_unit';           // material-icon "snow"
      case 'mist':
      case 'fog':
      case 'haze':
      case 'smoke':
        return 'foggy';            // material-icon "fog"
      default:
        // fallback if none of the above matched
        return 'cloud_queue';    
    }
  }
  

