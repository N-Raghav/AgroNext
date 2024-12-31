import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, SafeAreaView,  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import TopNavBar from '../components/NavBar';
import { useNavigation } from '@react-navigation/native';

const AddAnimal = () => {
    const navigation = useNavigation(); 

    const [name, setName] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [breed, setBreed] = useState('');
    const [sex, setSex] = useState('');
    const [internalId, setInternalId] = useState('');
    const [status, setStatus] = useState('');
    const [coatColor, setCoatColor] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [teethDevelopment, setTeethDevelopment] = useState('');
    const [famachaScore, setFamachaScore] = useState('');
    const [retentionScore, setRetentionScore] = useState('');
    const [neutered, setNeutered] = useState('');
    const [breedingStock, setBreedingStock] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthWeight, setBirthWeight] = useState('');
    const [ageToWean, setAgeToWean] = useState('');
    const [dateWeaned, setDateWeaned] = useState('');

    const handleSubmit = () => {
        console.log({
            name,
            animalType,
            breed,
            sex,
            internalId,
            status,
            coatColor,
            height,
            weight,
            teethDevelopment,
            famachaScore,
            retentionScore,
            neutered,
            breedingStock,
            birthDate,
            birthWeight,
            ageToWean,
            dateWeaned,
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <TopNavBar />
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                        <Text style={styles.header}>New Animal</Text>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Name"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Animal Type</Text>
                            <Picker
                                selectedValue={animalType}
                                onValueChange={setAnimalType}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Animal Type" value="" />
                                <Picker.Item label="Pig" value="Pig" />
                                <Picker.Item label="Buffalo" value="Buffalo" />
                                <Picker.Item label="Cow" value="Cow" />
                            </Picker>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Breed</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Breed of your animal"
                                value={breed}
                                onChangeText={setBreed}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sex</Text>
                            <Picker
                                selectedValue={sex}
                                onValueChange={setSex}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Sex" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Internal ID</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Cow007"
                                value={internalId}
                                onChangeText={setInternalId}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Status</Text>
                            <Picker
                                selectedValue={status}
                                onValueChange={setStatus}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Status" value="" />
                                <Picker.Item label="Active" value="Active" />
                                <Picker.Item label="Culled" value="Culled" />
                                <Picker.Item label="Deceased" value="Deceased" />
                                <Picker.Item label="For Sale" value="For Sale" />
                                <Picker.Item label="Sick" value="Sick" />
                            </Picker>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Coat Color</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Spotted, Black, Red, Brindle"
                                value={coatColor}
                                onChangeText={setCoatColor}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Height (in inches)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Height"
                                value={height}
                                onChangeText={setHeight}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Weight (in kgs)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Weight"
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Teeth Development</Text>
                            <Picker
                                selectedValue={teethDevelopment}
                                onValueChange={setTeethDevelopment}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select Teeth Development" value="" />
                                <Picker.Item label="Milk Teeth" value="Milk Teeth" />
                                <Picker.Item label="Two-tooth" value="Two-tooth" />
                                <Picker.Item label="Six-Tooth" value="Six-Tooth" />
                                <Picker.Item label="Full set" value="Full set" />
                            </Picker>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Famacha Score</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Famacha Score"
                                value={famachaScore}
                                onChangeText={setFamachaScore}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Retention Score</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Retention Score"
                                value={retentionScore}
                                onChangeText={setRetentionScore}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.radioGroup}>
                            <Text style={styles.label}>Neutered</Text>
                            <RadioButton.Group onValueChange={setNeutered} value={neutered}>
                                <View style={styles.radioOption}>
                                    <RadioButton value="Yes" />
                                    <Text>Yes</Text>
                                </View>
                                <View style={styles.radioOption}>
                                    <RadioButton value="No" />
                                    <Text>No</Text>
                                </View>
                            </RadioButton.Group>
                        </View>

                        <View style={styles.radioGroup}>
                            <Text style={styles.label}>Breeding Stock</Text>
                            <RadioButton.Group onValueChange={setBreedingStock} value={breedingStock}>
                                <View style={styles.radioOption}>
                                    <RadioButton value="Yes" />
                                    <Text>Yes</Text>
                                </View>
                                <View style={styles.radioOption}>
                                    <RadioButton value="No" />
                                    <Text>No</Text>
                                </View>
                            </RadioButton.Group>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Birth Date</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="dd/mm/yyyy"
                                value={birthDate}
                                onChangeText={setBirthDate}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Birth Weight (in Kgs)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Birth Weight"
                                value={birthWeight}
                                onChangeText={setBirthWeight}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Age To Wean (in Days)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Age to Wean"
                                value={ageToWean}
                                onChangeText={setAgeToWean}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Date Weaned</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="dd/mm/yyyy"
                                value={dateWeaned}
                                onChangeText={setDateWeaned}
                            />
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.goBack()} 
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
        marginBottom: 15,
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
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
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
 
export default AddAnimal;
