import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import Footer from '../components/Footer';
import TopNavBar from '../components/NavBar';
import TaskCategory from '../components/TaskCategory';
import EmptyState from '../components/EmptyState';

const DailyTasks = () => {
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
    fetchTasks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const handleToggleTask = (taskId, isDone) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, isDone } : task
      )
    );
  };

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

  return (
    <SafeAreaView style={styles.container}>
      <TopNavBar />
      <View style={styles.content}>
        <Text style={styles.heading}>Daily Tasks</Text>
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => navigation.navigate('AddTasksPage')}
        >
          <Text style={styles.addTaskText}>Add Tasks</Text>
          <Icon name="add-circle-outline" size={24} color="#fff" />
        </TouchableOpacity>

        {tasks.length === 0 ? (
          <EmptyState />
        ) : (
          <ScrollView style={styles.taskList}>
            {Object.entries(taskCategories).map(([category, categoryTasks]) => (
              <TaskCategory
                key={category}
                category={category}
                tasks={categoryTasks}
                onToggle={handleToggleTask}
              />
            ))}
          </ScrollView>
        )}

        {/* Add Buttons for Schedule and Manage Tasks */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert('Schedule Tasks functionality here')}
          >
            <Icon name="calendar-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Schedule Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => alert('Manage Tasks functionality here')}
          >
            <Icon name="list-outline" size={24} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Manage Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#097969',
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#097969',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  addTaskText: {
    fontSize: 16,
    marginRight: 8,
    color: '#fff',
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#097969',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
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

export default DailyTasks;
