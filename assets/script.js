const date = document.querySelector("#date");
const time = document.querySelector("#time");
const dayOfWeek = document.querySelector("#today");

const input = document.querySelector("#userInput");

date.innerText = moment().format("MMMM Do YYYY");
time.innerText = moment().format("h:mm A");
dayOfWeek.innerText = moment().format("dddd");

// applies elements on page load with current position
function load() {
  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    let fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=imperial`;

    fetch(fiveDayURL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        fiveDayWeather(data);
        localStorage.setItem("response", JSON.stringify(data.city.name));
        loadUrl();
      });
  });
}

// uses the city name obtained from geocoordinates on load to fetch api for weather
function loadUrl() {
  let cityName = JSON.parse(localStorage.getItem("response"));

  let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=imperial`;
  fetch(requestURL)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch(() => {
      alert("Unable to connect to OpenWeather");
    });
}

var searchHistory = localStorage.searchHistory
  ? JSON.parse(localStorage.searchHistory)
  : [];
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault()
  searchHistory.push(document.querySelector("#userInput").value);
  localStorage.searchHistory = JSON.stringify(searchHistory);
  getApi();
  input.value = ""
  }
});

input.addEventListener("focus", () => {
  var data = document.querySelector("datalist#searchdata");
  data.innerHTML = "";
  searchHistory.forEach((search) => {
    data.innerHTML = "<option>" + data.innerHTML;
    data.querySelector("option").innerText = search;
  });
});

// fetches api using the user input
function getApi() {
  let cityName = document.querySelector("#userInput").value;

  let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=imperial`;
  fetch(requestURL)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      displayWeather(data);
    })
    .catch(() => {
      alert("Please check your city name once again!");
    });
}

// uses api data from getApi() and replaces text in html
let displayWeather = function (weatherData) {
  document.querySelector("#cityName").innerText = weatherData.name;
  document.querySelector("#temperature").innerText =
    Math.floor(weatherData.main.temp) + "\u00B0";
  document.querySelector("#conditions").innerText =
    weatherData.weather[0].description;
  document.querySelector("#tempHigh").innerText =
    weatherData.main.temp_max + "\u00B0 F";
  document.querySelector("#tempLow").innerText =
    weatherData.main.temp_min + "\u00B0 F";
  document.querySelector("#feelslike").innerText =
    weatherData.main.feels_like + "\u00B0 F";
  document.querySelector("#windspeed").innerText =
    weatherData.wind.speed + " MPH";
  document.querySelector("#humidity").innerText =
    weatherData.main.humidity + "%";
  document.querySelector("#pressure").innerText =
    weatherData.main.pressure + " hPa";

  let fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=b169b31281ffa2a2b70b9e8ac22c3e88&units=imperial`;
  fetch(fiveDayURL)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      fiveDayWeather(data);
    })
    .catch(() => {
      alert("Unable to connect to OpenWeather");
    });
};

// obtains lon and lat from previous function then completes new fetch to display 5 day forecast
let fiveDayWeather = function (weatherValue) {
  let todaysMonth = dayjs().$M;

  for (let i = 1; i < 6; i++) {
    document.querySelector("#date" + i).innerText = `${todaysMonth}/${
      dayjs().$D + i
    }`;
    document.querySelector("#date" + i + "Temp").innerText =
      weatherValue.list[i].main.temp + "\u00B0 F";
    document.querySelector("#condition" + i).innerText =
      weatherValue.list[i].weather[0].description;
    document.querySelector("#conditionIcon" + i).src =
      "http://openweathermap.org/img/wn/" +
      weatherValue.list[i].weather[0].icon +
      "@2x.png";
    document.querySelector("#humidity" + i).innerText =
      weatherValue.list[i].main.humidity + "%";
    document.querySelector("#windSpeed" + i).innerText =
      weatherValue.list[i].wind.speed + "MPH";
  }
};
