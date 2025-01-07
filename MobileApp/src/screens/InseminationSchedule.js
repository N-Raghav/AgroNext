import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TopNavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';

const ManageInsemination = () => {
  const navigation = useNavigation();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({}); // State to store marked dates
  const [selectedCow, setSelectedCow] = useState('Cow-2'); // Default to Cow-1
  const [loading, setLoading] = useState(false); // State to handle loading
  
  const cowOptions = [
    { label: 'Cow-1', value: 'Cow-1' },
    { label: 'Cow-2', value: 'Cow-2' },
    { label: 'Cow-3', value: 'Cow-3' },
    { label: 'Cow-4', value: 'Cow-4' },
  ];

  // Handle the scroll event and track the scroll position
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Show footer when the user has scrolled near the bottom (within 200px)
    if (contentHeight - (scrollOffset + screenHeight) < 200) { 
      setIsFooterVisible(true);
    } else {
      setIsFooterVisible(false);
    }
  };

  // Fetch the insemination dates from API
  useEffect(() => {
    const fetchInseminationDates = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://c91d-122-164-82-193.ngrok-free.app/predicted/${selectedCow}`);
        const data = await response.json();
    
        // Log the data to verify its structure
        console.log('API Response:', data);
    
        // Check if the data is an object with a predicted_date field
        if (data && data.predicted_date) {
          // Convert the predicted_date into the required format (yyyy-mm-dd)
          const dateObj = new Date(data.predicted_date);
          const formattedDate = dateObj.toISOString().split('T')[0]; // '2025-02-14'
  
          // Mark the date on the calendar
          setMarkedDates({
            [formattedDate]: { selected: true, marked: true, selectedColor: '#097969' },
          });
        } else {
          console.error('Predicted date not found in API response:', data);
        }
      } catch (error) {
        console.error('Error fetching insemination dates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInseminationDates();
  }, [selectedCow]); // Re-fetch when selectedCow changes

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      <ScrollView 
        style={styles.scrollView} 
        onScroll={handleScroll} 
        scrollEventThrottle={16} 
      >
        <View style={styles.content}>
          <Text style={styles.heading}>Track Insemination Schedule</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddAnimals')}
              >
                <Icon name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Add Animals</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddGroups')}
              >
                <Icon name="people-outline" size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Add Groups</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Insemination Cycle Overview</Text>

            <View style={styles.filterContainer}>
              <RNPickerSelect
                onValueChange={(value) => setSelectedCow(value)}
                items={cowOptions}
                value={selectedCow}
                style={{
                  inputAndroid: {
                    color: '#097969',
                    fontSize: 16,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    backgroundColor: '#e6f3f0',
                    width: 180,
                  },
                  inputIOS: {
                    color: '#097969',
                    fontSize: 16,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    backgroundColor: '#e6f3f0',
                    width: 180,
                  },
                }}
              />
              {loading && <Text>Loading data...</Text>}
            </View>

            <Calendar
              style={styles.calendar}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#097969',
                selectedDayBackgroundColor: '#097969',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#097969',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#097969',
                selectedDotColor: '#ffffff',
                arrowColor: '#097969',
                monthTextColor: '#097969',
                indicatorColor: '#097969',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14
              }}
              markedDates={markedDates} // Use markedDates state here
              onDayPress={day => { /* Handle day press */ }}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('updateCycle')}
            >
              <Icon name="calendar-outline" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Add Insemination Date</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>  navigation.navigate('history')}
            >
              <Icon name="time-outline" size={24} color="#fff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      {isFooterVisible && <Footer />}
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
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#097969',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '48%',
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#fff',
    fontWeight: '500',
  },
  filterContainer: {
    marginBottom: 15,
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#097969',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ManageInsemination;
