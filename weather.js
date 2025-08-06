document.addEventListener('DOMContentLoaded', function(){
    const cityInput = document.getElementById("city-input")
    const searchButton = document.getElementById("search-button")
    const cityText = document.getElementById("city-text")
    const dateText = document.getElementById("date-text")
    const humidityPercentage = document.getElementById("humidity-percentage")
    const windSpeed = document.getElementById("wind-speed")
    const fiveDayContainer = document.getElementById("five-day-container")

    const api_key = ""

    searchButton.addEventListener('click', async function(){
        const data = await getWeatherData();
        if(data) displayFiveDayForecast(data);
    })

    async function getWeatherData(){
        if (cityInput.value === ''){
            alert("The text box is empty")
            return
        } else {
            const city = cityInput.value.trim()
            const query = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=imperial`
            try {
                const response = await fetch(query)
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json()
                return data
            } catch (error) {
                console.error("Could not fetch weather data:", error);
                alert("Failed to get weather data. Please check the city name and try again.");
            }
        }
    }


    function displayFiveDayForecast(data){
        fiveDayContainer.innerHTML = ""
        for(let i = 0; i < data.list.length; i+=8) {
            const tempData = Math.round(data.list[i].main.temp)
            const weatherType = data.list[i].weather[0].main
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
            const iconCode = data.list[i].weather[0].icon
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const day = new Date(data.list[i].dt_txt).toLocaleDateString('en-US', {
                weekday: 'long',
            })
            const dayElement = document.createElement("div")
            dayElement.classList.add("p-4", "bg-gradient-to-br", "from-blue-500", "to-blue-700", "rounded-xl", "shadow-sm", "text-center", "transform", "transition-transform", "hover:scale-105")
            dayElement.innerHTML = `
                    <p class="font-bold text-lg text-white">${day}</p>
                    <img class="icon-small mx-auto my-2" src=${iconUrl} alt="Weather Icon">
                    <p class="text-xl font-bold text-white">${tempData}°F</p>
                    <p class="text-sm text-white">${weatherTypes[weatherType]}</p>
                    `
            fiveDayContainer.appendChild(dayElement)
        }
    }

})

