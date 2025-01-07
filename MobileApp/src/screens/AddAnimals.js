import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import TopNavBar from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';

const AddAnimal = () => {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        name: '', animalType: '', breed: '', sex: '', internalId: '', status: '',
        coatColor: '', height: '', weight: '', teethDevelopment: '', famachaScore: '',
        retentionScore: '', neutered: '', breedingStock: '', birthDate: '',
        birthWeight: '', ageToWean: '', dateWeaned: ''
    });

    const handleChange = (name, value) => {
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        console.log(formData);
        // Here you would typically send the data to your backend
    };

    const renderInput = (label, name, placeholder, keyboardType = 'default') => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={formData[name]}
                onChangeText={(value) => handleChange(name, value)}
                keyboardType={keyboardType}
            />
        </View>
    );

    const renderPicker = (label, name, options) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={formData[name]}
                    onValueChange={(value) => handleChange(name, value)}
                    style={styles.picker}
                >
                    <Picker.Item label={`Select ${label}`} value="" />
                    {options.map((option, index) => (
                        <Picker.Item key={index} label={option} value={option} />
                    ))}
                </Picker>
            </View>
        </View>
    );

    const renderRadioGroup = (label, name, options) => (
        <View style={styles.radioGroup}>
            <Text style={styles.label}>{label}</Text>
            <RadioButton.Group onValueChange={(value) => handleChange(name, value)} value={formData[name]}>
                <View style={styles.radioOptions}>
                    {options.map((option, index) => (
                        <View key={index} style={styles.radioOption}>
                            <RadioButton value={option} />
                            <Text style={styles.radioLabel}>{option}</Text>
                        </View>
                    ))}
                </View>
            </RadioButton.Group>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.safeArea}>
                    <TopNavBar />
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <View style={styles.header}>
                            <Icon name="add-circle-outline" size={30} color="#097969" />
                            <Text style={styles.headerText}>New Animal</Text>
                        </View>

                        {renderInput('Name', 'name', 'Enter Name')}
                        {renderPicker('Animal Type', 'animalType', ['Pig', 'Buffalo', 'Cow'])}
                        {renderInput('Breed', 'breed', 'Breed of your animal')}
                        {renderPicker('Sex', 'sex', ['Male', 'Female'])}
                        {renderInput('Internal ID', 'internalId', 'Ex: Cow007')}
                        {renderPicker('Status', 'status', ['Active', 'Culled', 'Deceased', 'For Sale', 'Sick'])}
                        {renderInput('Coat Color', 'coatColor', 'Ex: Spotted, Black, Red, Brindle')}
                        {renderInput('Height (in inches)', 'height', 'Height', 'numeric')}
                        {renderInput('Weight (in kgs)', 'weight', 'Weight', 'numeric')}
                        {renderPicker('Teeth Development', 'teethDevelopment', ['Milk Teeth', 'Two-tooth', 'Six-Tooth', 'Full set'])}
                        {renderInput('Famacha Score', 'famachaScore', 'Famacha Score', 'numeric')}
                        {renderInput('Retention Score', 'retentionScore', 'Retention Score', 'numeric')}
                        {renderRadioGroup('Neutered', 'neutered', ['Yes', 'No'])}
                        {renderRadioGroup('Breeding Stock', 'breedingStock', ['Yes', 'No'])}
                        {renderInput('Birth Date', 'birthDate', 'dd/mm/yyyy')}
                        {renderInput('Birth Weight (in Kgs)', 'birthWeight', 'Birth Weight', 'numeric')}
                        {renderInput('Age To Wean (in Days)', 'ageToWean', 'Age to Wean', 'numeric')}
                        {renderInput('Date Weaned', 'dateWeaned', 'dd/mm/yyyy')}

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.closeButton]}
                                onPress={() => navigation.navigate('LivestockManagement')}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                <Text style={styles.buttonText}>Add Animal</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    safeArea: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    radioGroup: {
        marginBottom: 20,
    },
    radioOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 30,
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    button: {
        backgroundColor: '#097969',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddAnimal;

