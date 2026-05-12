function Forecast({ forecast, unitSymbol }) {
  return (
    <div className="forecast-section">
      <h2>5-Day Forecast</h2>

      <div className="forecast-grid">
        {forecast.map((day) => {
          const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });

          return (
            <div className="forecast-card" key={day.dt}>
              <h4>{date}</h4>
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
              <p>{Math.round(day.main.temp)}{unitSymbol}</p>
              <span>{day.weather[0].main}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Forecast;