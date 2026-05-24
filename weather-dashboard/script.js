// Weather Dashboard Application
// Using OpenWeatherMap API

// API Configuration
const API_KEY = 'b6fd4967fa519a784bfd818ba480287e'; // Free tier API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';
const AQI_API_URL = 'https://api.openweathermap.org/data/3.0';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const mainContent = document.getElementById('mainContent');
const suggestionsDiv = document.getElementById('suggestions');
const recentSection = document.getElementById('recentSection');
const recentCities = document.getElementById('recentCities');

// State
let currentCity = null;
let currentWeather = null;
let forecastData = null;
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// ===========================
// INITIALIZATION
// ===========================

window.addEventListener('DOMContentLoaded', () => {
    displayRecentCities();
    loadDefaultCity();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    searchInput.addEventListener('input', handleSuggestions);
    locationBtn.addEventListener('click', handleGeolocation);
}

// ===========================
// SEARCH & GEOLOCATION
// ===========================

function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    searchCity(city);
}

function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
            showLoading(false);
            showError('Unable to access your location. Please enable location permissions.');
        }
    );
}

// Search City
async function searchCity(city) {
    showLoading(true);
    try {
        const response = await fetch(
            `${GEO_API_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.length === 0) {
            showError(`City "${city}" not found. Please try another search.`);
            showLoading(false);
            return;
        }

        const { lat, lon } = data[0];
        currentCity = data[0];
        fetchWeatherByCoords(lat, lon);
    } catch (err) {
        showError('Error searching for city. Please try again.');
        showLoading(false);
    }
}

// Load Default City
function loadDefaultCity() {
    if (recentSearches.length > 0) {
        searchCity(recentSearches[0]);
    } else {
        searchCity('London'); // Default city
    }
}

// Handle City Suggestions
async function handleSuggestions(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        suggestionsDiv.classList.remove('show');
        return;
    }

    try {
        const response = await fetch(
            `${GEO_API_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
        );
        const data = await response.json();

        if (data.length === 0) {
            suggestionsDiv.classList.remove('show');
            return;
        }

        suggestionsDiv.innerHTML = data.map(city => `
            <div class="suggestion-item" onclick="selectSuggestion('${city.name}', ${city.lat}, ${city.lon})">
                ${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}
            </div>
        `).join('');
        suggestionsDiv.classList.add('show');
    } catch (err) {
        suggestionsDiv.classList.remove('show');
    }
}

function selectSuggestion(name, lat, lon) {
    searchInput.value = name;
    suggestionsDiv.classList.remove('show');
    currentCity = { name, lat, lon };
    fetchWeatherByCoords(lat, lon);
}

// ===========================
// FETCH WEATHER DATA
// ===========================

async function fetchWeatherByCoords(lat, lon) {
    try {
        const [weatherRes, forecastRes, aqiRes] = await Promise.all([
            fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
            fetch(`${WEATHER_API_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        ]);

        const [weather, forecast, aqi] = await Promise.all([
            weatherRes.json(),
            forecastRes.json(),
            aqiRes.json()
        ]);

        currentWeather = weather;
        forecastData = forecast;

        displayWeather(weather, forecast, aqi);
        addRecentSearch(weather.name);
        showLoading(false);
    } catch (err) {
        showError('Error fetching weather data. Please try again.');
        showLoading(false);
    }
}

// ===========================
// DISPLAY WEATHER DATA
// ===========================

function displayWeather(weather, forecast, aqi) {
    // Current Weather
    document.getElementById('cityName').textContent = weather.name;
    document.getElementById('countryName').textContent = weather.sys.country;
    document.getElementById('temperature').textContent = Math.round(weather.main.temp);
    document.getElementById('weatherDesc').textContent = weather.weather[0].main;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(weather.main.feels_like)}°C`;
    document.getElementById('weatherIcon').src = getWeatherIcon(weather.weather[0].icon);
    document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${weather.wind.speed.toFixed(1)} m/s`;
    document.getElementById('pressure').textContent = `${weather.main.pressure} hPa`;
    document.getElementById('visibility').textContent = `${(weather.visibility / 1000).toFixed(1)} km`;
    document.getElementById('clouds').textContent = `${weather.clouds.all}%`;
    document.getElementById('updateTime').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;

    // Sun & Moon Info
    document.getElementById('sunrise').textContent = formatTime(weather.sys.sunrise);
    document.getElementById('sunset').textContent = formatTime(weather.sys.sunset);

    // UV Index (mock data - would need separate API)
    document.getElementById('uvIndex').textContent = getUVIndex(new Date(), weather.sys.sunset - weather.sys.sunrise);

    // Air Quality
    displayAirQuality(aqi);

    // Forecast
    displayForecast(forecast);

    // Hourly Forecast
    displayHourlyForecast(forecast);

    // Show main content
    mainContent.classList.remove('hidden');
    error.classList.add('hidden');
}

function displayAirQuality(aqi) {
    if (!aqi.list || aqi.list.length === 0) {
        document.getElementById('aqiValue').textContent = '--';
        document.getElementById('aqiStatus').textContent = 'Data unavailable';
        document.getElementById('pm25').textContent = '--';
        document.getElementById('pm10').textContent = '--';
        document.getElementById('o3').textContent = '--';
        document.getElementById('no2').textContent = '--';
        return;
    }

    const current = aqi.list[0];
    const main = current.main.aqi;
    const components = current.components;

    const aqiStatus = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'][main - 1] || 'Unknown';
    const aqiColor = ['#10b981', '#eab308', '#f97316', '#ef4444', '#7c3aed'][main - 1];

    document.getElementById('aqiValue').textContent = main;
    document.getElementById('aqiStatus').textContent = aqiStatus;
    document.getElementById('aqiStatus').style.color = aqiColor;
    document.querySelector('.aqi-circle').style.borderColor = aqiColor;

    document.getElementById('pm25').textContent = components.pm2_5 ? components.pm2_5.toFixed(1) : '--';
    document.getElementById('pm10').textContent = components.pm10 ? components.pm10.toFixed(1) : '--';
    document.getElementById('o3').textContent = components.o3 ? components.o3.toFixed(1) : '--';
    document.getElementById('no2').textContent = components.no2 ? components.no2.toFixed(1) : '--';
}

function displayForecast(forecast) {
    const dailyForecasts = {};

    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString();

        if (!dailyForecasts[dayKey]) {
            dailyForecasts[dayKey] = item;
        }
    });

    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = Object.values(dailyForecasts)
        .slice(0, 5)
        .map(item => `
            <div class="forecast-card">
                <div class="forecast-date">${new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div class="forecast-day">${new Date(item.dt * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                <div class="forecast-icon">
                    <img src="${getWeatherIcon(item.weather[0].icon)}" alt="${item.weather[0].main}">
                </div>
                <div class="forecast-desc">${item.weather[0].main}</div>
                <div class="forecast-temps">
                    <span class="temp-high">${Math.round(item.main.temp_max)}°</span>
                    <span class="temp-low">${Math.round(item.main.temp_min)}°</span>
                </div>
                <div class="forecast-pop">Rain: ${Math.round(item.pop * 100)}%</div>
            </div>
        `).join('');
}

function displayHourlyForecast(forecast) {
    const hourlyContainer = document.getElementById('hourlyContainer');
    hourlyContainer.innerHTML = forecast.list
        .slice(0, 24)
        .map(item => `
            <div class="hourly-item">
                <div class="hourly-time">${new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                <div class="hourly-icon">
                    <img src="${getWeatherIcon(item.weather[0].icon)}" alt="${item.weather[0].main}">
                </div>
                <div class="hourly-temp">${Math.round(item.main.temp)}°</div>
                <div class="hourly-rain">💧 ${Math.round(item.pop * 100)}%</div>
            </div>
        `).join('');
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function getUVIndex(date, dayLength) {
    // Simplified UV index calculation based on time of day
    const hour = date.getHours();
    if (hour < 6 || hour > 18) return 0;
    const midday = (hour - 6) / 12 * 10;
    return Math.round(Math.max(0, Math.min(11, midday)));
}

function addRecentSearch(cityName) {
    if (!recentSearches.includes(cityName)) {
        recentSearches.unshift(cityName);
        recentSearches = recentSearches.slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    displayRecentCities();
}

function displayRecentCities() {
    if (recentSearches.length === 0) {
        recentSection.style.display = 'none';
        return;
    }

    recentSection.style.display = 'block';
    recentCities.innerHTML = recentSearches.map(city => `
        <button class="recent-city-btn" onclick="searchCity('${city}')">${city}</button>
    `).join('');
}

function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
        mainContent.classList.add('hidden');
        error.classList.add('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    mainContent.classList.add('hidden');
}
