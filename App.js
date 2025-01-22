import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from './src/screens/MenuScreen';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import HighscoreScreen from './src/screens/HighscoreScreen';
import ExitScreen from './src/screens/ExitScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Difficulty" component={DifficultyScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Highscore" component={HighscoreScreen} />
        <Stack.Screen name="Exit" component={ExitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
