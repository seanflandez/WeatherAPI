document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "00BHzmA6gvhNS1kC69vBhHwf9aaHw21y";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchCurrentWeather(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchCurrentWeather(locationKey) {
        const currentWeatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No current weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = data.WeatherIcon;
        const iconUrl = `https://developer.accuweather.com/sites/default/files/${weatherIcon.toString().padStart(2, '0')}-s.png`;

        const currentWeatherContent = `
            <div class="current-weather">
                <h2>Current Weather</h2>
                <p>Temperature: ${temperature}°C</p>
                <img src="${iconUrl}" alt="Weather Icon">
                <p>Weather: ${weather}</p>
            </div>
        `;

        
        const currentWeatherDiv = document.createElement('div');
        currentWeatherDiv.classList.add('forecast-item');
        currentWeatherDiv.innerHTML = currentWeatherContent;

        weatherDiv.innerHTML = '';
        weatherDiv.appendChild(currentWeatherDiv);
    }

    function displayDailyForecast(forecasts) {
        let forecastContent = '';
        forecasts.forEach((forecast, index) => {
            const date = new Date(forecast.Date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const temperatureMin = forecast.Temperature.Minimum.Value;
            const temperatureMax = forecast.Temperature.Maximum.Value;
            const iconPhrase = forecast.Day.IconPhrase;
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${forecast.Day.Icon}-s.png`;

            forecastContent += `
                <div class="forecast-item">
                    <h2>${dayOfWeek}</h2>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p>Min Temperature: ${temperatureMin}°C</p>
                    <p>Max Temperature: ${temperatureMax}°C</p>
                    <p>Weather: ${iconPhrase}</p>
                </div>
            `;
        });

        weatherDiv.innerHTML += forecastContent;
    }

    function displayHourlyForecast(forecasts) {
        let forecastContent = `<div class="forecast-item"><h2>Hourly Forecast</h2>`;
        forecasts.forEach((forecast, index) => {
            const dateTime = new Date(forecast.DateTime);
            const temperature = forecast.Temperature.Value;
            const weatherIcon = forecast.WeatherIcon; 
            const iconUrl = `https://developer.accuweather.com/sites/default/files/${weatherIcon.toString().padStart(2, '0')}-s.png`;
            const weather = forecast.IconPhrase;

            forecastContent += `
                <div>
                    <p>${dateTime.toLocaleTimeString('en-US')}</p>
                    <img src="${iconUrl}" alt="Weather Icon">
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        forecastContent += `</div>`;

        weatherDiv.innerHTML += forecastContent;
    }
});
