// components/MapViewComponent.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapViewComponent = ({ onFilter, onAddLivestock, onCalendar }) => {
  return (
    <View style={styles.mapContainer}>
      <Text style={styles.sectionTitle}>Live Location of your Livestock</Text>

      {/* Custom Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.button} onPress={onFilter}>
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onAddLivestock}>
          <Text style={styles.buttonText}>Add Livestock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCalendar}>
          <Text style={styles.buttonText}>Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 17.385044,
          longitude: 78.486671,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude: 17.385044, longitude: 78.486671 }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  map: {
    height: 300,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#097969',
    paddingVertical: 6, // Reduced padding
    paddingHorizontal: 12, // Reduced padding
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,  // Reduced minimum width
  },
  buttonText: {
    color: '#fff',
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
  },
});

export default MapViewComponent;
