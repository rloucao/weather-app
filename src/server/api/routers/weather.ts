import {z} from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import dotenv from "dotenv";
dotenv.config();


const API_KEY = process.env.DATABASE_URL;

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
        //`api.openweathermap.org/data/2.5/weather?q=${place},${country}&APPID=80c577fab17d161a9756c2460e6a08fa`

        //https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=80c577fab17d161a9756c2460e6a08fa`;

          try{
            const response = await fetch(url);
            if (!response.ok){
                throw new Error(`Failed fetching the data: ${response.statusText}`)
            }
            const data = await response.json()
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
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=80c577fab17d161a9756c2460e6a08fa`

            try{
                const res = await fetch(url)
                if(!res.ok){
                    throw new Error(`Failed fetching data ${res.statusText}`)
                }
                const data = res.json()
                return data;
            }catch(error){
                console.log("Error API:", error)
                throw new Error("Failed retrieving data")
            }
        }
    )
})
