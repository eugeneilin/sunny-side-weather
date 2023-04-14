// DOM elements
const body = document.querySelector('body');
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results');
const resultsHeader = document.querySelector('#results-header');
const locationDiv = document.querySelector('#location');
const saveBtn = document.querySelector('#save-btn');
const tempDiv = document.querySelector('#temp-etc');
const conditionsDiv = document.querySelector('#conditions-description');
const savedLocationsUl = document.querySelector('#saved-locations');
const alreadySaved = document.querySelector('#already-saved');
const errorDiv = document.querySelector('#error');

// Weather API
const apiKey = 'b93e791f89b4b9f5dab8d41a45135cf5';

// Get weather data
async function getWeather(location) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=imperial`
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return {
        location: res.name,
        temperature: res.main.temp,
        conditionsCode: res.weather[0].id,
        description: res.weather[0].description,
      };
    })
    .catch((err) => {
      console.error(err);
    });
  displayWeather(response);
}

// Display error message
function displayError(err) {
  errorDiv.textContent = err;
}

// Display weather data
function displayWeather(weather) {
  let location = weather.location;
  let temperature = weather.temperature.toFixed(0);
  let conditionsCode = weather.conditionsCode;
  let description = weather.description;
  // Display weather data
  locationDiv.textContent = location;
  tempDiv.innerHTML = `
    <div id='temperature'>${temperature}<sup>&#8457;</sup></div>
  `;
  conditionsDiv.textContent = description;
  saveBtn.style.display = 'flex';
  // Bg colors based on condition codes
  if (conditionsCode >= 200 && conditionsCode <= 799) {
    body.classList.add('bg-black');
    body.classList.remove('bg-blue');
    body.classList.remove('bg-gray');
  } else if (conditionsCode === 800) {
    body.classList.add('bg-blue');
    body.classList.remove('bg-black');
    body.classList.remove('bg-gray');
  } else if (conditionsCode >= 801 && conditionsCode <= 899) {
    body.classList.add('bg-gray');
    body.classList.remove('bg-black');
    body.classList.remove('bg-blue');
  }

  // declare variable for tempDiv event listener
  let isFahrenheit = true;

  // Toggle units event listener
  tempDiv.addEventListener('click', (e) => {
    e.preventDefault();

    isFahrenheit = !isFahrenheit;

    function convertedTemp() {
      if (isFahrenheit) {
        return convertToFahrenheit(convertToCelsius(temperature));
      } else {
        return convertToCelsius(temperature);
      }
    }
    let unitSymbol = isFahrenheit ? '&#8457;' : '&#8451;';

    tempDiv.innerHTML = `
    <div id='temperature'>${convertedTemp()}<sup>${unitSymbol}</sup></div>
  `;
  });
}

// Event listener for search form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let location = searchInput.value;
  if (location) {
    getWeather(location);
    searchInput.value = '';
    errorDiv.textContent = '';
    clearTimeout(this.timeoutID);
  } else {
    displayError('Please enter a city.');
    this.timeoutID = setTimeout(() => {
      errorDiv.textContent = '';
    }, 3000);
    locationDiv.textContent = '';
    tempDiv.innerHTML = '';
    conditionsDiv.textContent = '';
    saveBtn.style.display = 'none';
    body.backgroundImage = 'linear-gradient(to bottom, #cbc0d9, #ffffff)';
    body.classList.remove('bg-black');
    body.classList.remove('bg-blue');
    body.classList.remove('bg-gray');
  }
});

// Create object for saved locations
class SavedLocation {
  constructor(location) {
    this.totalAreas = 0;
    this.areas = [];
    this.id = this.totalAreas;
    this.location = location;
  }
  saveLocation(area) {
    this.id = this.totalAreas++;
    if (!this.areas.includes(area)) {
      this.areas.push(area);
    } else {
      alreadySaved.textContent = 'Location already saved to favorites.';
      setTimeout(() => {
        alreadySaved.textContent = '';
      }, 3000);
    }
    // update DOM
    savedLocationsUl.innerHTML = '';

    this.updateRemove();
  }
  runLocation(location) {
    getWeather(location);
    if (li.textContent === locationDiv.textContent) {
      saveBtn.style.display = 'none';
    } else {
      saveBtn.style.display = 'flex';
    }
  }
  removeLocation(cityName) {
    this.areas = this.areas.filter((area) => cityName !== area);
    this.updateRemove();
  }
  updateRemove() {
    savedLocationsUl.innerHTML = '';
    this.areas.forEach((area) => {
      // create li
      let li = document.createElement('li');
      li.textContent = area;
      // create div for actions
      let actionsDiv = document.createElement('div');
      actionsDiv.id = 'actions';
      li.appendChild(actionsDiv);
      // create run btn inside actions div
      let runBtn = document.createElement('div');
      runBtn.id = 'run-btn';
      actionsDiv.appendChild(runBtn);
      let runIcon = document.createElement('div');
      runBtn.appendChild(runIcon);
      // create delete btn inside actions div
      let deleteBtn = document.createElement('div');
      deleteBtn.id = 'delete-btn';
      actionsDiv.appendChild(deleteBtn);
      let deleteIcon = document.createElement('div');
      deleteBtn.appendChild(deleteIcon);
      // append li to ul
      savedLocationsUl.appendChild(li);
      if (li.textContent === locationDiv.textContent) {
        saveBtn.style.display = 'none';
      } else {
        saveBtn.style.display = 'flex';
      }

      // Event Listener for run btn
      runBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.location = e.target.parentElement.parentElement.textContent;
        getWeather(this.location);
      });

      // get cityName for removeLocation()
      let cityName = area;

      // event listener for delete btn
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        newSavedLocation.removeLocation(cityName);
      });
    });
  }
}

// Conversion functions
function convertToFahrenheit(temp) {
  return Math.round(temp * 1.8 + 32);
}

function convertToCelsius(temp) {
  return Math.round((temp - 32) / 1.8);
}

// Instantiate new SavedLocation object
const newSavedLocation = new SavedLocation(location);

// Event listener for saveLocation btn, call saveLocation() method
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const location = resultsDiv.querySelector('#location').textContent;
  newSavedLocation.saveLocation(location);
});

// Focus on input on page load
document.addEventListener('DOMContentLoaded', function () {
  searchInput.focus();
});

// add button after deleted....
