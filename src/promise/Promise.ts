import * as https from 'https';
import type { WeatherData, NewsResponse } from '../types/index';
import { 
  buildWeatherUrl, 
  buildNewsUrl, 
  formatWeatherData, 
  formatNewsData, 
  formatError,
  detectUserLocation,
  locationToCoordinates,
  type LocationInfo
} from '../utils/MyApi';
import { displayConfig } from '../utils/Configs';

displayConfig();

var userLocation: LocationInfo;

function getWeatherWithPromise(): Promise<WeatherData> {
  return new Promise(function(resolve, reject) {
    var coords = locationToCoordinates(userLocation);
    var url = buildWeatherUrl(coords);
    
    console.log(' Fetching weather data with promises...');
    console.log(` Getting weather for: ${userLocation.city}, ${userLocation.country}`);
    
    https.get(url, function(response) {
      var data = '';
      
      response.on('data', function(chunk) {
        data = data + chunk;
      });
      
      response.on('end', function() {
        try {
          var weatherData: WeatherData = JSON.parse(data);
          console.log(' Weather data received');
          resolve(weatherData);
        } catch (error) {
          reject(new Error('Failed to parse weather data'));
        }
      });
    }).on('error', function(error) {
      reject(error);
    });
  });
}

function getNewsWithPromise(): Promise<NewsResponse> {
  return new Promise(function(resolve, reject) {
    var url = buildNewsUrl();
    
    console.log(' Fetching news data with promises...');
    
    https.get(url, function(response) {
      var data = '';
      
      response.on('data', function(chunk) {
        data = data + chunk;
      });
      
      response.on('end', function() {
        try {
          var newsData: NewsResponse = JSON.parse(data);
          console.log(' News data received');
          resolve(newsData);
        } catch (error) {
          reject(new Error('Failed to parse news data'));
        }
      });
    }).on('error', function(error) {
      reject(error);
    });
  });
}

function demoPromiseChaining(): void {
  console.log('📋 PROMISE DEMONSTRATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('🔍 Detecting your location...');
  detectUserLocation().then(function(location) {
    userLocation = location;
    
    console.log('\n📍 Your Location Information:');
    console.log(`🌍 Country: ${userLocation.country}`);
    console.log(`🏙️  City: ${userLocation.city}, ${userLocation.region}`);
    console.log(`🗺️  Coordinates: ${userLocation.latitude}°N, ${userLocation.longitude}°E`);
    console.log(`🕒 Timezone: ${userLocation.timezone}\n`);
    
    console.log(' Demonstrating Promise Chaining (Sequential Execution)...\n');
    
    getWeatherWithPromise()
      .then(function(weatherData) {
        console.log(formatWeatherData(weatherData));
        return getNewsWithPromise();
      })
      .then(function(newsData) {
        console.log(formatNewsData(newsData));
        console.log(' Sequential promise execution completed!\n');
        
        demoPromiseAllAndRace();
      })
      .catch(function(error) {
        console.error(formatError(error, 'promise chain'));
      });
  }).catch(function(error: any) {
    console.error(' Something went wrong:', error.message);
  });
}

function demoPromiseAll(): void {
  console.log(' Demonstrating Promise.all() (Parallel Execution)...\n');
  
  var weatherPromise = getWeatherWithPromise();
  var newsPromise = getNewsWithPromise();
  
  Promise.all([weatherPromise, newsPromise])
    .then(function(results) {
      var weatherData = results[0];
      var newsData = results[1];
      
      console.log(formatWeatherData(weatherData));
      console.log(formatNewsData(newsData));
      console.log(' Promise.all() execution completed!\n');
      
      demoPromiseRace();
    })
    .catch(function(error) {
      console.error(formatError(error, 'Promise.all()'));
    });
}

function demoPromiseRace(): void {
  console.log(' Demonstrating Promise.race() (First to Complete)...\n');
  
  var weatherPromise = getWeatherWithPromise();
  var newsPromise = getNewsWithPromise();
  
  Promise.race([weatherPromise, newsPromise])
    .then(function(firstResult) {
      console.log(' Promise.race() Result (First to complete):');
      
      if (firstResult && typeof firstResult === 'object' && 'main' in firstResult && 'weather' in firstResult) {
       
        console.log(' Weather data won the race!');
        console.log(formatWeatherData(firstResult as WeatherData));
      } else if (firstResult && typeof firstResult === 'object' && 'posts' in firstResult) {
      
        console.log(' News data won the race!');
        console.log(formatNewsData(firstResult as NewsResponse));
      } else {
      
        console.log(' Unexpected data format received');
        console.log(JSON.stringify(firstResult, null, 2));
      }
      
      console.log(' Promise.race() execution completed!\n');
      console.log(' All Promise demonstrations completed!');
    })
    .catch(function(error) {
      console.error(formatError(error, 'Promise.race()'));
    });
}

function demoPromiseAllAndRace(): void {
  console.log(' PROMISE.ALL() AND PROMISE.RACE() DEMONSTRATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  demoPromiseAll();
}

demoPromiseChaining();
