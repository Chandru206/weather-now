import { useState, useEffect } from "react";

export default function SearchBar({ onSearch, recent = [], onPick, loading }) {
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (q.length < 3) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5`
        );
        const data = await res.json();
        if (data.results) setSuggestions(data.results);
        else setSuggestions([]);
      } catch (err) {
        console.error(err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [q]);

  const submit = (e) => {
    e?.preventDefault();
    if (!q.trim()) return;
    onSearch(q.trim());
    setQ("");
    setSuggestions([]);
  };

  return (
    <div className="w-full max-w-xl relative">
      <form onSubmit={submit} className="flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-0 px-5 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          placeholder="Enter city (e.g., Chennai)"
          aria-label="City name"
        />
        <button
          type="submit"
          disabled={loading}
          className={`flex-shrink-0 px-5 py-3 rounded-lg font-semibold ${
            loading
              ? "bg-blue-600/50 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 transition"
          }`}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow mt-1 max-h-60 overflow-y-auto z-10">
          {suggestions.map((s) => (
            <li
              key={`${s.name}-${s.latitude}-${s.longitude}`}
              onClick={() => {
                onSearch(s.name);
                setQ("");
                setSuggestions([]);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100 transition"
            >
              {s.name}
              {s.admin1 ? `, ${s.admin1}` : ""}, {s.country}
            </li>
          ))}
        </ul>
      )}

      {/* Recent searches */}
      {recent.length > 0 && (
        <div className="mt-4 bg-white p-3 rounded-md shadow-sm">
          <div className="text-sm text-gray-600 mb-2 font-medium">
            Recent searches
          </div>
          <div className="flex gap-2 flex-wrap">
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => onPick(r)}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
