# Weather Dashboard

A modern, responsive weather dashboard application that provides real-time weather updates, forecasts, and air quality information from around the world.

## Features

### 🌍 Weather Information
- **Current Weather**: Real-time temperature, weather conditions, and feels-like temperature
- **Detailed Metrics**: Humidity, wind speed, pressure, visibility, and cloudiness
- **Weather Icons**: Beautiful, clear weather condition icons
- **5-Day Forecast**: Daily forecasts with high/low temperatures and precipitation probability
- **24-Hour Hourly Forecast**: Hourly weather predictions for better planning

### 🌅 Sun & Moon Information
- Sunrise and sunset times
- Moonrise and moonset times
- Based on your location

### 💨 Air Quality Monitoring
- AQI (Air Quality Index) rating
- Pollution level indicators
- Pollutant measurements:
  - PM2.5 (Fine Particulate Matter)
  - PM10 (Coarse Particulate Matter)
  - O₃ (Ozone)
  - NO₂ (Nitrogen Dioxide)

### 🔍 Search & Geolocation
- Search any city worldwide
- City name autocomplete suggestions
- Use your device's GPS location
- Recent search history (saved locally)

### 📱 Responsive Design
- Mobile-first approach
- Works seamlessly on all devices
- Touch-friendly interface
- Optimized performance

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Dynamic functionality
- **OpenWeatherMap API**: Weather data source
- **Local Storage**: Recent search persistence

## API Integration

This dashboard uses the **OpenWeatherMap API** with the following endpoints:

1. **Weather API** (`/data/2.5/weather`)
   - Current weather conditions
   - Temperature, humidity, wind speed, etc.

2. **Forecast API** (`/data/2.5/forecast`)
   - 5-day forecast
   - 3-hour interval predictions

3. **Air Pollution API** (`/data/2.5/air_pollution`)
   - Air Quality Index (AQI)
   - Pollutant concentrations

4. **Geocoding API** (`/geo/1.0/direct`)
   - City name to coordinates conversion
   - City search suggestions

## How to Use

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weather-dashboard
   ```

2. **Open the application**
   - Simply open `index.html` in your web browser
   - No build tools or installation required

3. **Getting an API Key** (Optional)
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key
   - Replace the `API_KEY` variable in `script.js`

### Usage

1. **Search a City**
   - Type a city name in the search box
   - Select from suggestions or press Enter
   - View current weather and forecasts

2. **Use Your Location**
   - Click the 📍 location button
   - Allow browser permission to access location
   - Automatically loads weather for your position

3. **View Recent Searches**
   - Previously searched cities appear below
   - Click any city to reload its weather
   - History is saved in your browser

## File Structure

```
weather-dashboard/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling system
├── script.js       # Application logic and API integration
└── README.md       # This file
```

## CSS Features

### Design System
- **Dark Theme**: Modern dark interface with blue accents
- **Light Theme**: Optional light mode support
- **CSS Variables**: Easy customization
- **Responsive Grid**: Adapts to all screen sizes
- **Smooth Animations**: Transitions and hover effects

### Color Palette
- Primary Background: `#0f172a`
- Secondary Background: `#1e293b`
- Accent Blue: `#3b82f6`
- Accent Cyan: `#06b6d4`
- Accent Green: `#10b981`
- Text Colors: White, secondary gray, muted gray

## JavaScript Features

### Core Functions
- `searchCity(city)`: Search weather by city name
- `fetchWeatherByCoords(lat, lon)`: Fetch weather by coordinates
- `displayWeather()`: Render weather data to DOM
- `handleGeolocation()`: Get user's GPS location
- `handleSuggestions()`: Display city search suggestions

### Data Management
- Local storage for recent searches
- State management for current weather
- Asynchronous data fetching with Promise.all()
- Error handling and user feedback

## Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Geolocation support required for location feature

## Error Handling

- City not found errors
- API request failures
- Geolocation permission denied
- Network connectivity issues
- User-friendly error messages

## Performance Optimizations

- Lazy loading for city suggestions
- Efficient DOM updates
- CSS animations with GPU acceleration
- Minimal API calls
- Local caching of search history

## Future Enhancements

- [ ] Multiple city tracking
- [ ] Weather alerts and notifications
- [ ] Temperature unit toggle (°C/°F/K)
- [ ] Dark/Light theme toggle
- [ ] Radar and satellite imagery
- [ ] Air quality map visualization
- [ ] Climate data trends
- [ ] Weather sharing functionality
- [ ] Favorite cities management
- [ ] Push notifications

## Troubleshooting

### "City not found"
- Ensure you're typing the correct city name
- Try the full city name with country
- Check your internet connection

### "Geolocation not available"
- Enable location services in browser settings
- Use HTTPS protocol for better security
- Check device location settings

### "API limit reached"
- Free tier OpenWeatherMap has request limits
- Wait a moment before making another request
- Consider upgrading your API plan

## License

This project is open source and available for personal and educational use.

## Resources

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs - Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)

## Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Weather Dashboard** - Real-time weather at your fingertips 🌤️