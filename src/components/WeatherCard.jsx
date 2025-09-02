import weatherCodeMap from "../utils/weatherCodes";

export default function WeatherCard({ data, className = "" }) {
  // Determine animation based on weather code
  const getAnimationClass = (code) => {
    if ([0, 1].includes(code)) return "animate-spin-slow"; // Sun
    if ([2, 3, 45].includes(code)) return "animate-float-cloud"; // Clouds/Fog
    return ""; // Rain animation handled separately
  };

  return (
    <div
      className={`w-full max-w-md bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow ${className}`}
    >
      {/* City & Time */}
      <h2 className="text-lg font-semibold text-gray-800">{data.city}</h2>
      <p className="text-xs text-gray-500">
        {new Date(data.time).toLocaleString()}
      </p>

      <div className="mt-4 flex items-center justify-between">
        {/* Left side: Temperature, Icon, Label */}
        <div className="relative">
          <div className="text-5xl font-bold">{data.temperature}°C</div>

          {data.feelsLike !== null && (
            <div className="text-sm text-gray-700 mt-1">
              Feels like: {data.feelsLike}°C
            </div>
          )}

          <div className="text-lg mt-3 font-medium flex items-center gap-2 relative">
            {/* Weather Icon */}
            <span className={`text-4xl ${getAnimationClass(data.weathercode)}`}>
              {weatherCodeMap[data.weathercode]?.icon || "❓"}
            </span>

            {/* Weather label */}
            <span>{weatherCodeMap[data.weathercode]?.label || "Unknown"}</span>

            {/* Optional rain overlay for codes that do NOT already contain raindrops in emoji */}
            {!["🌦️", "🌧️", "⛈️"].includes(
              weatherCodeMap[data.weathercode]?.icon
            ) &&
              [61, 63, 65, 80, 95, 99].includes(data.weathercode) && (
                <div className="absolute inset-0 flex justify-center items-start space-x-1 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-5 bg-blue-400 rounded-sm animate-rain-fall"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Right side: Wind & coordinates */}
        <div className="text-right text-sm text-gray-600">
          <div>💨 {data.windspeed} km/h</div>
          <div>📐 {data.winddirection}°</div>
          <div className="text-xs mt-1">
            Lat {data.latitude.toFixed(2)}, Lon {data.longitude.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
