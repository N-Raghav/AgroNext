import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/Ionicons';

const InseminationCycleOverview = () => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Insemination Cycle Overview</Text>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => { /* Handle filter action */ }}
      >
        <Text style={styles.filterText}>Filter Livestock</Text>
        <Icon name="filter-outline" size={18} color="#097969" />
      </TouchableOpacity>

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
        markedDates={{
          '2024-12-11': { selected: true, marked: true, selectedColor: '#097969' },
        }}
        onDayPress={day => { /* Handle day press */ }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d4150',
    marginBottom: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f3f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  filterText: {
    fontSize: 16,
    marginRight: 10,
    color: '#097969',
    fontWeight: '500',
  },
  calendar: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 10,
  },
});

export default InseminationCycleOverview;
