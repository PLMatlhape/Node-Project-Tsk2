# Node-Task2-project

A comprehensive demonstration project showcasing different asynchronous programming patterns in Node.js with TypeScript. This project fetches weather data and news headlines from public APIs using three different approaches: **Callbacks**, **Promises**, and **Async/Await**.

## 🎯 Project Overview

This project demonstrates:
- **Callback-based** asynchronous programming (including callback hell)
- **Promise-based** programming with chaining, `Promise.all()`, `Promise.race()`, and `Promise.allSettled()`
- **Async/Await** syntax for cleaner asynchronous code
- Error handling strategies for each approach
- Parallel vs Sequential execution patterns

## 🏗️ Project Structure

```
Node-Task2-project/
├── package.json              # Project dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── README.md                 # Project documentation
├── .gitignore                # Git ignore rules
└── src/
    ├── CallBack.ts           # Callback implementation
    ├── Promise.ts            # Promise implementation
    ├── Asynchronous.ts       # Async/Await implementation
    ├── types/
    │   └── index.ts          # Type definitions
    └── utils/
        └── MyApi.ts          # Utility functions and formatters
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project (optional):**
   ```bash
   npm run build
   ```

## 🚀 Running the Demonstrations

Each version can be run independently using the provided npm scripts:

### Callback Version
```bash
npm run callback
```
**Demonstrates:**
- Basic callback pattern
- Callback hell with nested callbacks
- Manual parallel execution coordination
- Error handling with callbacks

### Promise Version
```bash
npm run promise
```
**Demonstrates:**
- Promise chaining for sequential execution
- `Promise.all()` for parallel execution
- `Promise.race()` for fastest response
- `Promise.allSettled()` for error-resilient execution
- Promise-based error handling

### Async/Await Version
```bash
npm run async
```
**Demonstrates:**
- Clean async/await syntax
- Sequential execution with await
- Parallel execution with `Promise.all()` and await
- Error handling with try/catch blocks
- Advanced patterns with `Promise.race()` and `Promise.allSettled()`

## 📡 APIs Used

### Weather API
- **Service**: Open-Meteo API
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Data**: Current weather conditions and daily forecast
- **Default Location**: London (51.5074°N, -0.1278°E)

### News API
- **Service**: DummyJSON Posts API
- **URL**: `https://dummyjson.com/posts`
- **Data**: Mock news posts with titles, content, and reactions
- **Default Limit**: 10 posts

## 🔄 Asynchronous Patterns Demonstrated

### 1. Callbacks
```typescript
fetchWeatherCallback((error, data) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  // Nested callback - callback hell!
  fetchNewsCallback((newsError, newsData) => {
    // Handle news data...
  });
});
```

### 2. Promises
```typescript
fetchWeatherPromise()
  .then(weatherData => {
    console.log(weatherData);
    return fetchNewsPromise();
  })
  .then(newsData => {
    console.log(newsData);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

### 3. Async/Await
```typescript
async function fetchData() {
  try {
    const weatherData = await fetchWeatherPromise();
    const newsData = await fetchNewsPromise();
    
    console.log(weatherData, newsData);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## 🎪 Sample Output

### Weather Data Format
```
🌤️  WEATHER REPORT 🌤️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Location: 51.5074°N, -0.1278°E
🕒 Timezone: Europe/London
🌡️  Current Temperature: 18.2°C
💨 Wind Speed: 15.3 km/h
🧭 Wind Direction: 245°
📅 Today's Forecast:
   - Max: 22.1°C
   - Min: 14.8°C
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### News Data Format
```
📰 LATEST NEWS HEADLINES 📰
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Showing 5 of 150 articles

1. His mother had always taught him
   👍 192 likes | 👎 25 dislikes
   🏷️  Tags: crime, mystery, fiction
   
2. He had concluded that computers were useless
   👍 934 likes | 👎 87 dislikes
   🏷️  Tags: tech, opinion, future
```

## 🛡️ Error Handling

Each implementation demonstrates different error handling approaches:

- **Callbacks**: Error-first callback pattern
- **Promises**: `.catch()` method and rejection handling
- **Async/Await**: `try/catch` blocks for synchronous-style error handling

## 📚 Learning Outcomes

After running all three versions, you'll understand:

1. **Callback Evolution**: How callbacks can lead to "callback hell" and coordination difficulties
2. **Promise Benefits**: How Promises solve callback hell and provide better error handling
3. **Async/Await Advantages**: How async/await provides the cleanest, most readable asynchronous code
4. **Parallel Execution**: Different strategies for running multiple async operations simultaneously
5. **Error Handling**: Various patterns for handling errors in asynchronous code
6. **Performance Considerations**: When to use sequential vs parallel execution

## 🔧 Development Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run callback` - Run callback version demo
- `npm run promise` - Run promise version demo
- `npm run async` - Run async/await version demo
- `npm run clean` - Remove build artifacts

## 📦 Dependencies

### Production
- `axios` - HTTP client for making API requests (alternative to built-in https)

### Development
- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution environment
- `@types/node` - Node.js type definitions
- `rimraf` - Cross-platform rm -rf utility

## 🎯 Key Concepts Demonstrated

1. **Event Loop Understanding**: How JavaScript handles asynchronous operations
2. **Callback Patterns**: Traditional Node.js callback patterns and their limitations
3. **Promise Patterns**: Modern promise-based asynchronous programming
4. **Async/Await Syntax**: ES2017+ syntax for cleaner asynchronous code
5. **Error Propagation**: How errors bubble up through different async patterns
6. **Parallel vs Sequential**: Strategic choices for performance optimization

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more API integrations
- Implement additional async patterns
- Enhance error handling
- Add unit tests
- Improve documentation

## 📄 License

MIT License - Feel free to use this project for learning purposes.

---

**Happy Learning!** 🚀