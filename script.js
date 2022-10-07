// Toggle dark mode
const toggle = document.querySelector('.checkbox');

toggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});
// end toggle dark mode

const changeTemp = document.querySelector('.temp-type');
const tempBtn = document.querySelector('.temp-name');

changeTemp.addEventListener('change', () => {
  tempBtn.classList.toggle('celsius');
});

const searchCity = document.querySelector('.search-bar');
const submit = document.querySelector('.submit');

var prevSearch = [];

function searchInput(e) {
  e.preventDefault();

  const getLatAndLon =
    'https://api.openweathermap.org/geo/1.0/direct?q=' +
    searchCity.value +
    '&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

  fetch(getLatAndLon).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        if (prevSearch.length == 1) {
          prevSearch.shift();
        }
        saveCity(
          prevSearch.push({
            name: data[0].name,
            lat: data[0].lat,
            lon: data[0].lon,
          })
        );
        getCurrentWeather(data[0].lat, data[0].lon, data[0].name);
        searchCity.value = '';
      });
    }
  });
}

function getCurrentWeather(lat, lon, name) {
  let openWeatherUrl =
    'https://api.openweathermap.org/data/2.5/onecall?lat=' +
    lat +
    '&lon=' +
    lon +
    '&units=imperial&appid=4ce1081bbd0cd6d45033a1dc8f18bcdf';

  fetch(openWeatherUrl).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        displayWeather(data, name);
      });
    }
  });
}

function displayWeather(data, name) {
  let card = document.querySelector('.card-container');
  var icon = document.querySelector('.icon');

  card.innerHTML = '';

  for (let i = 0; i < 5; i++) {
    let weatherIcon = data.daily[i].weather[0].main;
    let fahrenheit = Math.round(data.daily[i].temp.day);
    let celsius = (5 / 9) * (fahrenheit - 32);

    switch (weatherIcon) {
      case 'Clear':
        icon = `<i class="icon fa-regular fa-sun"></i>`;
        break;
      case 'Clouds':
        icon = `<i class="icon fa-solid fa-cloud-sun"></i>`;
        break;
      case 'Drizzle':
        icon = `<i class="fa-solid fa-cloud-sun-rain"></i>`;
      case 'Rain':
        icon = `<i class="icon fa-solid fa-cloud-showers-heavy"></i>`;
        break;
      case 'Snow':
        icon = `<i class="icon fa-solid fa-snowflake"></i>`;
        break;
      case 'Thunderstorm':
        icon = `<i class="icon fa-solid fa-cloud-bolt"></i>`;
        break;
      case 'Fog':
        icon = `<i class="fa-solid fa-smog"></i>`;
        break;
      case 'Mist':
        icon = `<i class="fa-solid fa-smog"></i>`;
        break;
      case 'Smoke':
        icon = `<i class="fa-solid fa-fire"></i>`;
        break;
      case 'Haze':
        icon = `<i class="fa-solid fa-smog"></i>`;
        break;
      case 'Dust':
        icon = `<i class="fa-solid fa-water"></i>`;
        break;
      case 'Sand':
        icon = `<i class="fa-solid fa-water"></i>`;
        break;
      case 'Ash':
        icon = `<i class="fa-solid fa-fire"></i>`;
        break;
      case 'Squall':
        icon = `<i class="fa-solid fa-wind"></i>`;
        break;
      case 'Tornado':
        icon = `<i class="fa-solid fa-tornado"></i>`;
        break;
    }
    let tempType = fahrenheit;
    let tempText = '<span class="temp-letter">&deg;F</span>';

    if (tempBtn.classList.contains('celsius')) {
      tempType = celsius;
      tempText = '<span class="temp-letter">&deg;C</span>';
    }

    // future days
    card.innerHTML +=
      `<div class="card">
      <h2 class="city">` +
      name +
      `</h2>
      <h3 class="day">` +
      moment(data.daily[i].dt * 1000).format('MM/DD/YYYY') +
      `</h3>
      <span class="temp">` +
      Math.round(tempType) +
      tempText +
      `</span>` +
      icon +
      `<span class="desc">` +
      data.daily[i].weather[0].description +
      `</span>
      </div>`;
  }
}

function saveCity() {
  localStorage.setItem('City', JSON.stringify(prevSearch));
}

function loadCity() {
  prevSearch = JSON.parse(localStorage.getItem('City'));
  if (prevSearch == null) {
    prevSearch = [];
  }
  getCurrentWeather(prevSearch[0].lat, prevSearch[0].lon, prevSearch[0].name);
}

submit.addEventListener('click', searchInput);
tempBtn.addEventListener('click', loadCity);

loadCity();
