import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import TopNavBar from '../components/NavBar';

const LivestockManagement = () => {
  const navigation = useNavigation();
  const handleSubmit = () => {
    console.log("Add Animal button clicked");
};

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.content}>
        <Text style={styles.heading}>Manage Livestock</Text>
        <TouchableOpacity
          style={styles.addAnimalButton}
          onPress={() => navigation.navigate('AddAnimals')}
        >
          <Text style={styles.addAnimalText}>Add Animals</Text>
          <Icon name="add" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addAnimalButton}
          onPress={() => navigation.navigate('AddGroups')}
        >
          <Text style={styles.addAnimalText}>Add Groups</Text>
          <Icon name="add" size={18} color="#fff" />
        </TouchableOpacity>

          <View style={styles.emptyState}>
            <Icon name="clipboard-outline" size={50} color="#6e6e6e" />
            <Text style={styles.emptyText}>No Animals to Manage Yet?</Text>
            <Text style={styles.emptySubText}>
              Add a new animal/group by clicking the button and they'll show up here!
            </Text>
          </View>

            {/* Buttons */}
            <View style={styles.buttonRow}>
            <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('LivestockManagement')}
            >
            <Text style={styles.buttonText}>View Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit} // Save details to the console
            >
            <Text style={styles.buttonText}>Manage Animals</Text>
            </TouchableOpacity>
            </View>

      </View>
      
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingTop: 10,
  },
  addAnimalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#097969',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 20,
    marginTop: 5,
    width: '35%',
  },
  addAnimalText: {
    fontSize: 14,
    marginRight: 15,
    color: '#fff',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6e6e6e',
    width: '80%',
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
    width: '40%',
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

export default LivestockManagement;
