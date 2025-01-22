import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Snake Game</Text>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Difficulty')}
          >
            <Text style={styles.buttonText}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Highscore')}
          >
            <Text style={styles.buttonText}>Highscore</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.navigate('Exit')}
          >
            <Text style={styles.buttonText}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 50,
  },
  menuContainer: {
    width: '80%',
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bonusFood: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 50,
  },
});

export default MenuScreen;