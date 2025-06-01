// API URL for Khetlal, Joypurhat Bangladesh weather data
const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=25.0147&longitude=89.1084&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,cloud_cover,wind_speed_10m,wind_direction_10m&timezone=GMT";

// DOM Elements
const loadingElement = document.getElementById('loading');
const errorMessageElement = document.getElementById('error-message');
const weatherDataElement = document.getElementById('weather-data');
const retryButton = document.getElementById('retry-button');
const refreshButton = document.getElementById('refresh-button');

// Weather display elements
const temperatureElement = document.getElementById('temperature');
const apparentTemperatureElement = document.getElementById('apparent-temperature');
const humidityElement = document.getElementById('humidity');
const precipitationElement = document.getElementById('precipitation');
const rainElement = document.getElementById('rain');
const cloudCoverElement = document.getElementById('cloud-cover');
const windSpeedElement = document.getElementById('wind-speed');
const windDirectionElement = document.getElementById('wind-direction');
const lastUpdatedElement = document.getElementById('last-updated');
const weatherIconElement = document.getElementById('weather-icon');

// Timer for auto-refresh
let refreshTimer;
const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData();
    
    // Event listeners
    retryButton.addEventListener('click', fetchWeatherData);
    refreshButton.addEventListener('click', fetchWeatherData);
});

// Fetch weather data from the API
async function fetchWeatherData() {
    // Show loading state
    showLoading();
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        updateWeatherDisplay(data);
        
        // Schedule next refresh
        setupAutoRefresh();
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError();
    }
}

// Update the UI with weather data
function updateWeatherDisplay(data) {
    if (!data || !data.current) {
        showError();
        return;
    }
    
    // Extract current weather data
    const { 
        temperature_2m, 
        relative_humidity_2m, 
        apparent_temperature, 
        precipitation, 
        rain, 
        cloud_cover, 
        wind_speed_10m, 
        wind_direction_10m 
    } = data.current;
    
    // Update DOM elements with weather data
    temperatureElement.textContent = `${temperature_2m}°C`;
    apparentTemperatureElement.textContent = `${apparent_temperature}°C`;
    humidityElement.textContent = `${relative_humidity_2m}%`;
    precipitationElement.textContent = `${precipitation} mm`;
    rainElement.textContent = `${rain} mm`;
    cloudCoverElement.textContent = `${cloud_cover}%`;
    windSpeedElement.textContent = `${wind_speed_10m} km/h`;
    windDirectionElement.textContent = `${wind_direction_10m}°`;
    
    // Update last updated time
    const now = new Date();
    lastUpdatedElement.textContent = now.toLocaleTimeString();
    
    // Update weather icon based on conditions
    updateWeatherIcon(cloud_cover, precipitation);
    
    // Show weather data
    showWeatherData();
}

// Update the weather icon based on conditions
function updateWeatherIcon(cloudCover, precipitation) {
    if (precipitation > 1) {
        weatherIconElement.className = 'fas fa-cloud-showers-heavy';
    } else if (precipitation > 0) {
        weatherIconElement.className = 'fas fa-cloud-rain';
    } else if (cloudCover > 80) {
        weatherIconElement.className = 'fas fa-cloud';
    } else if (cloudCover > 30) {
        weatherIconElement.className = 'fas fa-cloud-sun';
    } else {
        weatherIconElement.className = 'fas fa-sun';
    }
}

// UI state functions
function showLoading() {
    loadingElement.classList.remove('hidden');
    errorMessageElement.classList.add('hidden');
    weatherDataElement.classList.add('hidden');
}

function showError() {
    loadingElement.classList.add('hidden');
    errorMessageElement.classList.remove('hidden');
    weatherDataElement.classList.add('hidden');
}

function showWeatherData() {
    loadingElement.classList.add('hidden');
    errorMessageElement.classList.add('hidden');
    weatherDataElement.classList.remove('hidden');
}

// Set up auto-refresh
function setupAutoRefresh() {
    // Clear any existing timer
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }
    
    // Set new timer
    refreshTimer = setTimeout(fetchWeatherData, REFRESH_INTERVAL);
}

// Clean up timer when page is unloaded
window.addEventListener('beforeunload', () => {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }
});

