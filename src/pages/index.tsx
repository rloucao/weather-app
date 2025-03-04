import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { initialWeather } from "./weather";
import { api } from "~/utils/api";
import Weather from "./weather";
import { useRouter } from "next/router";
import { Droplets, MapPin, Thermometer, Map } from "lucide-react";

export default function Home() {
  const rout = useRouter();
  const [cache, setCache] = useState<any[]>([]);

  //localStorage.clear();

  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("weatherHistory") || "[]",
    );
    if (savedHistory.length > 3) {
      const newHistory = savedHistory.slice(-3); 
      setCache(newHistory);
    }

    else{
      setCache(savedHistory);
    }

  });

  return (
    <div className="bg-rgb(30, 58, 138) flex min-h-screen items-center justify-center gap-5 bg-[#203989]">
      <div className="text-gray absolute top-2 flex h-[10%] w-[50%] justify-center gap-4 font-serif text-4xl font-extrabold">
        <div>Weather Forescast</div>
        <div>
          <button onClick={() => rout.push("/weather")}>
            <Map className="h-10 w-10" />
          </button>
        </div>
      </div>

      <div className="grid gap-2">
        <ul className="flex gap-6 flex-col items-center">
          {cache.length > 0
            ? cache.map((current, _) => (
                <li key={current.id}>
                  <Card className="border-none bg-white/10 backdrop-blur-md">
                    <CardContent className="p-4">
                      <div className="flex justify-items-start gap-2">
                        <MapPin className="h-8 w-8" />
                        <span className="text-3xl font-bold">
                          {current.name}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-7">
                        <div className="gap flex items-start">
                          <Thermometer className="h-6 w-6" />
                          <div className="flex-col">
                            <span className="text-xl font-medium">
                              Temperature
                            </span>
                            <p className="text-3xl font-bold">
                              {Math.floor(current.main.temp - 272.15)}ºC
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Droplets className="h-6 w-6" />
                          <div>
                            <span className="text-xl font-medium">
                              Humidity
                            </span>
                            <p className="text-3xl font-bold">
                              {current.main.humidity}%
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center">
                        <p className="text-sm">
                          Cloudiness: {current.clouds.all}%
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              ))
            : [...Array(5)].map((_, index) => (
                <li key={index} className="w-[400%]">
                  <div className="w-full max-w-lg rounded-md border border-black p-4">
                    <div className="flex animate-pulse space-x-4">
                      <div className="size-10 rounded-full bg-blue-950"></div>
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 rounded bg-blue-950"></div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 h-2 rounded bg-blue-950"></div>
                            <div className="col-span-1 h-2 rounded bg-blue-950"></div>
                          </div>
                          <div className="h-2 rounded bg-blue-950"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
