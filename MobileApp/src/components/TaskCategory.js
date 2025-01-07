import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TaskItem from './TaskItem';

const TaskCategory = ({ category, tasks, onToggle }) => (
  <View style={styles.categoryContainer}>
    <Text style={styles.categoryHeader}>{category}</Text>
    {tasks.length > 0 ? (
      tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} />)
    ) : (
      <Text style={styles.noTasksText}>No tasks in this category</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#097969',
  },
  noTasksText: {
    fontSize: 14,
    color: '#6e6e6e',
    fontStyle: 'italic',
  },
});

export default TaskCategory;
