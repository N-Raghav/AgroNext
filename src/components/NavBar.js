import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, FlatList, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TopNavBar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyTasksOpen, setDailyTasksOpen] = useState(false);
  const [livestockManagementOpen, setLivestockManagementOpen] = useState(false);
  const [inseminationScheduleOpen, setInseminationScheduleOpen] = useState(false);
  const statusBarHeight = StatusBar.currentHeight || 0;

  const menuItems = [
    { id: '1', title: 'Daily Tasks' },
    { id: '2', title: 'Livestock Management' },
    { id: '3', title: 'Health Monitoring' },
    { id: '4', title: 'Insemination Schedule' },
    { id: '5', title: 'Livestock Welfare' },
    { id: '6', title: 'Help' },
    { id: '7', title: 'Settings' },
    { id: '8', title: 'Log Out' },
  ];

  const dailyTasksSubOptions = [
    { label: 'Add Tasks', value: 'addTasks' },
    { label: 'Schedule Tasks', value: 'scheduleTasks' },
    { label: 'Manage Tasks', value: 'manageTasks' },
  ];

  const livestockManagementSubOptions = [
    { label: 'Manage Animals', value: 'manageAnimals' },
    { label: 'Manage Groups', value: 'manageGroups' },
  ];

  const inseminationScheduleSubOptions = [
    { label: 'History', value: 'history' },
    { label: 'Upcoming Cycle', value: 'upcomingCycle' },
    { label: 'Update Cycle', value: 'updateCycle' },
  ];

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <TouchableOpacity style={styles.hamburger} onPress={() => setModalVisible(true)}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>AgroNext</Text>

      <View style={styles.rightIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="search" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="ellipsis-vertical" size={25} color="#000" />
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
            <Text style={styles.userName}>Nithya P</Text>
            <Text style={styles.userId}>User: 123456</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <View style={styles.separator}></View>
          </View>

          <FlatList
            data={menuItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    if (item.title === 'Daily Tasks') {
                      setDailyTasksOpen(!dailyTasksOpen);
                      setLivestockManagementOpen(false); // Close others
                      setInseminationScheduleOpen(false);
                    } else if (item.title === 'Livestock Management') {
                      setLivestockManagementOpen(!livestockManagementOpen);
                      setDailyTasksOpen(false);
                      setInseminationScheduleOpen(false);
                    } else if (item.title === 'Insemination Schedule') {
                      setInseminationScheduleOpen(!inseminationScheduleOpen);
                      setDailyTasksOpen(false);
                      setLivestockManagementOpen(false);
                    } else {
                      console.log(item.title);
                    }
                  }}
                >
                  <Text style={styles.menuText}>{item.title}</Text>
                </TouchableOpacity>

                {/* Dropdowns */}
                {item.title === 'Daily Tasks' && dailyTasksOpen && (
                  <View style={{ marginLeft: 20, marginTop: -10 }}>
                    {dailyTasksSubOptions.map((subOption, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          backgroundColor: '#f0f0f0',
                          borderBottomWidth: index === dailyTasksSubOptions.length - 1 ? 0 : 1,
                          borderBottomColor: '#ddd',
                        }}
                        onPress={() => {
                          console.log('Selected:', subOption.value);
                          setDailyTasksOpen(false);
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{subOption.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {item.title === 'Livestock Management' && livestockManagementOpen && (
                  <View style={{ marginLeft: 20, marginTop: -10 }}>
                    {livestockManagementSubOptions.map((subOption, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          backgroundColor: '#f0f0f0',
                          borderBottomWidth: index === livestockManagementSubOptions.length - 1 ? 0 : 1,
                          borderBottomColor: '#ddd',
                        }}
                        onPress={() => {
                          console.log('Selected:', subOption.value);
                          setLivestockManagementOpen(false);
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{subOption.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {item.title === 'Insemination Schedule' && inseminationScheduleOpen && (
                  <View style={{ marginLeft: 20, marginTop: -10 }}>
                    {inseminationScheduleSubOptions.map((subOption, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 15,
                          backgroundColor: '#f0f0f0',
                          borderBottomWidth: index === inseminationScheduleSubOptions.length - 1 ? 0 : 1,
                          borderBottomColor: '#ddd',
                        }}
                        onPress={() => {
                          console.log('Selected:', subOption.value);
                          setInseminationScheduleOpen(false);
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{subOption.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
    width: '100%',
  },
  menuText: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#fafafa',
    elevation: 3, // Adds shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  dropdownContainer: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#097969',
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontSize: 14,
  },
});

export default TopNavBar;
