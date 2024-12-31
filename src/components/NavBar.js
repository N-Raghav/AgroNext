import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, FlatList, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const TopNavBar = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which dropdown is open
  const statusBarHeight = StatusBar.currentHeight || 0;

  const menuItems = [
    { id: '1', title: 'Daily Tasks', subOptions: [
      { label: 'Add Tasks', value: 'AddTasks' },
      { label: 'Schedule Tasks', value: 'scheduleTasks' },
      { label: 'Manage Tasks', value: 'manageTasks' },
    ]},
    { id: '2', title: 'Livestock Management', subOptions: [
      { label: 'Manage Animals', value: 'manageAnimals' },
      { label: 'Manage Groups', value: 'manageGroups' },
    ]},
    { id: '3', title: 'Health Monitoring' },
    { id: '4', title: 'Insemination Schedule', subOptions: [
      { label: 'History', value: 'history' },
      { label: 'Upcoming Cycle', value: 'upcomingCycle' },
      { label: 'Update Cycle', value: 'updateCycle' },
    ]},
    { id: '5', title: 'Livestock Welfare' },
    { id: '6', title: 'Help' },
    { id: '7', title: 'Settings' },
    { id: '8', title: 'Log Out' },
  ];

  const handleMenuPress = (item) => {
    if (item.subOptions) {
      // Toggle dropdown
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
    } else {
      console.log(item.title);
      setModalVisible(false); // Close modal on selection without sub-options
    }
  };

  const handleSubOptionPress = (subOption) => {
    console.log('Navigating to:', subOption.value);
    navigation.navigate(subOption.value);
    setActiveDropdown(null);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <TouchableOpacity style={styles.hamburger} onPress={() => setModalVisible(true)}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.title}>AgroNext</Text>
      </TouchableOpacity>

      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ellipsis-vertical" size={25} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Modal for Navigation Menu */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {/* Profile Section */}
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <Text style={styles.userName}>Nithya P</Text>
            <Text style={styles.userId}>User: 123456</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.separator}></View>
          </View>

          {/* Menu List */}
          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item)}
                >
                  <Text style={styles.menuText}>{item.title}</Text>
                  {item.subOptions && (
                    <Icon
                      name={activeDropdown === item.id ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#000"
                    />
                  )}
                </TouchableOpacity>

                {/* Sub-options Dropdown */}
                {activeDropdown === item.id && item.subOptions && (
                  <View style={styles.dropdown}>
                    {item.subOptions.map((subOption, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownItem}
                        onPress={() => handleSubOptionPress(subOption)}
                      >
                        <Text style={styles.dropdownText}>{subOption.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    height: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  hamburger: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    margin: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 14,
    color: 'gray',
  },
  editButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#097969',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'normal',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    marginTop: 10,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
  },
  dropdown: {
    marginLeft: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#097969',
    borderRadius: 5,
    width: '15%',
  },
  closeText: {
    color: 'white',
    fontSize: 14,
  },
});

export default TopNavBar;
