// DOM selectors
let locationInput = document.getElementById('location-input');
let locationOutput = document.getElementById('location');
let searchButton = document.getElementById('btn-search');
let tempOutput = document.getElementById('temp');
let timeDateOutput = document.getElementById('time-date');
let windSpeed = document.getElementById('speed-wind');
let humidityOutput = document.getElementById('humidity');
let feelsLike = document.getElementById('feels-like');
let useLocationButton = document.getElementById('btn-location');
let weatherImage = document.getElementById('weather-image');
let timeVisualization = document.getElementById('visualization-of-time');
let toggleBtn = document.getElementById('toggle');
let thermometer = document.getElementsByClassName('thermometer')[0];


const defaultCity = 'Athens';

document.addEventListener('DOMContentLoaded', function () {
  checkWeather(defaultCity);

  // Event listeners
  searchButton.addEventListener('click', getWeather);
  locationInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      getWeather();
    }
  });

  // Event listener for the toggle button
  toggleBtn.addEventListener('click', changeUnit);

  useLocationButton.addEventListener('click', getWeatherByLocation);

  let isCelsius = true;
  // Function to change the unit
  function changeUnit() {
    isCelsius = !isCelsius; // Toggle the unit
    updateTemperatureDisplay(); // Update the temperature display
  }

  // Function to update the temperature display
  
  thermometer.src = './img/temp/thermometer-celsius.svg';

  function updateTemperatureDisplay() {
    let temp = parseFloat(tempOutput.innerText);
    let feels = parseFloat(feelsLike.innerText);
    if (isCelsius) {
      // Convert to Celsius if currently in Fahrenheit
      temp = (temp - 32) * (5 / 9);
      feels = (feels - 32) * (5 / 9);
      tempOutput.innerText = `${Math.round(temp)} `;
      feelsLike.innerText = `${Math.round(feels)} `;
      thermometer.src = `./img/temp/thermometer-celsius.svg`;
    } else {
      // Convert to Fahrenheit if currently in Celsius
      temp = (temp * 9) / 5 + 32;
      feels = (feels * 9) / 5 + 32;
      tempOutput.innerText = `${Math.round(temp)} `;
      feelsLike.innerText = `${Math.round(feels)} `;
      thermometer.src = `./img/thermometer-fahrenheit.svg`;
    }
  }

  // For time update
  updateTimeDate();
  setInterval(updateTimeDate, 1000);
});
function updateTimeDate() {
  let now = new Date();
  let formattedDate = now.toLocaleDateString();
  let formattedTime = now.toLocaleTimeString();
  timeDateOutput.textContent = `${formattedDate} ${formattedTime}`;
}

function updateWeatherUI(data) {
  tempOutput.innerText = `${Math.round(data.main.temp)}`;
  locationOutput.innerText = `${data.name}`;
  windSpeed.innerText = `${Math.round(data.wind.speed)} Km/h`;
  humidityOutput.innerText = `${data.main.humidity}`;
  feelsLike.innerText = `${Math.round(data.main.feels_like)}`;

  
  let now = new Date();
  let currentHour = now.getHours();

  // Time of day logic
  let timeOfDay;

  if (currentHour >= 0 && currentHour < 6) {
    // Late night and early morning (12 AM to 5:59 AM)
    timeVisualization.src = 'img/time of day/time-late-night.svg';
    timeOfDay = 'night';
  } else if (currentHour >= 6 && currentHour < 12) {
    // Morning (6 AM to 11:59 AM)
    timeVisualization.src = 'img/time of day/time-morning.svg';
    timeOfDay = 'day';
  } else if (currentHour >= 12 && currentHour < 18) {
    // Afternoon (12 PM to 5:59 PM)
    timeVisualization.src = 'img/time of day/time-late-morning.svg';
    timeOfDay = 'day';
  } else if (currentHour >= 18 && currentHour < 21) {
    // Evening (6 PM to 8:59 PM)
    timeVisualization.src = 'img/time of day/time-late-evening.svg';
    timeOfDay = 'night';
  } else if (currentHour >= 21 && currentHour <= 23) {
    // Night (9 PM to 11:59 PM)
    timeVisualization.src = 'img/time of day/time-late-night.svg';
    timeOfDay = 'night';
  }

  // Weather condition logic based on both time of day and weather
  let weatherCondition = data.weather[0].main;
  if (weatherCondition === 'Clouds') {
    if (timeOfDay === 'day') {
      weatherImage.src = './img/day/partly-cloudy-day.svg';
    } else {
      weatherImage.src = './img/night/partly-cloudy-night.svg';
    }
  } else if (weatherCondition === 'Clear') {
    if (timeOfDay === 'day') {
      weatherImage.src = './img/day/clear-day.svg';
    } else {
      weatherImage.src = './img/night/clear-night.svg';
    }
  } else if (weatherCondition === 'Rain') {
    if (timeOfDay === 'day') {
      weatherImage.src = './img/day/partly-cloudy-day-rain.svg';
    } else {
      weatherImage.src = './img/night/partly-cloudy-night-rain.svg';
    }
  } else if (weatherCondition === 'Drizzle') {
    if (timeOfDay === 'day') {
      weatherImage.src = './img/day/partly-cloudy-day-drizzle.svg';
    } else {
      weatherImage.src = './img/night/partly-cloudy-night-drizzle.svg';
    }
  } else if (weatherCondition === 'Mist') {
    if (timeOfDay === 'day') {
      weatherImage.src = './img/day/partly-cloudy-day-mist.svg';
    } else {
      weatherImage.src = './img/night/partly-cloudy-night-mist.svg';
    }
  } else if (weatherCondition === 'Snow') {
    if (timeOfDay === 'day') {
      weatherImage.src = './img/day/partly-cloudy-day-snow.svg';
    } else {
      weatherImage.src = './img/night/partly-cloudy-night-snow.svg';
    }
  }
}
//   async function that takes API and returns data based on city input
async function checkWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=00df1e5642dcef4dfda6ce3d91b549d7`
    );
    if (!response.ok) {
      throw new Error(`City not found: ${city}`);
    }
    let data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.log(error);
    alert(error);
  }
}

// async function that takes API and returns data based on geolocation
async function checkWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=00df1e5642dcef4dfda6ce3d91b549d7`
    );
    if (!response.ok) {
      throw new Error(
        `Unable to retrieve weather data for coordinates: ${lat}, ${lon}`
      );
    }
    let data = await response.json();
    updateWeatherUI(data);
  } catch (error) {
    console.log(error);
    alert(error);
  }
}

// Function to get weather based on users input
function getWeather() {
  let city = locationInput.value;
  if (city) {
    checkWeather(city);
    locationInput.value = '';
  }
}

// Function to get weather based on the user's current geolocation
// this code i took it ready from chatGPT just to include it, it was so hard for me (not proud,but still) :)
function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        checkWeatherByCoordinates(lat, lon);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('User denied the request for Geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            alert('The request to get user location timed out.');
            break;
          case error.UNKNOWN_ERROR:
            alert('An unknown error occurred.');
            break;
        }
      }
    );
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}
