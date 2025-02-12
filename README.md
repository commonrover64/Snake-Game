# Snake Game 🐍

A classic Snake Game built with React Native, featuring multiple difficulty levels, high score tracking, and smooth animations.

## Features ✨
- **Multiple Difficulty Levels**: Easy, Medium, and Hard.
- **High Score Tracking**: Save and view your best scores for each difficulty.
- **Smooth Animations**: Fluid snake movement and responsive controls.
- **Bonus Food**: Collect bonus food for extra points (Easy and Medium modes).
- **Clean UI**: Minimalistic and intuitive design.

## Installation 🛠️
1. Clone the repository:
   ```bash
   git clone https://github.com/commonrover64/snake-game.git
   ```
2. Navigate to the project directory:
   ```bash
   cd snake-game
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Running the App ▶️
- **Android**: Connect an Android device or use an emulator, then run:
  ```bash
  npm run android
  ```
- **iOS**: Connect an iOS device or use a simulator, then run:
  ```bash
  npm run ios
  ```

## Building the App 🚀
To build the app for production: eas build -p android --profile production



## Technologies Used 💻
- **React Native**: For building the cross-platform mobile app.
- **Expo**: For simplifying development and deployment.
- **React Navigation**: For seamless navigation between screens.
- **AsyncStorage**: For persisting high scores locally.

## Folder Structure 📁

snake-game/
├── assets/ # Images and icons
├── src/
│ ├── screens/ # App screens (Menu, Game, Highscore, etc.)
│ ├── utils/ # Utility functions (e.g., storage.js)
├── App.js # Main app component
├── app.json # Expo configuration
├── eas.json # EAS build configuration
└── package.json # Project dependencies

## Contributing 🤝
Contributions are welcome! Please open an issue or submit a pull request.

## License 📄
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Enjoy the game! 🎮
