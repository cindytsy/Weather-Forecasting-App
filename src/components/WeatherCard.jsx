function WeatherCard({ weather, unitSymbol, unit }) {
  const icon = weather.weather[0].icon;
  const windUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="weather-card">
      <h2>
        {weather.name}, {weather.sys.country}
      </h2>

      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt={weather.weather[0].description}
      />

      <h3>{Math.round(weather.main.temp)}{unitSymbol}</h3>
      <p className="description">{weather.weather[0].description}</p>

      <div className="weather-details">
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind Speed: {weather.wind.speed} {windUnit}</p>
        <p>Feels Like: {Math.round(weather.main.feels_like)}{unitSymbol}</p>
      </div>
    </div>
  );
}

export default WeatherCard;