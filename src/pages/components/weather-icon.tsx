import { Sun,
     CloudRain,
     CloudSnow,
     CloudLightning,
     CloudFog,
     Moon,
     CloudMoon,
     CloudDrizzle,
     Cloudy,
    } from 'lucide-react';

interface WeatherProps {
    weatherMain : string
    isDay: boolean
    className? : string
}

export default function WeatherIcon({weatherMain, isDay, className="h-6 w-6"} : WeatherProps){
    const cond = weatherMain?.toLowerCase() || "clear"

    const getIcon = () => {
        switch(cond){
            case 'clear':
                return isDay ? <Sun className={className}/> : <Moon className={className}/>
            case 'clouds':
                return isDay ? <Cloudy className={className} /> : <CloudMoon className={className} /> 
            case 'rain':
                return <CloudRain className={className} />
            case 'snow':
                return <CloudSnow className={className} />
            case 'drizzle':
                return <CloudDrizzle className={className} />
            case 'thunderstorm':
                return <CloudLightning className={className} />
            case 'mist':
            case 'fog':
            case 'haze':
                return <CloudFog className={className} />
    
            default:
                return isDay ? <Sun className={className}/> : <Moon className={className}/>
            }
    }
    return getIcon()
    
}