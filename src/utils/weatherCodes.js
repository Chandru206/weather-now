const weatherCodeMap = {
  0: { icon: "☀️", label: "Clear sky", type: "sunny" },
  1: { icon: "🌤️", label: "Mainly clear", type: "sunny" },
  2: { icon: "⛅", label: "Partly cloudy", type: "cloudy" },
  3: { icon: "☁️", label: "Overcast", type: "cloudy" },
  45: { icon: "🌫️", label: "Fog", type: "cloudy" },
  61: { icon: "🌦️", label: "Light rain", type: "rainy" },
  63: { icon: "🌧️", label: "Moderate rain", type: "rainy" },
  65: { icon: "🌧️", label: "Heavy rain", type: "rainy" },
  80: { icon: "🌦️", label: "Rain showers", type: "rainy" },
  95: { icon: "⛈️", label: "Thunderstorm", type: "rainy" },
  99: { icon: "⛈️", label: "Severe thunderstorm", type: "rainy" },
};

export default weatherCodeMap;
