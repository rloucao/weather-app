export default interface WeatherData {
    name: string;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    weather: {
      main: string;
      description: string;
    }[];
    coord: {
      lat: number;
      lon: number;
    };
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
  };