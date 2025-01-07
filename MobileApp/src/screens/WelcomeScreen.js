import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

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

  const renderInput = (label, field, placeholder, icon) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <Icon name={icon} size={20} color="#097969" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={farmDetails[field]}
          onChangeText={(text) => handleInputChange(field, text)}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image source={require('../../assets/logo120.png')} style={styles.logo} />
            <Text style={styles.title}>Welcome to AgroNext!</Text>
            <Text style={styles.subtitle}>Let's get started with your farm details.</Text>
          </View>

          <View style={styles.card}>
            {renderInput('Farm Name', 'farmName', 'Enter your farm name', 'leaf-outline')}

            <Text style={styles.sectionTitle}>Where is your farm located?</Text>
            <View style={styles.locationRow}>
              <View style={styles.halfWidth}>
                {renderInput('Country', 'country', 'Country', 'flag-outline')}
              </View>
              <View style={styles.halfWidth}>
                {renderInput('City', 'city', 'City', 'business-outline')}
              </View>
            </View>

            {renderInput('Address', 'address', 'Enter your address', 'home-outline')}
            {renderInput('State', 'state', 'Enter your state', 'map-outline')}
            {renderInput('Pincode', 'pincode', 'Enter your pincode', 'mail-outline')}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => alert('Add Livestock functionality here')}
            >
              <Icon name="add-circle-outline" size={20} color="#097969" style={styles.buttonIcon} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Add Livestock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goToNext}>
              <Text style={styles.buttonText}>Next</Text>
              <Icon name="arrow-forward-outline" size={20} color="#fff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#097969',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    marginTop: 10,
    color: '#097969',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10, // Added for consistent spacing
    paddingVertical: Platform.OS === 'android' ? 8 : 12, // Adjusted for Android
    fontSize: 16,
    color: '#333',
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 5,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#097969',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#097969',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#097969',
  },
  buttonIcon: {
    marginLeft: 5,
  },
});

export { WelcomeScreen };
