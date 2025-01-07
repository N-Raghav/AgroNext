import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import TopNavBar from '../components/NavBar';
import WeatherWidget from '../components/WeatherWidget';
import MapViewComponent from '../components/MapView';
import TasksList from '../components/TasksList';
import CalendarComponent from '../components/Calendar';
import InseminationCycleOverview from '../components/InseminationCycleOverview';
import FAQComponent from '../components/FAQs';
import Footer from '../components/Footer';
import TaskCategory from '../components/TaskCategory'; // Import TaskCategory for task listing

const HomeScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const apiUrl = 'https://c91d-122-164-82-193.ngrok-free.app';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks.');
    }
  };

  useEffect(() => {
    fetchTasks(); // Fetch tasks on initial render
  }, []);

  const taskCategories = {
    "Very Important & Urgent": [],
    "Very Important but not urgent": [],
    "Not Important but urgent": [],
    "Not Important & not urgent": [],
  };

  tasks.forEach((task) => {
    const category = taskCategories[task.importance] || [];
    category.push(task);
  });

  // Render Task Category Header
  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      <Icon name={icon} size={24} color="#097969" />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome to AgroNext, User!</Text>

          {/* Weather Widget */}
          <View style={styles.card}>
            {renderSectionHeader('Weather', 'partly-sunny-outline')}
            <WeatherWidget city="Hyderabad" apiKey="8d3495d7c66b08c7a4faa421d363b47b" />
          </View>

          {/* Farm Overview */}
          <View style={styles.card}>
            {renderSectionHeader('Farm Overview', 'map-outline')}
            <MapViewComponent
              onFilter={() => { /* Filter Logic */ }}
              onAddLivestock={() => { /* Add Logic */ }}
              onCalendar={() => { /* Calendar Logic */ }}
            />
          </View>

          {/* Tasks Section */}
          <View style={styles.card}>
            {renderSectionHeader('Tasks', 'list-outline')}
            {Object.entries(taskCategories).map(([category, categoryTasks]) => (
              <TaskCategory
                key={category}
                category={category}
                tasks={categoryTasks}
              />
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddTasks')}
            >
              <Icon name="add-outline" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add New Task</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <View style={styles.card}>
            {renderSectionHeader('Calendar', 'calendar-outline')}
            <InseminationCycleOverview />
          </View>

          {/* FAQs */}
          <View style={styles.card}>
            {renderSectionHeader('FAQs', 'help-circle-outline')}
            <FAQComponent faqs={[
              { question: 'Who should use the app?', answer: 'Anyone managing livestock can use AgroNext.' },
              { question: 'What is an insemination cycle?', answer: 'It is the period during which a female animal can conceive.' },
              { question: 'How to track my animals insemination cycle?', answer: 'Use the calendar feature in the app.' },
              { question: 'How does AgroNext monitor livestock?', answer: 'It uses GPS and other tracking technologies.' },
              { question: 'Can I track farm activities using AgroNext?', answer: 'Yes, you can log and track various activities.' },
            ]} />
          </View>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#097969',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#097969',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#097969',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
