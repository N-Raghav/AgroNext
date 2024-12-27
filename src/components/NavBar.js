import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TopNavBar = () => {
  const statusBarHeight = StatusBar.currentHeight || 0;  // Dynamically get the status bar height

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <TouchableOpacity style={styles.hamburger}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>AgroNext</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <Icon name="search" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={30} color="#000" />
        </TouchableOpacity>
      </View>
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
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
});

export default TopNavBar;
