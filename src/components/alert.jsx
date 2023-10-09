import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const CustomAlert = ({ isVisible, title, message, onConfirm }) => {
  return (
    <Modal isVisible={isVisible}>
      <View style={styles.alertContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    marginEnd: 15,
    padding: 10,
  },
  confirmButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 21,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default CustomAlert;
