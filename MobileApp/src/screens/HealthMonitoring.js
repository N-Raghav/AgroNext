import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';
import TopNavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = "https://c91d-122-164-82-193.ngrok-free.app";
const slaveId = "Cow-1";

const HealthMonitoring = () => {
  const [data, setData] = useState({
    temperature: [],
    activityLevel: [],
    milkProductivity: [],
    bodyConditionScore: [],
    feedIntake: [],
    rumenPh: [],
  });

  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/cow_data/${slaveId}`);
      const cowData = response.data;

      setData({
        temperature: cowData.body_temperature.map(item => item.value) || [],
        activityLevel: cowData.activity_level.map(item => item.value) || [],
        milkProductivity: cowData.milk_production.map(item => item.value) || [],
        bodyConditionScore: cowData.body_condition_score.map(item => item.value) || [],
        feedIntake: cowData.feed_intake.map(item => item.value) || [],
        rumenPh: cowData.rumen_ph.map(item => item.value) || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const cleanData = (dataPoints) => {
    return dataPoints.map((point) => {
      const number = parseFloat(point);
      return isNaN(number) ? 0 : number;
    });
  };

  const renderChart = (dataPoints, color) => {
    if (!dataPoints || dataPoints.length === 0) {
      return <Text style={styles.noDataText}>No data available</Text>;
    }
    const cleanedData = cleanData(dataPoints);

    return (
      <LineChart
        data={{
          labels: cleanedData.map((_, index) => `${index + 1}`),
          datasets: [
            {
              data: cleanedData,
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => color,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: color,
          },
        }}
        bezier
        style={styles.chart}
      />
    );
  };

  const renderSection = (title, dataKey, unit, color) => {
    const isExpanded = expandedSection === dataKey;
    const latestValue = data[dataKey].length > 0 ? data[dataKey][data[dataKey].length - 1] : 'No data';

    return (
      <TouchableOpacity
        style={[styles.section, isExpanded && styles.expandedSection]}
        onPress={() => setExpandedSection(isExpanded ? null : dataKey)}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.value}>{`${latestValue} ${unit}`}</Text>
          </View>
          <Icon
            name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={24}
            color="#097969"
          />
        </View>
        {isExpanded && renderChart(data[dataKey], color)}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      <ScrollView style={styles.content}>
        <Text style={styles.header}>Health Monitoring Dashboard</Text>
        <Text style={styles.subHeader}>{`Cow ID: ${slaveId}`}</Text>
        
        {renderSection('Body Temperature', 'temperature', '°C', '#FF6384')}
        {renderSection('Activity Level', 'activityLevel', 'steps/day', '#36A2EB')}
        {renderSection('Milk Productivity', 'milkProductivity', 'liters/day', '#FFCE56')}
        {renderSection('Body Condition Score', 'bodyConditionScore', 'BCS', '#4BC0C0')}
        {renderSection('Feed Intake', 'feedIntake', 'kg/day', '#9966FF')}
        {renderSection('Rumen pH', 'rumenPh', 'pH', '#FF9F40')}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#097969',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  expandedSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#097969',
    marginBottom: 5,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 10,
  },
});

export default HealthMonitoring;

