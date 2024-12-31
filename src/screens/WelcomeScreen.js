import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import logo from '../../assets/logo120.png';

const WelcomeScreen = ({ navigation }) => {
  const [farmDetails, setFarmDetails] = useState({
    farmName: '',
    country: '',
    city: '',
    address: '',
    state: '',
    pincode: '',
  });

  const handleInputChange = (field, value) => {
    setFarmDetails({ ...farmDetails, [field]: value });
  };

  const goToNext = () => {
    navigation.navigate('Home', { farmDetails });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome To AgroNext!</Text>
      <Image source={logo} style={styles.image} />

      <Text style={styles.subtitle}>Let’s get started! Please provide your farm details.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Farm Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your farm name"
          value={farmDetails.farmName}
          onChangeText={(text) => handleInputChange('farmName', text)}
        />
      </View>

      <Text style={styles.sectionTitle}>Where is your farm located?</Text>
      <View style={styles.locationRow}>
        <TextInput
          style={styles.halfInput}
          placeholder="Country"
          value={farmDetails.country}
          onChangeText={(text) => handleInputChange('country', text)}
        />
        <TextInput
          style={styles.halfInput}
          placeholder="City"
          value={farmDetails.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
      </View>

      {[
        { label: 'Address', field: 'address' },
        { label: 'State', field: 'state' },
        { label: 'Pincode', field: 'pincode' },
      ].map((item, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{item.label}</Text>
          <TextInput
            style={styles.input}
            placeholder={item.label}
            value={farmDetails[item.field]}
            onChangeText={(text) => handleInputChange(item.field, text)}
          />
        </View>
      ))}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Add Livestock functionality here')}>
          <Text style={styles.buttonText}>Add Livestock</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  image: {
    resizeMode: 'contain',
    width: 150,
    alignSelf: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 4,
    color: '#34495e',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight:'400',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 15,
    height: 45,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  halfInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 15,
    height: 45,
    marginHorizontal: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#097969',
    borderRadius: 25,
    height: 50,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export { WelcomeScreen };
