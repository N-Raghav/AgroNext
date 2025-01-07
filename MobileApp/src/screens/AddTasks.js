import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Keyboard, TouchableWithoutFeedback,Platform, KeyboardAvoidingView, ActivityIndicator,} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TopNavBar from '../components/NavBar';
import axios from 'axios';
import { parse, format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const AddTasksPage = ({ navigation }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const API_URL = 'https://c91d-122-164-82-193.ngrok-free.app';

  const isValidDate = (date) => {
    try {
      parse(date, 'dd/MM/yyyy', new Date());
      return true;
    } catch {
      return false;
    }
  };

  const isValidTime = (time) => /^([01]?\d|2[0-3]):([0-5]\d)$/.test(time);

  const handleCreateTask = async () => {
    if (!title || !importance) {
      alert('Please fill out the Title and Importance fields.');
      return;
    }
    if (startDate && !isValidDate(startDate)) {
      alert('Please enter a valid Start Date in dd/MM/yyyy format.');
      return;
    }
    if (endDate && !isValidDate(endDate)) {
      alert('Please enter a valid End Date in dd/MM/yyyy format.');
      return;
    }
    if (startTime && !isValidTime(startTime)) {
      alert('Please enter a valid Start Time in HH:mm format.');
      return;
    }
    if (endTime && !isValidTime(endTime)) {
      alert('Please enter a valid End Time in HH:mm format.');
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
      dueDate: dueDate ? format(parse(dueDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : '',
      repeat,
      startDate: startDate ? format(parse(startDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : '',
      startTime,
      endDate: endDate ? format(parse(endDate, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd') : '',
      endTime,
      isDone: false,
    };

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/tasks`, newTask);
      console.log('Task created successfully:', response.data);
      alert('Task created successfully');

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
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate, type) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = format(currentDate, 'dd/MM/yyyy');
    if (type === 'start') {
      setStartDate(formattedDate);
      setShowStartDatePicker(false);
    } else if (type === 'end') {
      setEndDate(formattedDate);
      setShowEndDatePicker(false);
    }
  };

  const handleTimeChange = (event, selectedTime, type) => {
    const currentTime = selectedTime || new Date();
    const formattedTime = format(currentTime, 'HH:mm');
    if (type === 'start') {
      setStartTime(formattedTime);
      setShowStartTimePicker(false);
    } else if (type === 'end') {
      setEndTime(formattedTime);
      setShowEndTimePicker(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'android' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <TopNavBar />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.header}>New Task</Text>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#097969" />
              </View>
            )}

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Feed Cattle"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What needs to be done?"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
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
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={status}
                    style={styles.picker}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                  >
                    <Picker.Item label="To Do" value="To Do" />
                    <Picker.Item label="In Progress" value="In Progress" />
                    <Picker.Item label="Done" value="Done" />
                    <Picker.Item label="Incomplete" value="Incomplete" />
                  </Picker>
                </View>
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
                <Text style={styles.label}>Repeats</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={repeat}
                    style={styles.picker}
                    onValueChange={(itemValue) => setRepeat(itemValue)}
                  >
                    <Picker.Item label="Does not repeat" value="Does not repeat" />
                    <Picker.Item label="Daily" value="Daily" />
                    <Picker.Item label="Monthly" value="Monthly" />
                    <Picker.Item label="Yearly" value="Yearly" />
                  </Picker>
                </View>
              </View>
            </View>

            <Text style={styles.header}>Schedule Task</Text>

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Starting Date</Text>
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateInput}>
                  <Text style={styles.dateText}>{startDate || 'Select Start Date'}</Text>
                  <Icon name="calendar-outline" size={24} color="#097969" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Starting Time</Text>
                <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.dateInput}>
                  <Text style={styles.dateText}>{startTime || 'Select Start Time'}</Text>
                  <Icon name="time-outline" size={24} color="#097969" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ending Date</Text>
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateInput}>
                  <Text style={styles.dateText}>{endDate || 'Select End Date'}</Text>
                  <Icon name="calendar-outline" size={24} color="#097969" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ending Time</Text>
                <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.dateInput}>
                  <Text style={styles.dateText}>{endTime || 'Select End Time'}</Text>
                  <Icon name="time-outline" size={24} color="#097969" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.buttonText, styles.closeButtonText]}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCreateTask}>
                <Text style={styles.buttonText}>Add Task</Text>
              </TouchableOpacity>
            </View>

            {showStartDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'start')}
              />
            )}
            {showEndDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => handleDateChange(event, selectedDate, 'end')}
              />
            )}
            {showStartTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'start')}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => handleTimeChange(event, selectedTime, 'end')}
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#097969',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
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
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  radioGroup: {
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioOuterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#097969',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioOuter: {
    borderColor: '#097969',
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#097969',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#097969',
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#097969',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  closeButtonText: {
    color: '#097969',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1000,
  },
});

export default AddTasksPage;
