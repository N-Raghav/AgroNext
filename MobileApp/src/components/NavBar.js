import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, FlatList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const menuItems = [
  { 
    id: '1', 
    title: 'Daily Tasks', 
    icon: 'calendar-outline',
    subOptions: [
      { label: 'Add Tasks', value: 'AddTasks' },
      { label: 'Manage Tasks', value: 'manageTasks' },
    ]
  },
  { 
    id: '2', 
    title: 'Livestock Management', 
    icon: 'paw-outline',
    subOptions: [
      { label: 'Manage Animals', value: 'LivestockManagement' },
      { label: 'Manage Groups', value: 'manageGroups' },
    ]
  },
  { id: '3', title: 'Health Monitoring', icon: 'fitness-outline', value: 'HealthMonitoring' },
  { 
    id: '4', 
    title: 'Insemination Schedule', 
    icon: 'timer-outline',
    subOptions: [
      { label: 'Manage Insemination Schedule', value: 'ManageInsemination' },
      { label: 'Update Cycle', value: 'updateCycle' },
      { label: 'History', value: 'history' },
    ]
  },
  { id: '5', title: 'Help', icon: 'help-circle-outline' },
  { id: '6', title: 'Settings', icon: 'settings-outline' },
  { id: '7', title: 'Log Out', icon: 'log-out-outline' },
];

const TopNavBar = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const statusBarHeight = StatusBar.currentHeight || 0;

  const handleMenuPress = (item) => {
    if (item.subOptions) {
      setActiveDropdown(activeDropdown === item.id ? null : item.id);
    } else if (item.value) {
      navigation.navigate(item.value);
      setModalVisible(false);
    }
  };

  const handleSubOptionPress = (subOption) => {
    navigation.navigate(subOption.value);
    setActiveDropdown(null);
    setModalVisible(false);
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItemContainer}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleMenuPress(item)}
      >
        <View style={styles.menuItemContent}>
          <Icon name={item.icon} size={24} color="#000000" style={styles.menuIcon} />
          <Text style={styles.menuText}>{item.title}</Text>
        </View>
        {item.subOptions && (
          <Icon
            name={activeDropdown === item.id ? "chevron-up" : "chevron-down"}
            size={20}
            color="#000000"
          />
        )}
      </TouchableOpacity>

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
  );

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <TouchableOpacity style={styles.hamburger} onPress={() => setModalVisible(true)}>
        <Icon name="menu" size={30} color="#000000" />
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.title}>AgroNext</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={25} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="notifications-outline" size={25} color="#000000" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.profileImage}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>Nithya P</Text>
              <Text style={styles.userId}>User: 123456</Text>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={renderMenuItem}
            style={styles.menuList}
          />

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
    justifyContent: 'space-between', // Keeps space between elements
    alignItems: 'center', // Centers items vertically
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    height: 80,
    paddingTop: 0,
    paddingBottom: 10, // Ensure equal top and bottom padding
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  hamburger: {
    padding: 10,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center', // Centers the title vertically
    alignItems: 'center', // Centers the title horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    marginLeft: 15,
  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  editButton: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#097969',
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  menuList: {
    flex: 1,
  },
  menuItemContainer: {
    marginBottom: 5,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginTop: 5,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dropdownText: {
    fontSize: 14,
    color: '#444',
  },
  closeButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#097969',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TopNavBar;
