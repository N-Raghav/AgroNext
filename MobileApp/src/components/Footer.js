import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>AgroNext © 2024. All rights reserved.</Text>
      <View style={styles.iconsContainer}>
        <TouchableOpacity>
          <FontAwesome name="youtube" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="facebook" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="twitter" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name="instagram" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome5 name="linkedin" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    footerContainer: {
      backgroundColor: '#097969',
      paddingVertical: 10,
      alignItems: 'center',
      height: 100,
    },
    footerText: {
      color: '#fff',
      fontSize: 14,
      marginBottom: 10,
      marginTop: 10
    },
    iconsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    
    icon: {
      marginHorizontal: 10,
    },
  });  

export default Footer;
