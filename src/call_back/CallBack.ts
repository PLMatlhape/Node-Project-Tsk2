import https from 'https';
import { WeatherData, NewsResponse, WeatherCallback, NewsCallback } from '../types/index';
import { 
  buildWeatherUrl, 
  buildNewsUrl, 
  formatWeatherData, 
  formatNewsData, 
  formatError,
  detectUserLocationCallback,
  locationToCoordinates,
  LocationInfo
} from '../utils/MyApi';
import { displayConfig } from '../utils/Configs';

displayConfig();
console.log(' Starting Callback ...\n');

var userLocation: LocationInfo;

function getWeatherData(callback: WeatherCallback): void {
  var coords = locationToCoordinates(userLocation);
  var url = buildWeatherUrl(coords);
  
  console.log(' Fetching weather data with callbacks...');
  console.log(` Getting weather for: ${userLocation.city}, ${userLocation.country}`);
  
  https.get(url, function(response) {
    var data = '';
    
    response.on('data', function(chunk) {
      data = data + chunk;
    });
    
    response.on('end', function() {
      try {
        var weatherData: WeatherData = JSON.parse(data);
        console.log(' Step 1: Got weather data!');
        callback(null, weatherData);
      } catch (error) {
        callback({
          message: 'Failed to parse weather data',
          source: 'weather'
        });
      }
    });
  }).on('error', function(error) {
    callback({
      message: error.message,
      source: 'weather'
    });
  });
}

function getNewsData(callback: NewsCallback): void {
  var url = buildNewsUrl();
  
  console.log(' Fetching news data with callbacks...');
  
  https.get(url, function(response) {
    var data = '';
    
    response.on('data', function(chunk) {
      data = data + chunk;
    });
    
    response.on('end', function() {
      try {
        var newsData: NewsResponse = JSON.parse(data);
        console.log(' Step 2: Got news data!');
        callback(null, newsData);
      } catch (error) {
        callback({
          message: 'Failed to parse news data',
          source: 'news'
        });
      }
    });
  }).on('error', function(error) {
    callback({
      message: error.message,
      source: 'news'
    });
  });
}

function showSequentialCallbacks(): void {
  console.log(' Nested (indented)...\n');
  
  getWeatherData(function(weatherError, weatherData) {
    if (weatherError) {
      console.error(formatError(weatherError, 'weather'));
      return;
    }
    
    if (weatherData) {
      console.log(formatWeatherData(weatherData));
    }
    
    getNewsData(function(newsError, newsData) {
      if (newsError) {
        console.error(formatError(newsError, 'news'));
        return;
      }
      
      if (newsData) {
        console.log(formatNewsData(newsData));
      }
      console.log(' Sequential callback execution completed!\n');
      
    });
  });
}

function startDemo(): void {
  console.log('📋 CALLBACK DEMONSTRATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log(' Detecting your location...');
  detectUserLocationCallback(function(error, location) {
    if (error) {
      console.error(' Something went wrong:', error.message);
      return;
    }
    
    userLocation = location!;
    
    console.log('\n📍 Your Location Information:');
    console.log(`🌍 Country: ${userLocation.country}`);
    console.log(`🏙️  City: ${userLocation.city}, ${userLocation.region}`);
    console.log(`🗺️  Coordinates: ${userLocation.latitude}°N, ${userLocation.longitude}°E`);
    console.log(`🕒 Timezone: ${userLocation.timezone}\n`);
    
    showSequentialCallbacks();
  });
}

startDemo();
