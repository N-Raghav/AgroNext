import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from 'expo-checkbox';

const TaskItem = ({ task, onToggle }) => (
  <View style={styles.taskItem}>
    <CheckBox
      value={task.isDone ?? false}
      onValueChange={(newValue) => onToggle(task.id, newValue)}
      style={styles.checkbox}
      color={task.isDone ? '#097969' : undefined}
    />
    <Text style={[styles.taskText, task.isDone && styles.completedTask]}>
      {task.title}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  checkbox: {
    marginRight: 10,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6e6e6e',
  },
});

export default TaskItem;
