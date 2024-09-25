


// DOM selectors

let locationInput = document.getElementById('location-input');
let locationOutput = document.getElementById('location');
let searchButton = document.getElementById('btn-search');
let tempOutput = document.getElementById('temp');
let timeDateOutput = document.getElementById('time-date');
let windSpeed = document.getElementById('speed-wind');
let humidityOutput = document.getElementById('humidity');
let feelsLike = document.getElementById('feels-like');

document.addEventListener('DOMContentLoaded', function () {
  searchButton.addEventListener('click', getWeather);
  locationInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      getWeather();
    }
  });


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

//   async function that takes API and returns data
async function checkWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=00df1e5642dcef4dfda6ce3d91b549d7`
    );
    if (!response.ok) {
      throw new Error(`City not found: ${city}`);
    }
    let data = await response.json();

    // add value to temperature, wind speed humidity and city name after i click search
    tempOutput.innerText = `${Math.round(data.main.temp)}°C`;
    locationOutput.innerText = `${data.name}`;
    windSpeed.innerText = `${Math.round(data.wind.speed)} Km/h`;
    humidityOutput.innerText = `${data.main.humidity} %`;
    feelsLike.innerText = `${Math.round(data.main.feels_like)}°C`
  } catch (error) {
    console.log(error);
    tempOutput.textContent = `Error: ${error.message}`;
  }
}

function getWeather() {
  let city = locationInput.value;
  if (city) {
    checkWeather(city);
  }
}
