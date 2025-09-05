import https from 'https';
import { WeatherData, NewsResponse } from '../types/index';
import { 
  buildWeatherUrl, 
  buildNewsUrl, 
  formatWeatherData, 
  formatNewsData, 
  formatError,
  detectUserLocation,
  locationToCoordinates,
  LocationInfo
} from '../utils/MyApi';
import { displayConfig } from '../utils/Configs';

displayConfig();
console.log(' Starting Async/Await ...\n');

var userLocation: LocationInfo;

function makeHttpRequest(url: string): Promise<string> {
  return new Promise(function(resolve, reject) {
    https.get(url, function(response) {
      var data = '';
      
      response.on('data', function(chunk) {
        data = data + chunk;
      });
      
      response.on('end', function() {
        resolve(data);
      });
    }).on('error', function(error) {
      reject(error);
    });
  });
}

async function getWeatherDataAsync(): Promise<WeatherData> {
  var coords = locationToCoordinates(userLocation);
  var url = buildWeatherUrl(coords);
  console.log(' Fetching weather data with async/await...');
  console.log(` Getting weather for: ${userLocation.city}, ${userLocation.country}`);
  
  try {
    var data = await makeHttpRequest(url);
    var weatherData: WeatherData = JSON.parse(data);
    console.log(' Weather data received');
    return weatherData;
  } catch (error) {
    throw new Error('Failed to get weather data');
  }
}

async function getNewsDataAsync(): Promise<NewsResponse> {
  var url = buildNewsUrl();
  console.log(' Fetching news data with async/await...');
  
  try {
    var data = await makeHttpRequest(url);
    var newsData: NewsResponse = JSON.parse(data);
    console.log(' News data received');
    return newsData;
  } catch (error) {
    throw new Error('Failed to get news data');
  }
}

async function demoSequentialAsync(): Promise<void> {
  console.log('📋 ASYNC/AWAIT INITIALIZING!!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  try {
    console.log(' Detecting your location...');
    userLocation = await detectUserLocation();
    
    console.log('\n📍 Your Location Information:');
    console.log(`🌍 Country: ${userLocation.country}`);
    console.log(`🏙️  City: ${userLocation.city}, ${userLocation.region}`);
    console.log(`🗺️  Coordinates: ${userLocation.latitude}°N, ${userLocation.longitude}°E`);
    console.log(`🕒 Timezone: ${userLocation.timezone}\n`);
    
    console.log(' Demonstrating Sequential Async/Await...\n');
    
    var weatherData = await getWeatherDataAsync();
    console.log(formatWeatherData(weatherData));
    
    var newsData = await getNewsDataAsync();
    console.log(formatNewsData(newsData));
    
    console.log(' Sequential async/await execution completed!\n');
    
    setTimeout(function() {
      demoParallelAsync();
    }, 3000);
  } catch (error: any) {
    console.error(' Something went wrong:', error.message);
  }
}

async function demoParallelAsync(): Promise<void> {
  console.log(' Demonstrating Async/Await with Promise.all() (Parallel Execution)...\n');
  
  try {
    var weatherPromise = getWeatherDataAsync();
    var newsPromise = getNewsDataAsync();
    
    var results = await Promise.all([weatherPromise, newsPromise]);
    var weatherData = results[0];
    var newsData = results[1];
    
    console.log(' Both requests completed simultaneously!\n');
    console.log(formatWeatherData(weatherData));
    console.log(formatNewsData(newsData));
    
    console.log(' Parallel async/await execution completed!\n');
    
    setTimeout(function() {
      demoErrorHandling();
    }, 3000);
  } catch (error: any) {
    console.error(formatError(error, 'async parallel'));
  }
}

async function demoErrorHandling(): Promise<void> {
  console.log(' Demonstrating Async/Await Error Handling...\n');
  
  try {
    console.log(' Attempting to fetch from a non-existent endpoint...');
    var badUrl = 'https://api.nonexistent-domain-12345.com/data';
    var data = await makeHttpRequest(badUrl);
    console.log('This should not print');
  } catch (error: any) {
    console.log('❌ Expected error caught:\n');
    console.error(formatError(error, 'error handling demo'));
  }
  
  console.log('📡 Now fetching valid data after handling the error...');
  try {
    var weatherData = await getWeatherDataAsync();
    console.log(' Successfully recovered and fetched weather data!\n');
    console.log(formatWeatherData(weatherData));
    
    setTimeout(function() {
      demoAsyncRace();
    }, 3000);
  } catch (error: any) {
    console.error(formatError(error, 'recovery attempt'));
  }
}

async function demoAsyncRace(): Promise<void> {
  console.log(' Demonstrating Async/Await with Promise.race()...\n');
  
  try {
    var weatherPromise = getWeatherDataAsync();
    var newsPromise = getNewsDataAsync();
    
    var result = await Promise.race([weatherPromise, newsPromise]);
    
    if (result.hasOwnProperty('main') || result.hasOwnProperty('weather')) {
      console.log(' Winner: WEATHER API responded first!\n');
      console.log(formatWeatherData(result as WeatherData));
    } else {
      console.log(' Winner: NEWS API responded first!\n');
      console.log(formatNewsData(result as NewsResponse));
    }
    
    console.log(' Async/Await race execution completed!\n');
    
    setTimeout(function() {
      demoAsyncAllSettled();
    }, 3000);
  } catch (error: any) {
    console.error(formatError(error, 'async race'));
  }
}

async function demoAsyncAllSettled(): Promise<void> {
  console.log(' Demonstrating Async/Await with Promise.allSettled()...\n');
  
  var weatherPromise = getWeatherDataAsync();
  var newsPromise = getNewsDataAsync();
  var failPromise = new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error('Simulated API failure'));
    }, 100);
  });
  
  var results = await Promise.allSettled([weatherPromise, newsPromise, failPromise]);
  
  for (var i = 0; i < results.length; i++) {
    var result = results[i];
    if (result && result.status === 'fulfilled') {
      if (i === 0) {
        console.log(' Weather request succeeded:\n');
        console.log(formatWeatherData((result as any).value as WeatherData));
      } else if (i === 1) {
        console.log(' News request succeeded:\n');
        console.log(formatNewsData((result as any).value as NewsResponse));
      }
    } else if (result) {
      console.log(`❌ Request ${i + 1} failed: ${(result as any).reason.message}`);
    }
  }
  
  console.log(' All async/await demonstrations completed successfully!');
}

demoSequentialAsync();
