document.addEventListener("DOMContentLoaded", function() {
    let locationInput = document.getElementById("location-input");
    let locationOutput = document.getElementById("location");
    let searchButton = document.getElementById("btn-search");
    let tempOutput = document.getElementById("temp");
    let timeDateOutput = document.getElementById("time-date");

    searchButton.addEventListener('click', getWeather);
    locationInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            getWeather();
        }
    });

    let weather = async function checkWeather(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=00df1e5642dcef4dfda6ce3d91b549d7`);
            if (!response.ok) {
                throw new Error(`City not found: ${city}`);
            }
            let data = await response.json();
            
            // Update the paragraph with the new value
            tempOutput.textContent = `${Math.round(data.main.temp)}°C`;
            locationOutput.textContent = `${data.location}`
        } catch (error) {
            console.log(error);
            tempOutput.textContent = `Error: ${error.message}`;
        }
    }

    function getWeather() {
        let city = locationInput.value;
        if (city) {
            weather(city);
        }
    }

    function updateTimeDate() {
        let now = new Date();
        let formattedDate = now.toLocaleDateString();
        let formattedTime = now.toLocaleTimeString();
        timeDateOutput.textContent = `${formattedDate} ${formattedTime}`;
    }

    // Update the time and date every second
    setInterval(updateTimeDate, 1000);

    // Initial call to display the time and date immediately
    updateTimeDate();
});