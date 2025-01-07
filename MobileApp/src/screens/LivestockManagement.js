import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      <ScrollView style={styles.content}>
        <Text style={styles.heading}>Manage Livestock</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddAnimals')}
          >
            <Icon name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Animals</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddGroups')}
          >
            <Icon name="people-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Groups</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyState}>
          <Icon name="clipboard-outline" size={80} color="#097969" />
          <Text style={styles.emptyText}>No Animals to Manage Yet</Text>
          <Text style={styles.emptySubText}>
            Add a new animal or group by clicking the buttons above and they'll show up here!
          </Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('LivestockManagement')}
          >
            <Icon name="calendar-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>View Calendar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSubmit}
          >
            <Icon name="list-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Manage Animals</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#097969',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    flex: 0.48,
  },
  addButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 30,
    marginBottom: 30,
    elevation: 2,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  actionContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#097969',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default LivestockManagement;

