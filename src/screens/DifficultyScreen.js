import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const DifficultyScreen = ({ navigation }) => {
    const difficulties = [
        { 
            level: 'Easy', 
            speed: 180, 
            mapSize: 20,
            description: 'Perfect for beginners\nLarger map, slower speed'
        },
        { 
            level: 'Medium', 
            speed: 140, 
            mapSize: 20,
            description: 'For experienced players\nBalanced speed and size'
        },
        { 
            level: 'Hard', 
            speed: 100, 
            mapSize: 18,
            description: 'For snake masters\nSmaller map, faster speed'
        }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Difficulty</Text>
            
            <View style={styles.menuContainer}>
                {difficulties.map((difficulty) => (
                    <TouchableOpacity 
                        key={difficulty.level}
                        style={styles.difficultyButton}
                        onPress={() => navigation.navigate('Game', difficulty)}
                    >
                        <Text style={styles.buttonText}>{difficulty.level}</Text>
                        <Text style={styles.description}>{difficulty.description}</Text>
                    </TouchableOpacity>
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
        marginBottom: 40,
    },
    menuContainer: {
        width: '100%',
        alignItems: 'center',
    },
    difficultyButton: {
        backgroundColor: '#4CAF50',
        width: '80%',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    backButtonContainer: {
        marginTop: 20,
    },
    backButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    backButtonText: {
        color: '#4CAF50',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default DifficultyScreen;