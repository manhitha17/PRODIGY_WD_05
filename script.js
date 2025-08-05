
const apiKey = "7e550385098065aba4325f92cfc9f689";

if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
  window.onload = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.cod === 200) {
            showWeather(data);
          } else {
            document.getElementById("weather").innerHTML = `<p>${data.message}</p>`;
          }
        } catch (error) {
          document.getElementById("weather").innerHTML = `<p>Error fetching weather data.</p>`;
          console.error(error);
        }
      }, () => {
        document.getElementById("weather").innerHTML = "<p>Geolocation permission denied.</p>";
      });
    } else {
      document.getElementById("weather").innerHTML = "<p>Geolocation not supported by this browser.</p>";
    }
  };
}

async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherDiv = document.getElementById("weather");

  if (!city) {
    weatherDiv.innerHTML = `<p>Please enter a city name.</p>`;
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      showWeather(data);
    } else {
      weatherDiv.innerHTML = `<p>City not found: ${data.message}</p>`;
    }
  } catch (error) {
    weatherDiv.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
    console.error(error);
  }
}

function showWeather(data) {
  const weatherDiv = document.getElementById("weather");
  const icon = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  const weatherHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="Weather Icon">
    <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬 Wind Speed: ${data.wind.speed} m/s</p>
    <p>📈 Pressure: ${data.main.pressure} hPa</p>
  `;

  weatherDiv.innerHTML = weatherHTML;
}

