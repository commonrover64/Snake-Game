import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';

const ExitScreen = ({ navigation }) => {
  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exit Game</Text>
      <Text style={styles.message}>Are you sure you want to exit?</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.exitButton]}
          onPress={handleExit}
        >
          <Text style={styles.buttonText}>Yes, Exit</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.navigate('Menu')}
        >
          <Text style={styles.buttonText}>No, Return to Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  message: {
    fontSize: 24,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    gap: 20,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  cancelButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ExitScreen; 