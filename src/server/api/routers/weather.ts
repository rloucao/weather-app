import {z} from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dotenv from "dotenv";
import type WeatherData from "~/types/weatherType";
dotenv.config();


const API_KEY = process.env.DATABASE_URL;



let lastCity = '';
let lastPosition = {lat: 0, lon : 0};
let lastData : WeatherData | null = null;
let lastDataFetchTime = 0;
const CACHE_EXPIRATION_TIME = 600000;

export const weatherRouter = createTRPCRouter({
    get: publicProcedure.input(
        z.object({
            lat: z.number(),
            lon: z.number(),
        })
    ).query(
        async ({input}) => {
            
        const {lat , lon}= input
    
        if (!API_KEY) {
            throw new Error("Missing API KEY");
        }

        if( lat === lastPosition.lat  && lon === lastPosition.lon && Date.now() - lastDataFetchTime < CACHE_EXPIRATION_TIME) {
            console.log('Returning cached weather data for position:', lat, lon)
            return lastData;
        }

        //`api.openweathermap.org/data/2.5/weather?q=${place},${country}&APPID=80c577fab17d161a9756c2460e6a08fa`

        //https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=80c577fab17d161a9756c2460e6a08fa`;

          try{
            const response = await fetch(url);
            if (!response.ok){
                throw new Error(`Failed fetching the data: ${response.statusText}`)
            }
            const data : WeatherData = await response.json() as WeatherData;
            lastPosition = { 
                lat: data.coord.lat, 
                lon: data.coord.lon 
              };
            lastData = data
            lastDataFetchTime = Date.now()
            return data;
          }catch(error) {
            console.log("Error API:", error)
            throw new Error("Failed retrieving data")
          }
    }),
    getFromCity: publicProcedure.input(
        z.object({
            city: z.string().toLowerCase(),
        })
    ).query(
        async ({input}) =>{
            const {city } = input
            if (!API_KEY) {
                throw new Error("Missing API KEY");
            }

            if(city === lastCity && Date.now() - lastDataFetchTime < CACHE_EXPIRATION_TIME){
                console.log('Returning cached weather data for city:', city)
                return lastData;
            }
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=80c577fab17d161a9756c2460e6a08fa`

            try{
                const res = await fetch(url)
                if(!res.ok){
                    throw new Error(`Failed fetching data ${res.statusText}`)
                }
                const data : WeatherData = await res.json() as WeatherData;
                lastCity = data.name;
                lastData = data;
                lastDataFetchTime = Date.now()
                return data;
            }catch(error){
                console.log("Error API:", error)
                throw new Error("Failed retrieving data")
            }
        }
    )
})
