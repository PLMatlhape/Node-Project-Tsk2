
export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    is_day: number;
    time: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
}

export interface OpenWeatherResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

export interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
  };
}

export interface NewsPost {
  id: number;
  title: string;
  body: string;
  userId: number;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
}

export interface NewsResponse {
  posts: NewsPost[];
  total: number;
  skip: number;
  limit: number;
}

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }>;
}

export interface GuardianApiResponse {
  response: {
    status: string;
    userTier: string;
    total: number;
    results: Array<{
      id: string;
      sectionId: string;
      sectionName: string;
      webTitle: string;
      webUrl: string;
      apiUrl: string;
      webPublicationDate: string;
    }>;
  };
}

export interface ApiError {
  message: string;
  status?: number;
  source: 'weather' | 'news';
}

export type WeatherCallback = (error: ApiError | null, data?: WeatherData | OpenWeatherResponse | WeatherApiResponse) => void;
export type NewsCallback = (error: ApiError | null, data?: NewsResponse | NewsApiResponse | GuardianApiResponse) => void;
export type GenericCallback<T> = (error: Error | null, data?: T) => void;

export interface Coordinates {
  latitude: number;
  longitude: number;
}