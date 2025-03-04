import { useState, useEffect } from "react";
import { api } from "~/utils/api";

export default function WeatherComponent() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Fetch geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Handle error (e.g., fallback to default location or show message)
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const {data, isLoading, error } = api.weather.get.useQuery({
    lat: location?.lat ?? 0,
    lon: location?.lon ?? 0
  }, {enabled: location !== null});

  // Handle loading state
  if (isLoading) {
    return <p>Loading weather data...</p>;
  }

  // Handle error state
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Render weather data
  return (
    <div>
      <h2>Weather Data:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
