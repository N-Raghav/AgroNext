// components/TasksList.js
import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

const TasksList = ({ tasks, onAddTask }) => {
  return (
    <View style={styles.tasksContainer}>
      <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.title}</Text>
            <Text>{item.status}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      
      {/* Custom Add Tasks Button */}
      <TouchableOpacity style={styles.button} onPress={onAddTask}>
        <Text style={styles.buttonText}>Add Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tasksContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  button: {
    backgroundColor: '#097969',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TasksList;
