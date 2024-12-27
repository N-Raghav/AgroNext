// components/FAQComponent.js
import React from 'react';
import { View, Text } from 'react-native';

const FAQComponent = ({ faqs }) => {
  return (
    <View style={styles.faqContainer}>
      <Text style={styles.sectionTitle}>Your Common FAQs Answered</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.faqQuestion}>{faq.question}</Text>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = {
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
      },
  faqContainer: {
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  faqQuestion: {
    fontWeight: 'bold',
  },
  faqAnswer: {
    marginTop: 5,
  },
};

export default FAQComponent;
