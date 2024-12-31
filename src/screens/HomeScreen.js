import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopNavBar from '../components/NavBar';
import WeatherWidget from '../components/WeatherWidget';
import MapViewComponent from '../components/MapView';
import TasksList from '../components/TasksList';
import CalendarComponent from '../components/Calendar';
import FAQComponent from '../components/FAQs';
import Footer from '../components/Footer';

const HomeScreen = () => {
  const navigation = useNavigation();
  const tasks = [
    { id: '1', title: 'Feed the animals', status: 'Incomplete' },
    { id: '2', title: 'Check water supply', status: 'Important' },
  ];

  const faqs = [
    { question: 'Who should use the app?', answer: 'Anyone managing livestock can use AgroNext.' },
    { question: 'What is an insemination cycle?', answer: 'It is the period during which a female animal can conceive.' },
    { question: 'How to track my animal’s insemination cycle?', answer: 'Use the calendar feature in the app.' },
    { question: 'How does AgroNext monitor livestock?', answer: 'It uses GPS and other tracking technologies.' },
    { question: 'Can I track farm activities using AgroNext?', answer: 'Yes, you can log and track various activities.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <TopNavBar />

      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>Welcome To AgroNext, User!</Text>

        {/* Weather Widget */}
        <WeatherWidget city="Hyderabad" apiKey="8d3495d7c66b08c7a4faa421d363b47b" />

        {/* Map View Component */}
        <MapViewComponent
          onFilter={() => { /* Filter Logic */ }}
          onAddLivestock={() => { /* Add Logic */ }}
          onCalendar={() => { /* Calendar Logic */ }}
        />

        {/* Tasks List */}
        <TasksList tasks={tasks} onAddTask={() => navigation.navigate('AddTasks')} />

        {/* Calendar Component */}
        <CalendarComponent />

        {/* FAQ Component */}
        <FAQComponent faqs={faqs} />
        
        {/* Footer without padding */}
        <Footer style={styles.footerNoPadding} />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerNoPadding: {
    padding: 0, 
    marginTop: 0,
  },
});

export default HomeScreen;
