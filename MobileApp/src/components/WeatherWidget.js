import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
        <View style={styles.container}>
            <View style={styles.weatherCard}>
                {loading ? (
                    <Text style={styles.loadingText}>Loading weather...</Text>
                ) : error ? (
                    <Text style={styles.errorText}>{`Error: ${error}`}</Text>
                ) : weatherData ? (
                    <>
                        <Text style={styles.weatherStatus}>
                            {weatherData.weather[0].description}
                        </Text>
                        <View style={styles.divider} />
                        <View style={styles.locationInfo}>
                            <Text style={styles.cityName}>{weatherData.name}, {weatherData.sys.country}</Text>
                            <Text style={styles.day}>Today</Text>
                        </View>
                        <View style={styles.temperatureInfo}>
                            <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
                            <Text style={styles.feelsLike}>
                                Feels like: {Math.round(weatherData.main.feels_like)}°C
                            </Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.noDataText}>No weather data available</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fffff', 
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    weatherCard: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    weatherStatus: {
        fontSize: 18,
        textAlign: 'center',
        textTransform: 'capitalize',
        fontWeight: '600',
        color: '#555',
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
    locationInfo: {
        alignItems: 'center',
        marginBottom: 10,
    },
    cityName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#097969',
    },
    day: {
        fontSize: 16,
        color: '#777',
    },
    temperatureInfo: {
        alignItems: 'center',
    },
    temperature: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ff9900',
    },
    feelsLike: {
        fontSize: 14,
        color: '#555',
    },
    loadingText: {
        fontSize: 16,
        color: '#999',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});

export default WeatherWidget;

