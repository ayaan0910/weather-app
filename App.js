import React, { useState, useEffect } from 'react'; 
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'; 
import axios from 'axios'; 
import * as Location from 'expo-location'; 

export default function App() { 
  const [weather, setWeather] = useState(null); 
  const [cityName, setCityName] = useState("Your Location"); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const fetchWeatherByLocation = async () => { 
    setLoading(true); 
    setError(null); 
    try { 
      let { status } = await Location.requestForegroundPermissionsAsync(); 
      if (status !== 'granted') { 
        setError('Permission to access location was denied. Showing default (London).'); 
        await getWeatherData(51.5074, -0.1278); 
        return; 
      } 
      let location = await Location.getCurrentPositionAsync({}); 
      const { latitude, longitude } = location.coords; 
      let geocode = await Location.reverseGeocodeAsync({ latitude, longitude }); 
      if (geocode.length > 0 && geocode.city) { 
        setCityName(geocode.city); 
      } else if (geocode.length > 0 && geocode.name) { 
        setCityName(geocode.name); 
      } 
      await getWeatherData(latitude, longitude); 
    } catch (err) { 
      if (err.response) { 
        console.error("Server Error Data:", err.response.data); 
        console.error("Server Status:", err.response.status); 
      } else if (err.request) { 
        console.error("No response received. Check internet connection:", err.request); 
      } else { 
        console.error("Axios Setup Error:", err.message); 
      } 
      setError("Network or Location error occurred."); 
      setLoading(false); 
    } 
  }; 

  const getWeatherData = async (lat, lon) => { 
    try { 
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph`; 
     const response = await axios.get(url, {
  timeout: 15000
});
      setWeather(response.data.current); 
    } catch (err) { 
      console.error("Weather API request failed:", err.message); 
      throw err; 
    } finally { 
      setLoading(false); 
    } 
  }; 

  useEffect(() => { 
    fetchWeatherByLocation(); 
  }, []); 

  const getWeatherDesc = (code) => { 
    if (code === 0) return "Clear Sky ☀️"; 
    if (code >= 1 && code <= 3) return "Partly Cloudy ⛅"; 
    if (code >= 45 && code <= 48) return "Foggy 🌫️"; 
    if (code >= 51 && code <= 67) return "Rainy 🌧️"; 
    if (code >= 71 && code <= 77) return "Snowy ❄️"; 
    return "Unknown Weather"; 
  }; 

 if (loading) {
  return (
    <View style={styles.center}>
      <Text style={styles.name}>Welcome Bro!!!!!</Text>

      <ActivityIndicator size="large" color="#1066e1" />

      <Text style={styles.loadingText}>
        Fetching Local Weather...
      </Text>
    </View>
  );
} 

  return ( 
    <View style={styles.container}> 
      {error && <Text style={styles.errorText}>{error}</Text>} 
      <Text style={styles.name}>Welcome Bro!!!!!</Text>
      <View style={styles.weatherCard}> 
        <Text style={styles.cityText}>{cityName}</Text> 
        {weather && ( 
          <> 
            <Text style={styles.tempText}>{Math.round(weather.temperature_2m)}°F</Text> 
            <Text style={styles.descText}>{getWeatherDesc(weather.weather_code)}</Text> 
            <Text style={styles.subText}>Wind: {weather.wind_speed_10m} mph</Text> 
          </> 
        )} 
      </View> 
      <TouchableOpacity style={styles.refreshButton} onPress={fetchWeatherByLocation}> 
        <Text style={styles.buttonText}>Refresh Location</Text> 
      </TouchableOpacity> 
    </View> 
  ); 
} 

const styles = StyleSheet.create({ 
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  }, 
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }, 
  loadingText: { 
    marginTop: 10, 
    color: '#555', 
    fontWeight: '500' 
  }, 
  weatherCard: { 
    backgroundColor: '#fff', 
    width: '100%', 
    padding: 30, 
    borderRadius: 20, 
    alignItems: 'center', 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8 
  }, 
  cityText: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#333' 
  }, 
  tempText: { 
    fontSize: 64, 
    fontWeight: '300', 
    color: '#1066e1', 
    marginVertical: 10 
  }, 
  descText: { 
    fontSize: 20, 
    fontWeight: '500', 
    color: '#555', 
    marginBottom: 15 
  }, 
  subText: { 
    fontSize: 14, 
    color: '#888' 
  }, 
  errorText: { 
    color: '#ff4d4d', 
    fontSize: 14, 
    marginBottom: 15, 
    textAlign: 'center', 
    paddingHorizontal: 10 
  }, 
  refreshButton: { 
    backgroundColor: '#1066e1', 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginTop: 30 
  }, 
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 },
  name: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  color: '#000'
}
});
