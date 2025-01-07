import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import TopNavBar from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

const UpdateCycle = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        name: '',
        animalType: '',
        breed: '',
        internalId: '',
        estrusStartDate: '',
        estrusEndDate: '',
        cycleLength: '',
    });

    const [showDatePicker, setShowDatePicker] = useState({
        start: false,
        end: false,
    });

    const handleInputChange = (field, value) => {
        setFormData(prevData => ({ ...prevData, [field]: value }));
    };

    const handleSubmit = () => {
        console.log(formData);
        navigation.goBack();
    };

    const handleDateChange = (event, selectedDate, dateType) => {
        if (selectedDate) {
            const currentDate = selectedDate || new Date();
            setShowDatePicker({ start: false, end: false });
            handleInputChange(dateType, currentDate.toLocaleDateString());
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

    const renderDateInput = (label, field, placeholder, icon) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity onPress={() => showDatepicker(field)} style={styles.dateInputWrapper}>
                <Icon name={icon} size={20} color="#097969" style={styles.inputIcon} />
                <Text style={styles.dateText}>{formData[field] || placeholder}</Text>
            </TouchableOpacity>
            {showDatePicker[field] && (
                <DateTimePicker
                    value={new Date()}
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
                <Text style={styles.header}>Update Estrus Cycle</Text>

                {renderInput('Name', 'name', 'Enter Name', 'person-outline')}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Animal Type</Text>
                    <View style={styles.pickerWrapper}>
                        <Icon name="paw-outline" size={20} color="#097969" style={styles.inputIcon} />
                        <Picker
                            selectedValue={formData.animalType}
                            onValueChange={(value) => handleInputChange('animalType', value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select Animal Type" value="" />
                            <Picker.Item label="Pig" value="Pig" />
                            <Picker.Item label="Buffalo" value="Buffalo" />
                            <Picker.Item label="Cow" value="Cow" />
                        </Picker>
                    </View>
                </View>

                {renderInput('Breed', 'breed', 'Breed of your animal', 'information-circle-outline')}
                {renderInput('Internal ID', 'internalId', 'Ex: Cow007', 'barcode-outline')}
                {renderDateInput('Estrus Start Date', 'estrusStartDate', 'Select Start Date', 'calendar-outline')}
                {renderDateInput('Estrus End Date', 'estrusEndDate', 'Select End Date', 'calendar-outline')}
                {renderInput('Cycle Length', 'cycleLength', '18 days', 'time-outline')}

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

export default UpdateCycle;

