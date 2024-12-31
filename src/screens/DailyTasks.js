import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import CheckBox from 'react-native-checkbox';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';
import TopNavBar from '../components/NavBar';
import { TasksContext } from '../components/TasksContext';

const DailyTasks = () => {
  const navigation = useNavigation();
  const { tasks, toggleTaskCompletion } = useContext(TasksContext);

  const taskCategories = {
    "Very Important & Urgent": [],
    "Very Important but not urgent": [],
    "Not Important but urgent": [],
    "Not Important & not urgent": [],
  };

  // Categorize tasks
  tasks.forEach((task) => {
    taskCategories[task.importance]?.push(task);
  });

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.content}>
        <Text style={styles.heading}>Daily Tasks</Text>
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={() => navigation.navigate('AddTasksPage')}
        >
          <Text style={styles.addTaskText}>Add Tasks</Text>
          <Icon name="add" size={18} color="#fff" />
        </TouchableOpacity>

        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="clipboard-outline" size={50} color="#6e6e6e" />
            <Text style={styles.emptyText}>Nothing to do yet?</Text>
            <Text style={styles.emptySubText}>
              Add a new task by clicking the button and check it once done!
            </Text>
          </View>
        ) : (
          <ScrollView>
            {Object.keys(taskCategories).map((category) => (
              <View key={category}>
                <Text style={styles.categoryHeader}>{category}</Text>
                {taskCategories[category].length > 0 ? (
                  taskCategories[category].map((task) => (
                    <View key={task.id} style={styles.taskItem}>
                      <CheckBox
                        value={task.isDone ?? false} // Ensure it's a boolean
                        onValueChange={() => toggleTaskCompletion(task.id)}
                      />

                      <Text style={[styles.taskText, task.isDone && styles.completedTask]}>
                        {task.title}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text>No tasks in this category</Text>
                )}
              </View>
            ))}
          </ScrollView>
        )}

      <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={() => alert('Add Task functionality here')}>
          <Text style={styles.buttonText}>Schedule Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={{}}>
          <Text style={styles.buttonText}>Manage Tasks</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingTop: 10,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#097969',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom: 20,
    marginTop: 5,
    width: '30%',
  },
  addTaskText: {
    fontSize: 14,
    marginRight: 5,
    color: '#fff',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6e6e6e',
    width: '80%',
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  taskText: {
    fontSize: 16,
    marginLeft: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#6e6e6e',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#097969',
    borderRadius: 25,
    height: 50,
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DailyTasks;
