import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, Platform, Animated } from 'react-native';
import { saveHighScore } from '../utils/storage';

const GameScreen = ({ route, navigation }) => {
  const { speed, mapSize, level } = route.params;
  const boardWidth = Dimensions.get('window').width - 40;
  const cellSize = boardWidth / mapSize;

  // Convert speed prop to actual milliseconds
  const getGameSpeed = () => {
    switch (level) {
      case 'Easy': return 200;    // Slower
      case 'Medium': return 150;  // Medium
      case 'Hard': return 100;    // Faster
      default: return 150;
    }
  };

  const [snake, setSnake] = useState([]);
  const [food, setFood] = useState(null);
  const [bonusFood, setBonusFood] = useState(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWaitingForInput, setIsWaitingForInput] = useState(true);
  const direction = useRef('RIGHT');
  const gameLoop = useRef(null);
  const foodRef = useRef(null);
  const bonusFoodRef = useRef(null);
  const bonusFoodTimer = useRef(null);
  const currentScore = useRef(0);
  const blinkAnim = useRef(new Animated.Value(1)).current;

  // Add blinking animation function
  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const spawnBonusFood = () => {
    if (level === 'Hard') return;

    if (bonusFoodTimer.current) {
      clearTimeout(bonusFoodTimer.current);
    }

    let newBonusFood;
    do {
      newBonusFood = {
        x: Math.floor(Math.random() * mapSize),
        y: Math.floor(Math.random() * mapSize)
      };
    } while (
      snake.some(segment => segment.x === newBonusFood.x && segment.y === newBonusFood.y) ||
      (food && food.x === newBonusFood.x && food.y === newBonusFood.y)
    );

    setBonusFood(newBonusFood);
    bonusFoodRef.current = newBonusFood;
    startBlinking(); // Start blinking when bonus food spawns

    bonusFoodTimer.current = setTimeout(() => {
      setBonusFood(null);
      bonusFoodRef.current = null;
      blinkAnim.setValue(1); // Reset animation when food disappears
    }, 5000);

    setTimeout(spawnBonusFood, Math.random() * 10000 + 10000);
  };

  const startGame = () => {
    const initialSnake = [
      { x: Math.floor(mapSize/2), y: Math.floor(mapSize/2) }
    ];
    
    setSnake(initialSnake);
    setScore(0);
    currentScore.current = 0;
    setIsGameOver(false);
    setIsWaitingForInput(true);
    direction.current = 'RIGHT';
    setBonusFood(null);
    
    const newFood = {
      x: Math.floor(Math.random() * mapSize),
      y: Math.floor(Math.random() * mapSize)
    };
    setFood(newFood);
    foodRef.current = newFood;

    if (gameLoop.current) {
      clearInterval(gameLoop.current);
      gameLoop.current = null;
    }

    // Start bonus food spawning for Easy and Medium levels
    if (level !== 'Hard') {
      setTimeout(spawnBonusFood, Math.random() * 10000 + 10000);
    }
  };

  const startMoving = () => {
    if (gameLoop.current) return;
    const gameSpeed = getGameSpeed();
    gameLoop.current = setInterval(moveSnake, gameSpeed);
  };

  const moveSnake = () => {
    if (isGameOver) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      // Move head based on direction
      switch (direction.current) {
        case 'UP':    
          head.y = (level === 'Easy' || level === 'Medium') ? 
            (head.y - 1 + mapSize) % mapSize : head.y - 1;
          break;
        case 'DOWN':  
          head.y = (level === 'Easy' || level === 'Medium') ? 
            (head.y + 1) % mapSize : head.y + 1;
          break;
        case 'LEFT':  
          head.x = (level === 'Easy' || level === 'Medium') ? 
            (head.x - 1 + mapSize) % mapSize : head.x - 1;
          break;
        case 'RIGHT': 
          head.x = (level === 'Easy' || level === 'Medium') ? 
            (head.x + 1) % mapSize : head.x + 1;
          break;
      }

      // Check wall collision for Hard and Extreme levels
      if (level === 'Hard' || level === 'Extreme') {
        if (head.x < 0 || head.x >= mapSize || head.y < 0 || head.y >= mapSize) {
          handleGameOver();
          return prevSnake;
        }
      }

      // Check self collision for ALL levels
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      // Create new snake array
      let newSnake;

      // Check food collision
      if (foodRef.current && head.x === foodRef.current.x && head.y === foodRef.current.y) {
        newSnake = [head, ...prevSnake];
        setScore(prev => {
          const newScore = prev + 1;
          currentScore.current = newScore;
          return newScore;
        });
        generateFood(newSnake);
      } else {
        newSnake = [head, ...prevSnake.slice(0, -1)];
      }

      // Check bonus food collision
      if (bonusFoodRef.current && 
          head.x === bonusFoodRef.current.x && 
          head.y === bonusFoodRef.current.y) {
        newSnake = [head, ...prevSnake];
        setScore(prev => {
          const bonusPoints = 5; // Bonus food gives 5 points
          const newScore = prev + bonusPoints;
          currentScore.current = newScore;
          return newScore;
        });
        setBonusFood(null);
        bonusFoodRef.current = null;
        if (bonusFoodTimer.current) {
          clearTimeout(bonusFoodTimer.current);
        }
      }

      return newSnake;
    });
  };

  const handleDirection = (newDirection) => {
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT'
    };

    // Remove the opposite direction check for initial movement
    if (isWaitingForInput) {
      direction.current = newDirection;
      setIsWaitingForInput(false);
      startMoving();
    } else if (opposites[newDirection] !== direction.current) {
      // Only check for opposite directions after game has started
      direction.current = newDirection;
    }
  };

  const generateFood = (currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * mapSize),
        y: Math.floor(Math.random() * mapSize)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    setFood(newFood);
    foodRef.current = newFood;
  };

  const handleGameOver = async () => {
    if (isGameOver) return;
    
    setIsGameOver(true);
    if (gameLoop.current) {
      clearInterval(gameLoop.current);
      gameLoop.current = null;
    }
    
    const finalScore = currentScore.current;
    await saveHighScore(level, finalScore);
  };

  useEffect(() => {
    startGame();
    return () => {
      if (gameLoop.current) {
        clearInterval(gameLoop.current);
      }
    };
  }, []);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#1a1a1a"
        translucent={true}
      />
      <SafeAreaView style={styles.container}>
        <View style={styles.gameContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          
          <View style={styles.board}>
            {snake.map((segment, index) => (
              <View
                key={`${segment.x}-${segment.y}-${index}`}
                style={[
                  styles.segment,
                  {
                    width: cellSize - 2,
                    height: cellSize - 2,
                    left: segment.x * cellSize + 1,
                    top: segment.y * cellSize + 1,
                    backgroundColor: index === 0 ? '#4CAF50' : '#388E3C',
                  },
                ]}
              />
            ))}

            {food && (
              <View
                style={[
                  styles.food,
                  {
                    width: cellSize - 2,
                    height: cellSize - 2,
                    left: food.x * cellSize + 1,
                    top: food.y * cellSize + 1,
                  },
                ]}
              />
            )}

            {bonusFood && (
              <Animated.View
                style={[
                  styles.bonusFood,
                  {
                    width: cellSize - 2,
                    height: cellSize - 2,
                    left: bonusFood.x * cellSize + 1,
                    top: bonusFood.y * cellSize + 1,
                    opacity: blinkAnim,
                    transform: [{
                      scale: blinkAnim.interpolate({
                        inputRange: [0.2, 1],
                        outputRange: [0.8, 1]
                      })
                    }]
                  },
                ]}
              />
            )}
          </View>

          {isWaitingForInput && !isGameOver && (
            <Text style={styles.instructionText}>
              Press any direction to start
            </Text>
          )}

          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.controlButton, styles.upButton]}
              onPress={() => handleDirection('UP')}
            >
              <Text style={styles.buttonText}>↑</Text>
            </TouchableOpacity>
            
            <View style={styles.middleRow}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handleDirection('LEFT')}
              >
                <Text style={styles.buttonText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => handleDirection('RIGHT')}
              >
                <Text style={styles.buttonText}>→</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.downButton]}
              onPress={() => handleDirection('DOWN')}
            >
              <Text style={styles.buttonText}>↓</Text>
            </TouchableOpacity>
          </View>

          {isGameOver && (
            <View style={styles.gameOverContainer}>
              <Text style={styles.gameOverText}>Game Over!</Text>
              <Text style={styles.finalScoreText}>Score: {score}</Text>
              <TouchableOpacity 
                style={styles.playAgainButton}
                onPress={startGame}
              >
                <Text style={styles.playAgainText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => navigation.navigate('Menu')}
              >
                <Text style={styles.menuText}>Menu</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  scoreText: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: Platform.OS === 'android' ? 10 : 0,
  },
  board: {
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').width - 40,
    backgroundColor: '#262626',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  segment: {
    position: 'absolute',
    borderRadius: 3,
  },
  food: {
    position: 'absolute',
    backgroundColor: '#FF0000',
    borderRadius: 50,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 40 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 70,
    height: 70,
    backgroundColor: '#4CAF50',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upButton: {
    marginBottom: 15,
  },
  middleRow: {
    flexDirection: 'row',
    width: 220,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  downButton: {
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#4CAF50',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScoreText: {
    color: 'white',
    fontSize: 24,
    marginBottom: 30,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  playAgainText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  menuText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructionText: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bonusFood: {
    position: 'absolute',
    backgroundColor: '#FFD700',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFA500',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default GameScreen; 