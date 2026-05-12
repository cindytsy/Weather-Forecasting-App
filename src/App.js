import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

function App() {
  const [city, setCity] = useState("Vancouver");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  const temperatureSymbol = unit === "metric" ? "°C" : "°F";
  const windUnit = unit === "metric" ? "m/s" : "mph";

  async function getCoordinates(cityName) {
    const response = await fetch(
      `${GEO_URL}?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to search for this city.");
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error("City not found. Please try another city name.");
    }

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  }

  async function getCurrentWeather(lat, lon, selectedUnit) {
    const response = await fetch(
      `${WEATHER_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${selectedUnit}`
    );

    if (!response.ok) {
      throw new Error("Failed to get current weather.");
    }

    return response.json();
  }

  async function getForecast(lat, lon, selectedUnit) {
    const response = await fetch(
      `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${selectedUnit}`
    );

    if (!response.ok) {
      throw new Error("Failed to get weather forecast.");
    }

    return response.json();
  }

  function createDailyForecast(forecastList) {
    const dailyForecast = {};

    forecastList.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];

      if (!dailyForecast[date] || item.dt_txt.includes("12:00:00")) {
        dailyForecast[date] = item;
      }
    });

    return Object.values(dailyForecast).slice(0, 5);
  }

  function addToRecentSearches(cityName) {
    if (!cityName) return;

    const cleanCity = cityName.trim();

    setRecentSearches((previousSearches) => {
      const filtered = previousSearches.filter(
        (item) => item.toLowerCase() !== cleanCity.toLowerCase()
      );

      return [cleanCity, ...filtered].slice(0, 5);
    });
  }

  async function loadWeather(cityName, selectedUnit) {
    if (!API_KEY) {
      setError("Missing API key. Please add it to your .env file.");
      return;
    }

    if (!cityName.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { lat, lon } = await getCoordinates(cityName);

      const currentWeather = await getCurrentWeather(lat, lon, selectedUnit);
      const forecastData = await getForecast(lat, lon, selectedUnit);

      setWeather(currentWeather);
      setForecast(createDailyForecast(forecastData.list));
      setCity(currentWeather.name);
      addToRecentSearches(currentWeather.name);
    } catch (err) {
      setWeather(null);
      setForecast([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function loadWeatherByLocation() {
    if (!API_KEY) {
      setError("Missing API key. Please add it to your .env file.");
      return;
    }

    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const currentWeather = await getCurrentWeather(lat, lon, unit);
          const forecastData = await getForecast(lat, lon, unit);

          setWeather(currentWeather);
          setForecast(createDailyForecast(forecastData.list));
          setCity(currentWeather.name || "Current Location");
          addToRecentSearches(currentWeather.name || "Current Location");
        } catch (err) {
          setWeather(null);
          setForecast([]);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        setError("Location permission denied. Please allow location access.");
      }
    );
  }

  function handleSearch(event) {
    event.preventDefault();
    loadWeather(city, unit);
  }

  function toggleUnit() {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);

    if (weather) {
      loadWeather(city, newUnit);
    }
  }

  function formatCityTime(timestamp, timezoneOffset = 0) {
    const date = new Date((timestamp + timezoneOffset) * 1000);

    return date.toLocaleTimeString("en-US", {
      timeZone: "UTC",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getClothingSuggestion(weatherData) {
    if (!weatherData) return "";

    const condition = weatherData.weather[0].main;
    const temp = weatherData.main.temp;
    const tempC = unit === "metric" ? temp : ((temp - 32) * 5) / 9;

    if (condition === "Rain" || condition === "Drizzle") {
      return "Bring an umbrella and wear waterproof shoes.";
    }

    if (condition === "Thunderstorm") {
      return "Stay indoors if possible. Bring a rain jacket if you go out.";
    }

    if (condition === "Snow") {
      return "Wear a thick coat, scarf, gloves, and warm shoes.";
    }

    if (tempC >= 25) {
      return "Wear light clothes and remember to drink water.";
    }

    if (tempC >= 15) {
      return "A light jacket or sweater should be comfortable.";
    }

    if (tempC >= 5) {
      return "Wear a warm jacket.";
    }

    return "Wear a thick coat, scarf, and gloves.";
  }

  function getBackgroundClass() {
    if (!weather) {
      return "ocean-default";
    }

    const condition = weather.weather[0].main;

    if (condition === "Clear") return "ocean-clear";
    if (condition === "Clouds") return "ocean-clouds";
    if (condition === "Rain" || condition === "Drizzle") return "ocean-rain";
    if (condition === "Thunderstorm") return "ocean-storm";
    if (condition === "Snow") return "ocean-snow";

    return "ocean-default";
  }

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <div className="weather-container">
        <h1>🌊 SkyCast Weather</h1>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>

        <div className="button-row">
          <button className="location-button" onClick={loadWeatherByLocation}>
            📍 Use My Location
          </button>

          <button className="unit-button" onClick={toggleUnit}>
            Switch to {unit === "metric" ? "Fahrenheit" : "Celsius"}
          </button>
        </div>

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <p>Recent Searches</p>

            <div className="recent-list">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  className="recent-chip"
                  onClick={() => loadWeather(item, unit)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="loading">Loading weather data...</p>}

        {error && <p className="error">{error}</p>}

        {weather && (
          <div className="current-weather">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />

            <h3>
              {Math.round(weather.main.temp)}
              {temperatureSymbol}
            </h3>

            <p>{weather.weather[0].description}</p>

            <p className="suggestion">
              👕 {getClothingSuggestion(weather)}
            </p>

            <div className="sun-times">
              <div className="sun-card">
                <span>🌅 Sunrise</span>
                <strong>
                  {formatCityTime(weather.sys.sunrise, weather.timezone)}
                </strong>
              </div>

              <div className="sun-card">
                <span>🌇 Sunset</span>
                <strong>
                  {formatCityTime(weather.sys.sunset, weather.timezone)}
                </strong>
              </div>
            </div>

            <div className="weather-details">
              <p>
                Feels like: {Math.round(weather.main.feels_like)}
                {temperatureSymbol}
              </p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>
                Wind: {weather.wind.speed} {windUnit}
              </p>
            </div>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="forecast">
            <h2>5-Day Forecast</h2>

            <div className="forecast-grid">
              {forecast.map((day) => (
                <div className="forecast-card" key={day.dt}>
                  <h4>
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </h4>

                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt={day.weather[0].description}
                  />

                  <p>
                    {Math.round(day.main.temp)}
                    {temperatureSymbol}
                  </p>

                  <small>{day.weather[0].description}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
