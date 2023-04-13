// DOM elements
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const resultsDiv = document.querySelector('#results');
const resultsHeader = document.querySelector('#results-header');
const locationDiv = document.querySelector('#location');
const saveBtn = document.querySelector('#save-btn');
const tempDivEtc = document.querySelector('#temp-etc');
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
        conditions: res.weather[0].main,
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
  let conditions = weather.conditions;
  // Display weather data
  locationDiv.textContent = location;
  tempDivEtc.innerHTML = `
    <div id='temperature'>${temperature}<sup>&#8457;</sup></div>
    <div id='conditions'>${conditions}</div>
  `;
  saveBtn.style.display = 'flex';
}

// Event listener for search form submission
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let location = searchInput.value;
  if (location) {
    getWeather(location);
    searchInput.value = '';
    errorDiv.textContent = '';
    clearTimeout(); // error message is not displaying for 3 full seconds
  } else {
    displayError('Please enter a city.');
    setTimeout(() => {
      errorDiv.textContent = '';
    }, 3000); // error message is not displaying for 3 full seconds
    locationDiv.textContent = '';
    tempDivEtc.innerHTML = '';
    saveBtn.style.display = 'none';
  }
});

// Create object for saved locations
class SavedLocation {
  constructor() {
    this.totalAreas = 0;
    this.areas = [];
    this.id = this.totalAreas;
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
      // if li.textContent === locationDiv.textContent, hide saveBtn
      if (li.textContent === locationDiv.textContent) {
        saveBtn.style.display = 'none';
      } else {
        saveBtn.style.display = 'flex';
      }

      // Event Listener for run btn
      runBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // get location from li
        const location = e.target.parentElement.parentElement.textContent;
        // call runLocation() method
        newSavedLocation.runLocation(location);
      });

      // event listener for delete btn
    });
  }
  // filter
  removeLocation(id) {
    this.areas = this.areas.filter((area) => id !== area.id);
  }

  runLocation(location) {
    getWeather(location);
    if (li.textContent === locationDiv.textContent) {
      saveBtn.style.display = 'none';
    } else {
      saveBtn.style.display = 'flex';
    }
  }
}

// Instantiate new SavedLocation object
const newSavedLocation = new SavedLocation(location);

// Event listener for saveLocation btn, call saveLocation() method
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // get location from resultsDiv
  const location = resultsDiv.querySelector('#location').textContent;
  // call saveLocation() method
  newSavedLocation.saveLocation(location);
});

// On page load
document.addEventListener('DOMContentLoaded', function () {
  searchInput.focus();
});
