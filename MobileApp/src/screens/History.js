import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TopNavBar from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const History = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        name: '',
        animal_type: '',
        breed: '',
        internal_id: '',
        estrous_start_date: '',
        estrous_end_date: '',
    });

    const [showDatePicker, setShowDatePicker] = useState({
        start: false,
        end: false,
    });

    const adjustDateTime = (date, time = '08:00:00') => {
        const adjustedDate = new Date(date);
        const [hour, minute, second] = time.split(':').map(Number);
        
        // Set the local time to 08:00:00
        adjustedDate.setHours(hour, minute, second, 0); 
        
        return adjustedDate.toISOString(); // Convert it to ISO string with the updated local time
    };

    const handleInputChange = (field, value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleSubmit = async () => {
        // Remove the 'Z' from the ISO string by slicing off the last character
        const logData = {
            ...formData,
            estrous_start_date: formData.estrous_start_date.replace('.000Z', ''), // Remove Z from start date
            estrous_end_date: formData.estrous_end_date.replace('.000Z', '')  // Remove Z from end date
        };

        // Log the modified data
        console.log('Form data:', JSON.stringify(logData, null, 2));

        // API endpoint to send the data to
        const apiUrl = 'https://c91d-122-164-82-193.ngrok-free.app/cycles'; // Your API URL

        try {
            // Send the POST request to the API
            const response = await axios.post(apiUrl, logData);
            
            // Handle the response from the API
            if (response.status === 200) {
                alert('Form data submitted successfully!');
                navigation.navigate('ManageInsemination');  // Navigate specifically to ManageInsemination page
            } else {
                alert('There was an issue submitting the form data.');
            }
        } catch (error) {
            // Handle errors if the request fails
            console.error('Error submitting form data:', error);
            alert('There was an error submitting the form data.');
        }
    };

    const showDatepicker = (dateType) => {
        setShowDatePicker({ ...showDatePicker, [dateType]: true });
    };

    const renderInput = (label, field, placeholder, icon) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <Icon name={icon} size={20} color="#097969" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChangeText={(text) => handleInputChange(field, text)}
                />
            </View>
        </View>
    );

    const handleDateChange = (event, selectedDate, dateType) => {
        if (selectedDate) {
            const currentDate = selectedDate || new Date();
            const adjustedDate = adjustDateTime(currentDate, '08:00:00'); // Adjust to 08:00:00 time
            setShowDatePicker({ start: false, end: false });
            handleInputChange(dateType, adjustedDate); // Use adjusted date here
        }
    };

    const renderDateInput = (label, field, placeholder, icon) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity onPress={() => showDatepicker(field)} style={styles.dateInputWrapper}>
                <Icon name={icon} size={20} color="#097969" style={styles.inputIcon} />
                <Text style={styles.dateText}>
                    {formData[field] 
                        ? new Date(formData[field]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) 
                        : placeholder}
                </Text>
            </TouchableOpacity>
            {showDatePicker[field] && (
                <DateTimePicker
                    value={formData[field] ? new Date(formData[field]) : new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => handleDateChange(event, selectedDate, field)}
                />
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <TopNavBar />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>History of Estrous Cycle</Text>

                {renderInput('Name', 'name', 'Enter Name', 'person-outline')}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Animal Type</Text>
                    <View style={styles.pickerWrapper}>
                        <Icon name="paw-outline" size={20} color="#097969" style={styles.inputIcon} />
                        <Picker
                            selectedValue={formData.animal_type}
                            onValueChange={(value) => handleInputChange('animal_type', value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Animal Type" value="animal_type" />
                            <Picker.Item label="Pig" value="Pig" />
                            <Picker.Item label="Buffalo" value="Buffalo" />
                            <Picker.Item label="Cow" value="Cow" />
                        </Picker>
                    </View>
                </View>

                {renderInput('Breed', 'breed', 'Breed of your animal', 'information-circle-outline')}
                {renderInput('Internal ID', 'internal_id', 'Ex: Cow007', 'barcode-outline')}
                {renderDateInput('Estrous Start Date', 'estrous_start_date', 'Select Start Date', 'calendar-outline')}
                {renderDateInput('Estrous End Date', 'estrous_end_date', 'Select End Date', 'calendar-outline')}

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        marginTop: 20,
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#097969',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    inputIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        paddingRight: 10,
        fontSize: 16,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    picker: {
        flex: 1,
        height: 50,
    },
    dateInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        paddingVertical: 12,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#097969',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    submitText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default History;
