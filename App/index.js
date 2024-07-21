// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const GRID_SIZE = 20;
const CELL_SIZE = 15;
const SNAKE_INITIAL_POSITION = [{ x: 5, y: 5 }];
const FOOD_INITIAL_POSITION = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

const SnakeGame = () => {
    const [snake, setSnake] = useState(SNAKE_INITIAL_POSITION);
    const [food, setFood] = useState(FOOD_INITIAL_POSITION);
    const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
    const [isGameOver, setIsGameOver] = useState(false);

    const gameLoop = useRef();

    useEffect(() => {
        gameLoop.current = setInterval(() => moveSnake(), 200);
        return () => clearInterval(gameLoop.current);
    }, [snake, direction]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    if (direction !== DIRECTIONS.DOWN) setDirection(DIRECTIONS.UP);
                    break;
                case 'ArrowDown':
                    if (direction !== DIRECTIONS.UP) setDirection(DIRECTIONS.DOWN);
                    break;
                case 'ArrowLeft':
                    if (direction !== DIRECTIONS.RIGHT) setDirection(DIRECTIONS.LEFT);
                    break;
                case 'ArrowRight':
                    if (direction !== DIRECTIONS.LEFT) setDirection(DIRECTIONS.RIGHT);
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    const moveSnake = () => {
        const newSnake = [...snake];
        const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

        if (isCollision(head)) {
            setIsGameOver(true);
            clearInterval(gameLoop.current);
            return;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const isCollision = (head) => {
        return (
            head.x < 0 || head.y < 0 ||
            head.x >= GRID_SIZE || head.y >= GRID_SIZE ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    };

    const restartGame = () => {
        setSnake(SNAKE_INITIAL_POSITION);
        setFood(FOOD_INITIAL_POSITION);
        setDirection(DIRECTIONS.RIGHT);
        setIsGameOver(false);
        gameLoop.current = setInterval(() => moveSnake(), 200);
    };

    return (
        <View style={styles.container}>
            {isGameOver && (
                <View style={styles.gameOverOverlay}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    <TouchableOpacity onPress={restartGame} style={styles.button}>
                        <Text style={styles.buttonText}>Restart</Text>
                    </TouchableOpacity>
                </View>
            )}
            <View style={styles.grid}>
                {snake.map((segment, index) => (
                    <View key={index} style={[styles.cell, { left: segment.x * CELL_SIZE, top: segment.y * CELL_SIZE }]} />
                ))}
                <View style={[styles.food, { left: food.x * CELL_SIZE, top: food.y * CELL_SIZE }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        backgroundColor: "#FFF",
        position: 'relative',
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
    gameOverOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverText: {
        fontSize: 48,
        color: 'white',
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'blue',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
});

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <Text style={appStyles.title}>Snake Game</Text>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
        backgroundColor: '#FFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
});