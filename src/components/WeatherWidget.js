// WeatherWidget.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Axios from 'axios';

const WeatherWidget = ({ city, apiKey }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await Axios.get(weatherUrl);
                setWeatherData(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city, apiKey]);

    return (
        <View style={styles.weatherContainer}>
            {loading ? (
                <Text>Loading weather...</Text>
            ) : error ? (
                <Text>{`Error: ${error}`}</Text>
            ) : weatherData ? (
                <>
                    <Text style={styles.weatherText}>Current Weather in {city}</Text>
                    <Text style={styles.weatherDetail}>{weatherData.weather[0].description}</Text>
                    <Text style={styles.weatherLocation}>
                        {weatherData.name}, {weatherData.sys.country}
                    </Text>
                    <Text style={styles.weatherTemp}>{weatherData.main.temp}°C</Text>
                </>
            ) : (
                <Text>No weather data available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    weatherContainer: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 20,
    },
    weatherText: {
        fontSize: 18,
    },
    weatherDetail: {
        fontSize: 16,
    },
    weatherLocation: {
        fontSize: 16,
    },
    weatherTemp: {
        fontSize: 32,
        fontWeight: 'bold',
    },
});

export default WeatherWidget; 
