import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGHSCORE_KEY = '@snake_highscores';

export const saveHighScore = async (level, score) => {
  try {
    console.log('Attempting to save score:', score, 'for level:', level);
    
    // Get existing scores
    const existingScores = await AsyncStorage.getItem(HIGHSCORE_KEY);
    let scores = existingScores ? JSON.parse(existingScores) : {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };

    console.log('Current scores:', scores);

    // Only update if the new score is higher
    if (score > scores[level]) {
      scores[level] = score;
      await AsyncStorage.setItem(HIGHSCORE_KEY, JSON.stringify(scores));
      console.log('New highscore saved:', scores);
    } else {
      console.log('Score not high enough to save');
    }
  } catch (error) {
    console.error('Error saving highscore:', error);
  }
};

export const getHighScores = async () => {
  try {
    const scores = await AsyncStorage.getItem(HIGHSCORE_KEY);
    return scores ? JSON.parse(scores) : {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
  } catch (error) {
    console.error('Error getting highscores:', error);
    return {
      Easy: 0,
      Medium: 0,
      Hard: 0
    };
  }
};
