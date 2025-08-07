document.addEventListener('DOMContentLoaded', function () {
    const cityInput = document.getElementById("city-input");
    const searchButton = document.getElementById("search-button");
    const cityText = document.getElementById("city-text");
    const dateText = document.getElementById("date-text");
    const humidityPercentage = document.getElementById("humidity-percentage");
    const windSpeed = document.getElementById("wind-speed");
    const fiveDayContainer = document.getElementById("five-day-container");
    const weatherDisplay = document.getElementById("weather-display");
    const currentTempText = document.getElementById("current-temp");
    const currentWeatherText = document.getElementById("current-weather");
    const fiveDayForecast = document.getElementById("five-day-forecast");
    const currentWeatherIcon = document.getElementById("current-weather-icon");

    const api_key = "";

    searchButton.addEventListener('click', async function () {
        const dataFive = await getFiveDayWeatherData();
        const dataToday = await getTodayWeatherData();
        if (dataToday) displayTodaysWeather(dataToday);
        if (dataFive) displayFiveDayForecast(dataFive);
    });

    async function getTodayWeatherData() {
        const city = cityInput.value.trim();
        if (city === '') {
            alert("The text box is empty");
            return;
        }
        const query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=imperial`;
        try {
            const response = await fetch(query);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Could not fetch current weather:", error);
            alert("Failed to get current weather. Please check the city name and try again.");
        }
    }

    async function getFiveDayWeatherData() {
        const city = cityInput.value.trim();
        if (city === '') {
            alert("The text box is empty");
            return;
        }
        const query = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=imperial`;
        try {
            const response = await fetch(query);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Could not fetch forecast:", error);
            alert("Failed to get forecast. Please check the city name and try again.");
        }
    }

    function displayFiveDayForecast(data) {
        fiveDayForecast.classList.remove("hidden");
        fiveDayContainer.innerHTML = "";

        for (let i = 0; i < data.list.length; i += 8) {
            const entry = data.list[i];
            if (!entry || !entry.main || !entry.weather) continue;

            const tempData = Math.round(entry.main.temp);
            const weatherType = entry.weather[0].main;
            const weatherTypes = {
                "Thunderstorm": "Stormy",
                "Drizzle": "Light Rain",
                "Rain": "Rainy",
                "Snow": "Snowy",
                "Mist": "Misty",
                "Smoke": "Smoky",
                "Haze": "Hazy",
                "Dust": "Dusty",
                "Fog": "Foggy",
                "Sand": "Sandy",
                "Ash": "Ashy",
                "Squall": "Windy",
                "Tornado": "Tornado Conditions",
                "Clear": "Clear Skies",
                "Clouds": "Cloudy"
            };
            const readableWeather = weatherTypes[weatherType] || weatherType;

            const iconCode = entry.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const day = new Date(entry.dt_txt).toLocaleDateString('en-US', {
                weekday: 'long',
            });

            const dayElement = document.createElement("div");
            dayElement.classList.add(
                "p-4", "bg-gradient-to-br", "from-blue-500", "to-blue-700",
                "rounded-xl", "shadow-sm", "text-center", "transform",
                "transition-transform", "hover:scale-105"
            );
            dayElement.innerHTML = `
                <p class="font-bold text-lg text-white">${day}</p>
                <img class="icon-small mx-auto my-2" src="${iconUrl}" alt="Weather Icon">
                <p class="text-xl font-bold text-white">${tempData}°F</p>
                <p class="text-sm text-white">${readableWeather}</p>
            `;
            fiveDayContainer.appendChild(dayElement);
        }
    }

    function displayTodaysWeather(data) {
        weatherDisplay.classList.remove("hidden");

        const todayDate = new Date().toLocaleString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        const currentTemp = Math.round(data.main.temp);
        const currentWeather = data.weather[0].main;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const humidity = data.main.humidity;
        const wind = data.wind.speed;

        cityText.textContent = cityInput.value;
        dateText.textContent = todayDate;
        currentTempText.textContent = `${currentTemp}°F`;
        currentWeatherText.textContent = currentWeather;
        currentWeatherIcon.setAttribute('src', iconUrl);
        humidityPercentage.textContent = `${humidity}%`;
        windSpeed.textContent = `${wind} mph`;
    }
});
