import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const EmptyState = () => (
  <View style={styles.emptyState}>
    <Icon name="clipboard-outline" size={80} color="#097969" />
    <Text style={styles.emptyText}>Nothing to do yet?</Text>
    <Text style={styles.emptySubText}>
      Add a new task by clicking the button and check it once done!
    </Text>
  </View>
);

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#097969',
  },
  emptySubText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6e6e6e',
    width: '80%',
  },
});

export default EmptyState;
