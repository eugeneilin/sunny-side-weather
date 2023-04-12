// Get DOM elements
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results');

// Weather API
const apiKey = 'b93e791f89b4b9f5dab8d41a45135cf5';

// Event listener for search form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let location = searchInput.value;
  getWeather(location);
  searchInput.value = '';
});

function displayWeather(weather) {
  // Display weather data
  resultsDiv.innerHTML = `
    <h3 id='location'>${weather.name}</h3>
    <div id='temperature'>${weather.main.temp}<sup>&#8457;</sup></div>
    <div id='conditions'>${weather.weather[0].main}</div>
  `;
}

// Display weather data function
async function getWeather(location) {
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
    );
    let weather = await response.json();
    console.log(weather);
    displayWeather(weather);
  } catch (err) {
    console.error(err);
  }
}

// On page load
document.addEventListener('DOMContentLoaded', function () {
  searchInput.focus();
});
