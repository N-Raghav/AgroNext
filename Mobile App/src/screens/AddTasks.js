import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAvoidingView, Platform } from 'react-native';
import TopNavBar from '../components/NavBar';
import { TasksContext } from '../components/TasksContext';

const AddTasksPage = ({ navigation }) => {
  const { addTask } = useContext(TasksContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [associatedAnimal, setAssociatedAnimal] = useState('');
  const [importance, setImportance] = useState('');
  const [status, setStatus] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [repeat, setRepeat] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  // Validation helper functions
  const isValidDate = (date) => /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(date);
  const isValidTime = (time) => /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time);

  const handleCreateTask = () => {
    if (!title || !importance) {
      alert('Please fill out the Title and Importance fields.');
      return;
    }
    if (startDate && !isValidDate(startDate)) {
      alert('Please enter a valid Start Date in dd/mm/yyyy format.');
      return;
    }
    if (endDate && !isValidDate(endDate)) {
      alert('Please enter a valid End Date in dd/mm/yyyy format.');
      return;
    }
    if (startTime && !isValidTime(startTime)) {
      alert('Please enter a valid Start Time in HH:MM format.');
      return;
    }
    if (endTime && !isValidTime(endTime)) {
      alert('Please enter a valid End Time in HH:MM format.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      associatedAnimal,
      importance,
      status,
      assignedTo,
      dueDate,
      repeat,
      startDate,
      startTime,
      endDate,
      endTime,
      isDone: false,
    };

    addTask(newTask);

    setTitle('');
    setDescription('');
    setAssociatedAnimal('');
    setImportance('');
    setStatus('');
    setAssignedTo('');
    setDueDate('');
    setRepeat('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');

    navigation.goBack();
  };

  return (

    <SafeAreaView style={styles.container}>
      <TopNavBar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>New Task</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Feed cattle"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Associated Animal</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Pig, Buffalo, etc"
            value={associatedAnimal}
            onChangeText={setAssociatedAnimal}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Importance of Task</Text>
          <View style={styles.radioGroup}>
            {['Very Important & urgent', 'Very Important but not urgent', 'Not Important but urgent', 'Not Important & not urgent'].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.radioButton}
                onPress={() => setImportance(item)}
              >
                <View
                  style={[
                    styles.radioOuterCircle,
                    importance === item && styles.selectedRadioOuter,
                  ]}
                >
                  {importance === item && <View style={styles.radioInnerCircle} />}
                </View>
                <Text style={styles.radioText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Status</Text>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Picker.Item label="To Do" value="To Do" style={styles.input}/>
            <Picker.Item label="In Progress" value="In Progress" style={styles.input} />
            <Picker.Item label="Done" value="Done"style={styles.input}/>
            <Picker.Item label="Incomplete" value="Incomplete" style={styles.input}/>
          </Picker>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Assigned To</Text>
          <TextInput
            style={styles.input}
            placeholder="Name of Assignee"
            value={assignedTo}
            onChangeText={setAssignedTo}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Due Date</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/yyyy"
            value={dueDate}
            onChangeText={setDueDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Repeats</Text>
          <Picker
            selectedValue={repeat}
            style={styles.picker}
            onValueChange={(itemValue) => setRepeat(itemValue)}
          >
            <Picker.Item label="Does not repeat" value="Does not repeat" style={styles.input} />
            <Picker.Item label="Daily" value="Daily" style={styles.input} />
            <Picker.Item label="Monthly" value="Monthly" style={styles.input} />
            <Picker.Item label="Yearly" value="Yearly" style={styles.input}/>
          </Picker>
        </View>

        <Text style={styles.header}>Schedule Task</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Starting Date</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/yyyy"
            value={startDate}
            onChangeText={setStartDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Starting Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={startTime}
            onChangeText={setStartTime}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ending Date</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/mm/yyyy"
            value={endDate}
            onChangeText={setEndDate}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ending Time</Text>
          <TextInput
            style={styles.input}
            placeholder="HH:MM"
            value={endTime}
            onChangeText={setEndTime}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 15,
    height: 45,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
    fontSize: 15,
    height: 50,
  },
  inputGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginBottom: 5,
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioOuterCircle: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioOuter: {
    borderColor: '#097969',
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#097969',
  },
  radioText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#097969',
    borderRadius: 25,
    height: 40,
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

export default AddTasksPage;
