import { useState, useEffect } from 'react';
import './App.css';
import AvatarSelection from './components/AvatarSelection';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [gameState, setGameState] = useState({
    screen: 'avatar-selection', // 'avatar-selection', 'game', 'game-over'
    playerName: '',
    avatarIndex: 0,
    stats: {
      hunger: 50,
      energy: 50,
      hygiene: 50,
      happiness: 50,
      money: 100
    },
    gameDay: 1,
    gameTime: '8:00 AM'
  });

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.screen !== 'game') return;
      
      // Add keyboard event handling if needed
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.screen]);

  const startGame = (name, avatarIndex) => {
    setGameState(prev => ({
      ...prev,
      screen: 'game',
      playerName: name,
      avatarIndex
    }));
  };

  const endGame = (reason) => {
    setGameState(prev => ({
      ...prev,
      screen: 'game-over',
      gameOverReason: reason
    }));
  };

  const restartGame = () => {
    setGameState({
      screen: 'avatar-selection',
      playerName: '',
      avatarIndex: 0,
      stats: {
        hunger: 50,
        energy: 50,
        hygiene: 50,
        happiness: 50,
        money: 100
      },
      gameDay: 1,
      gameTime: '8:00 AM'
    });
  };

  return (
    <div className="h-screen bg-gray-100">
      {gameState.screen === 'avatar-selection' && (
        <AvatarSelection onStartGame={startGame} />
      )}
      
      {gameState.screen === 'game' && (
        <GameScreen 
          playerName={gameState.playerName}
          avatarIndex={gameState.avatarIndex}
          stats={gameState.stats}
          gameDay={gameState.gameDay}
          gameTime={gameState.gameTime}
          onGameOver={endGame}
        />
      )}
      
      {gameState.screen === 'game-over' && (
        <GameOverScreen 
          reason={gameState.gameOverReason}
          onRestart={restartGame}
          onQuit={() => window.close()}
        />
      )}
    </div>
  );
}

export default App;