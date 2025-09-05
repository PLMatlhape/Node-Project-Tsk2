import type { WeatherData, NewsResponse, Coordinates, OpenWeatherResponse, WeatherApiResponse, NewsApiResponse, GuardianApiResponse } from '../types/index';
import { env, validateWeatherConfig, validateNewsConfig } from './Configs';
import * as https from 'https';
import * as http from 'http';

export interface LocationInfo {
  country: string;     
  city: string;        
  region: string;      
  latitude: number;    
  longitude: number;   
  timezone: string;    
}

export function detectUserLocation(): Promise<LocationInfo> {
  console.log(' Detecting your location automatically...');
  
  return new Promise((resolve, reject) => {
    const url = 'http://ip-api.com/json/';
    
    http.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('error', (error) => {
        console.log('  Network error during location detection, using London as default');
        console.log(' DEBUG: Network error:', error.message);
        resolve(getDefaultLocation());
      });
      
      response.on('end', () => {
        try {
          const locationData = JSON.parse(data);
          console.log(' DEBUG: Raw location data:', locationData);
          
          
          if (locationData.lat && locationData.lon && locationData.status === 'success') {
            const location: LocationInfo = {
              country: locationData.country || 'Unknown',
              city: locationData.city || 'Unknown', 
              region: locationData.regionName || 'Unknown',
              latitude: parseFloat(locationData.lat),
              longitude: parseFloat(locationData.lon),
              timezone: locationData.timezone || 'UTC'
            };
            
            console.log(' Location detected successfully!');
            console.log(`📍 You are in: ${location.city}, ${location.region}, ${location.country}`);
            resolve(location);
          } else {
            
            console.log('  Could not detect location, using London as default');
            console.log(' DEBUG: Missing latitude/longitude in response or API failed');
            resolve(getDefaultLocation());
          }
        } catch (error) {
          console.log('  Location detection failed, using London as default');
          console.log(' DEBUG: Error parsing response:', error);
          console.log(' DEBUG: Raw response data:', data);
          resolve(getDefaultLocation());
        }
      });
    }).on('error', (error) => {
      console.log('  HTTPS request failed during location detection, using London as default');
      console.log(' DEBUG: Request error:', error.message);
      resolve(getDefaultLocation());
    });
  });
}

export function detectUserLocationCallback(callback: (error: Error | null, location?: LocationInfo) => void): void {
  console.log(' Detecting your location with callbacks...');
  
  const url = 'http://ip-api.com/json/';
  
  http.get(url, function(response) {
    var data = '';
    
    response.on('data', function(chunk) {
      data = data + chunk;
    });
    
    response.on('error', function(error) {
      console.log('⚠️  Network error during location detection, using London as default');
      console.log(' DEBUG: Network error:', error.message);
      callback(null, getDefaultLocation());
    });
    
    response.on('end', function() {
      try {
        var locationData = JSON.parse(data);
        console.log('🔍 DEBUG: Raw location data:', locationData);
        
        if (locationData.lat && locationData.lon && locationData.status === 'success') {
          var location: LocationInfo = {
            country: locationData.country || 'Unknown',
            city: locationData.city || 'Unknown', 
            region: locationData.regionName || 'Unknown',
            latitude: parseFloat(locationData.lat),
            longitude: parseFloat(locationData.lon),
            timezone: locationData.timezone || 'UTC'
          };
          
          console.log(' Location detected successfully!');
          console.log(`📍 You are in: ${location.city}, ${location.region}, ${location.country}`);
          callback(null, location);
        } else {
          console.log('⚠️  Could not detect location, using London as default');
          console.log(' DEBUG: Missing latitude/longitude in response or API failed');
          callback(null, getDefaultLocation());
        }
      } catch (error) {
        console.log('⚠️  Location detection failed, using London as default');
        console.log(' DEBUG: Error parsing response:', error);
        console.log(' DEBUG: Raw response data:', data);
        callback(null, getDefaultLocation());
      }
    });
  }).on('error', function(error) {
    console.log('⚠️  HTTPS request failed during location detection, using London as default');
    console.log(' DEBUG: Request error:', error.message);
    callback(null, getDefaultLocation());
  });
}

function getDefaultLocation(): LocationInfo {
  return {
    country: 'South Africa',
    city: 'Pretoria', 
    region: 'Gauteng',
    latitude: 25.5228,
    longitude: 37.3524,
    timezone: 'Africa/South Africa'
  };
}

export function locationToCoordinates(location: LocationInfo): Coordinates {
  return {
    latitude: location.latitude,
    longitude: location.longitude
  };
}

export const DEFAULT_COORDINATES: Coordinates = {
  latitude: env.defaultLatitude,
  longitude: env.defaultLongitude
};

export function buildWeatherUrl(coords: Coordinates = DEFAULT_COORDINATES): string {
  const weatherConfig = validateWeatherConfig();
  
  switch (weatherConfig.provider) {
    case 'OpenWeatherMap':
      return `${env.openWeatherBaseUrl}/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${env.openWeatherApiKey}&units=metric`;
    
    case 'WeatherAPI':
      return `${env.weatherApiBaseUrl}/current.json?key=${env.weatherApiKey}&q=${coords.latitude},${coords.longitude}`;
    
    case 'Open-Meteo (Free)':
    default:
      return `${env.openMeteoBaseUrl}?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
  }
}

export function buildNewsUrl(limit: number = 10): string {
  const newsConfig = validateNewsConfig();
  
  switch (newsConfig.provider) {
    case 'NewsAPI':
      return `${env.newsApiBaseUrl}/top-headlines?apiKey=${env.newsApiKey}&pageSize=${limit}&country=us`;
    
    case 'Guardian API':
      return `${env.guardianBaseUrl}/search?api-key=${env.guardianApiKey}&page-size=${limit}&show-fields=headline,byline&order-by=newest`;
    
    case 'DummyJSON (Free)':
    default:
      return `${env.dummyJsonBaseUrl}?limit=${limit}`;
  }
}

export function formatWeatherData(data: WeatherData | OpenWeatherResponse | WeatherApiResponse): string {
  if ('current_weather' in data) {
    
    const { current_weather, timezone, daily } = data as WeatherData;
    return `
🌤️  WEATHER REPORT (Open-Meteo) 🌤️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: ${data.latitude}°N, ${data.longitude}°E
🕒 Timezone: ${timezone}
🌡️  Current Temperature: ${current_weather.temperature}°C
💨 Wind Speed: ${current_weather.windspeed} km/h
🧭 Wind Direction: ${current_weather.winddirection}°
📅 Today's Forecast:
   - Max: ${daily.temperature_2m_max[0]}°C
   - Min: ${daily.temperature_2m_min[0]}°C
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  } else if ('main' in data) {
    
    const weather = data as OpenWeatherResponse;
    return `
🌤️  WEATHER REPORT (OpenWeatherMap) 🌤️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: ${weather.name}, ${weather.sys.country}
🌡️  Current Temperature: ${weather.main.temp}°C
🌡️  Feels Like: ${weather.main.feels_like}°C
💨 Wind Speed: ${weather.wind.speed} m/s
🧭 Wind Direction: ${weather.wind.deg}°
💧 Humidity: ${weather.main.humidity}%
📊 Pressure: ${weather.main.pressure} hPa
🌤️  Conditions: ${weather.weather?.[0]?.description || 'N/A'}
📅 Today's Range: ${weather.main.temp_min}°C - ${weather.main.temp_max}°C
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  } else if ('current' in data) {
    
    const weather = data as WeatherApiResponse;
    return `
🌤️  WEATHER REPORT (WeatherAPI) 🌤️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: ${weather.location.name}, ${weather.location.country}
🕒 Local Time: ${weather.location.localtime}
🌡️  Current Temperature: ${weather.current.temp_c}°C (${weather.current.temp_f}°F)
🌡️  Feels Like: ${weather.current.feelslike_c}°C
💨 Wind Speed: ${weather.current.wind_kph} km/h
🧭 Wind Direction: ${weather.current.wind_dir}
💧 Humidity: ${weather.current.humidity}%
🌤️  Conditions: ${weather.current.condition.text}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }
  
  return 'Unknown weather data format';
}

export function formatNewsData(data: NewsResponse | NewsApiResponse | GuardianApiResponse): string {
  if ('posts' in data) {
    
    const { posts, total } = data as NewsResponse;
    let formatted = `
 LATEST NEWS HEADLINES (DummyJSON) 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Showing ${posts.length} of ${total} articles
\n`;

    posts.slice(0, 5).forEach((post, index) => {
      formatted += `${index + 1}. ${post.title}
    ${post.reactions.likes} likes |  ${post.reactions.dislikes} dislikes
     Tags: ${post.tags.join(', ')}
   
`;
    });

    formatted += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    return formatted;
  } else if ('articles' in data) {
    
    const news = data as NewsApiResponse;
    let formatted = `
 LATEST NEWS HEADLINES (NewsAPI) 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Showing ${news.articles.length} of ${news.totalResults} articles
\n`;

    news.articles.slice(0, 5).forEach((article, index) => {
      formatted += `${index + 1}. ${article.title}
   📰 Source: ${article.source.name}
   ✍️  Author: ${article.author || 'Unknown'}
   📅 Published: ${new Date(article.publishedAt).toLocaleDateString()}
    ${article.url}
   
`;
    });

    formatted += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    return formatted;
  } else if ('response' in data) {
    
    const guardian = data as GuardianApiResponse;
    let formatted = `
 LATEST NEWS HEADLINES (Guardian) 
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Showing ${guardian.response.results.length} of ${guardian.response.total} articles
\n`;

    guardian.response.results.slice(0, 5).forEach((article, index) => {
      formatted += `${index + 1}. ${article.webTitle}
    Section: ${article.sectionName}
    Published: ${new Date(article.webPublicationDate).toLocaleDateString()}
    ${article.webUrl}
   
`;
    });

    formatted += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    return formatted;
  }
  
  return 'Unknown news data format';
}

export function formatError(error: any, source: string): string {
  return `
❌ ERROR in ${source.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ${error.message || error}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}