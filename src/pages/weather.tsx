"use client";
import React, { useState, useEffect } from "react";
import { api } from "~/utils/api";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Search,
  Droplets,
  Wind,
  Sunrise,
  Sunset,
  Thermometer,
  MapPin,
  ArrowLeftToLine
} from "lucide-react";
import WeatherIcon from "./components/weather-icon";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/router";
import type WeatherData from "~/types/weatherType";

export const initialWeather : WeatherData = {
  name: "Loading",
  sys: { country: "", sunrise: 0, sunset: 0 },
  weather: [{ main: "Clear", description: "clear sky" }],
  coord: { lat: 0, lon: 0 },
  main: { temp: 293.15, feels_like: 293.15, humidity: 0 },
  wind: { speed: 0 },
  clouds: { all: 0 },
};


export default function WeatherComponent() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [weather, setWeather] = useState(initialWeather);
  const [city, setCity] = useState("");
  const loading = false;
  const router = useRouter();

  const saveHistory = (newDate : WeatherData) => {
    const saved = JSON.parse(localStorage.getItem("weatherHistory") ?? "[]") as WeatherData[]

    const updated = [newDate, ...saved].slice(0, 5)
    localStorage.clear();
    localStorage.setItem("weatherHistory", JSON.stringify(updated))
  }

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
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const { data } = !city
  ? api.weather.get.useQuery(
      {
        lat: location?.lat ?? 0,
        lon: location?.lon ?? 0,
      },
      { enabled: location !== null },
    )
  : api.weather.getFromCity.useQuery({ city }) as { data: WeatherData }; 

  useEffect(() => {
    if (data) {
      setWeather(data);
      saveHistory(data);
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city) {
      setCity(city);
    }
  };

  const handleClearCity = (e: React.FormEvent) => {
    e.preventDefault();
    setCity("");
    console.log(city);
  };


  const isDay = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    return (
      currentTime > weather.sys.sunrise && currentTime < weather.sys.sunset
    );
  };

  const getBackgroundClasses = () => {
    const weatherMain = weather.weather[0]?.main.toLowerCase();
    const day = isDay();

    if (weatherMain === "clear") {
      return day
        ? "bg-gradient-to-b from-blue-400 to-blue-200"
        : "bg-gradient-to-b from-blue-900 to-indigo-900";
    } else if (weatherMain === "clouds") {
      return day
        ? "bg-gradient-to-b from-blue-300 to-gray-200"
        : "bg-gradient-to-b from-gray-800 to-gray-900";
    } else if (weatherMain === "rain" || weatherMain === "drizzle") {
      return day
        ? "bg-gradient-to-b from-gray-400 to-gray-300"
        : "bg-gradient-to-b from-gray-900 to-gray-800";
    } else if (weatherMain === "thunderstorm") {
      return "bg-gradient-to-b from-gray-800 to-gray-900";
    } else if (weatherMain === "snow") {
      return day
        ? "bg-gradient-to-b from-gray-100 to-blue-50"
        : "bg-gradient-to-b from-gray-700 to-gray-800";
    } else if (
      weatherMain === "mist" ||
      weatherMain === "fog" ||
      weatherMain === "haze"
    ) {
      return day
        ? "bg-gradient-to-b from-gray-300 to-gray-200"
        : "bg-gradient-to-b from-gray-700 to-gray-800";
    }

    return day
      ? "bg-gradient-to-b from-blue-400 to-blue-200"
      : "bg-gradient-to-b from-blue-900 to-indigo-900";
  };

  const getTextColorClass = () => {
    const weatherMain = weather.weather[0]?.main.toLowerCase();
    const day = isDay();

    if ((weatherMain === "clear" || weatherMain === "clouds") && day) {
      return "text-gray-800";
    }

    return "text-white";
  };

  return (
    <div
      className={`flex min-h-screen flex-col items-center p-4 transition-all duration-1000 ${getBackgroundClasses()}`}
    >
      <div className={`absolute top-5 left-5 ${getTextColorClass()}`}>
        <button onClick={() => router.push("/")}>
          <ArrowLeftToLine className="w-10 h-10" />
        </button>
      </div>
      <div className="w-full max-w-md">
        <div className="grid-cols-3 justify-start">
          <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
            <Input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="placeholder:text-inherit/70 border-none bg-white/20 text-inherit backdrop-blur-md"
            />
            <Button
              type="submit"
              variant="outline"
              className="border-none bg-white/20 backdrop-blur-md"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button
            onSubmit={handleClearCity}
            variant="outline"
            className="border-none bg-white/20 backdrop-blur-md"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
        <div className={`transition-all duration-1000 ${getTextColorClass()}`}>
          {loading ? (
            <WeatherSkeleton />
          ) : (
            <>
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold">{weather.name}</h1>
                  <h2 className="text-xl">{weather.sys.country}</h2>
                  <p className="mt-1 text-lg capitalize">
                    {weather.weather[0]?.description}
                  </p>
                </div>
                <div className="text-center">
                  <WeatherIcon
                    weatherMain={weather.weather[0]?.main ?? "Clear"}
                    isDay={isDay()}
                    className="h-20 w-20"
                  />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-none bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-5 w-5" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-3xl font-bold">
                        {Math.floor(weather.main.temp - 273.15)}°C
                      </p>
                      <p className="text-sm">
                        Feels like:{" "}
                        {Math.floor(weather.main.feels_like - 273.15)}°C
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-5 w-5" />
                      <span className="font-medium">Humidity</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-3xl font-bold">
                        {weather.main.humidity}%
                      </p>
                      <p className="text-sm">
                        Cloudiness: {weather.clouds.all}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-none bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Wind className="h-5 w-5" />
                      <span className="font-medium">Wind</span>
                    </div>
                    <div className="mt-2">
                      <p className="text-3xl font-bold">
                        {(weather.wind.speed * 3.6).toFixed(1)} km/h
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none bg-white/10 backdrop-blur-md">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-5 w-5" />
                      <span className="font-medium">Sun</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1">
                        <Sunrise className="h-4 w-4" />
                        <span>
                          {new Date(
                            weather.sys.sunrise * 1000,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sunset className="h-4 w-4" />
                        <span>
                          {new Date(
                            weather.sys.sunset * 1000,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-4 border-none bg-white/10 backdrop-blur-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Location</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <p>Latitude: {weather.coord.lat.toFixed(2)}</p>
                    <p>Longitude: {weather.coord.lon.toFixed(2)}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-10 w-40 bg-white/20" />
          <Skeleton className="mt-2 h-6 w-20 bg-white/20" />
          <Skeleton className="mt-2 h-6 w-32 bg-white/20" />
        </div>
        <Skeleton className="h-20 w-20 rounded-full bg-white/20" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-32 bg-white/20" />
        <Skeleton className="h-32 bg-white/20" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-32 bg-white/20" />
        <Skeleton className="h-32 bg-white/20" />
      </div>

      <Skeleton className="h-24 bg-white/20" />
    </div>
  );
}
