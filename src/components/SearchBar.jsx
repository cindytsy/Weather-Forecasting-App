function SearchBar({ city, setCity, fetchWeather }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter city name, e.g. Vancouver"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;