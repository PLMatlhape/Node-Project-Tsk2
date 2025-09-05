import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface EnvConfig {

  openWeatherApiKey?: string;
  openWeatherBaseUrl: string;
  weatherApiKey?: string;
  weatherApiBaseUrl: string;
  openMeteoBaseUrl: string;

  newsApiKey?: string;
  newsApiBaseUrl: string;
  guardianApiKey?: string;
  guardianBaseUrl: string;
  dummyJsonBaseUrl: string;
  
  defaultLatitude: number;
  defaultLongitude: number;
  
  nodeEnv: string;
  logLevel: string;
}

export const env: EnvConfig = {

  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || undefined,
  openWeatherBaseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
  weatherApiKey: process.env.WEATHER_API_KEY || undefined,
  weatherApiBaseUrl: process.env.WEATHER_API_BASE_URL || 'https://api.weatherapi.com/v1',
  openMeteoBaseUrl: process.env.OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1/forecast',
  
  newsApiKey: process.env.NEWS_API_KEY || undefined,
  newsApiBaseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
  guardianApiKey: process.env.GUARDIAN_API_KEY || undefined,
  guardianBaseUrl: process.env.GUARDIAN_BASE_URL || 'https://content.guardianapis.com',
  dummyJsonBaseUrl: process.env.DUMMY_JSON_BASE_URL || 'https://dummyjson.com/posts',
  
  defaultLatitude: parseFloat(process.env.DEFAULT_LATITUDE || '51.5074'),
  defaultLongitude: parseFloat(process.env.DEFAULT_LONGITUDE || '-0.1278'),
  
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info'
};

export function validateWeatherConfig(): { isValid: boolean; provider: string; error?: string } {
  if (env.openWeatherApiKey) {
    return { isValid: true, provider: 'OpenWeatherMap' };
  }
  
  if (env.weatherApiKey) {
    return { isValid: true, provider: 'WeatherAPI' };
  }
  
  return { isValid: true, provider: 'Open-Meteo (Free)' };
}

export function validateNewsConfig(): { isValid: boolean; provider: string; error?: string } {
  if (env.newsApiKey) {
    return { isValid: true, provider: 'NewsAPI' };
  }
  
  if (env.guardianApiKey) {
    return { isValid: true, provider: 'Guardian API' };
  }
  
  return { isValid: true, provider: 'DummyJSON (Free)' };
}

export function displayConfig(): void {
  console.log('🔧 ENVIRONMENT CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Default Location: ${env.defaultLatitude}°N, ${env.defaultLongitude}°E`);
  
  const weatherConfig = validateWeatherConfig();
  console.log(`🌤️  Weather Provider: ${weatherConfig.provider}`);
  
  const newsConfig = validateNewsConfig();
  console.log(`📰 News Provider: ${newsConfig.provider}`);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}