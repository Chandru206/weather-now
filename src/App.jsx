import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Spinner from "./components/Spinner";
import weatherCodeMap from "./utils/weatherCodes";

const RECENT_KEY = "weather_recent_searches";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  const saveRecent = (q) => {
    const next = [q, ...recent.filter((r) => r !== q)].slice(0, 6);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=5`
      ).then((r) => r.json());

      if (!geo.results || geo.results.length === 0) {
        setError(`No results found for "${city}". Try another city.`);
        setLoading(false);
        return;
      }

      const top = geo.results[0];

      const w = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${top.latitude}&longitude=${top.longitude}&current_weather=true&hourly=apparent_temperature&timezone=auto`
      ).then((r) => r.json());

      let feelsLike = null;
      if (w.hourly?.time && w.hourly.apparent_temperature) {
        const idx = w.hourly.time.indexOf(w.current_weather.time);
        if (idx !== -1) feelsLike = w.hourly.apparent_temperature[idx];
      }

      setWeather({
        city: `${top.name}${top.admin1 ? ", " + top.admin1 : ""}, ${top.country}`,
        latitude: top.latitude,
        longitude: top.longitude,
        temperature: w.current_weather.temperature,
        feelsLike,
        windspeed: w.current_weather.windspeed,
        winddirection: w.current_weather.winddirection,
        weathercode: w.current_weather.weathercode,
        time: w.current_weather.time,
      });

      saveRecent(top.name);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("Network or server error. Try again.");
      setLoading(false);
    }
  };

  // Dynamic background based on weather
  const getBgClass = () => {
    if (!weather) return "from-blue-50 to-indigo-100";
    const type = weatherCodeMap[weather.weathercode]?.type;
    switch (type) {
      case "sunny":
        return "from-yellow-200 to-blue-200";
      case "cloudy":
        return "from-gray-200 to-gray-400";
      case "rainy":
        return "from-blue-300 to-blue-500";
      default:
        return "from-blue-50 to-indigo-100";
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start p-6 bg-gradient-to-b ${getBgClass()} transition-colors duration-500`}
    >
      <h1 className="text-4xl font-bold mb-6 text-blue-800 drop-shadow-md">
        🌤 Weather Now
      </h1>
      <SearchBar onSearch={fetchWeather} recent={recent} onPick={fetchWeather} loading={loading} />
      {loading && <Spinner />}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {weather && <WeatherCard data={weather} className="mt-6" />}
    </div>
  );
}
