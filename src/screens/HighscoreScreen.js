import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHighScores } from '../utils/storage';

const HighscoreScreen = ({ navigation }) => {
  const [scores, setScores] = useState({
    Easy: 0,
    Medium: 0,
    Hard: 0
  });

  useFocusEffect(
    React.useCallback(() => {
      const loadScores = async () => {
        const highScores = await getHighScores();
        console.log('Loaded scores:', highScores);
        setScores(highScores);
      };
      loadScores();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.title}>High Scores</Text>
        
        <View style={styles.scoresContainer}>
          {Object.entries(scores).map(([difficulty, score]) => (
            <View key={difficulty} style={styles.difficultySection}>
              <Text style={styles.difficultyTitle}>{difficulty} Mode</Text>
              <View style={styles.scoreRow}>
                <Text style={styles.score}>{score > 0 ? score : 'No score yet'}</Text>
              </View>
            </View>
          ))}

          <View style={styles.backButtonContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 40,
  },
  scoresContainer: {
    width: '100%',
  },
  difficultySection: {
    marginBottom: 30,
  },
  difficultyTitle: {
    fontSize: 24,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scoreRow: {
    backgroundColor: '#262626',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  score: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 25,
    fontWeight: 'bold',
  }
});

export default HighscoreScreen;
