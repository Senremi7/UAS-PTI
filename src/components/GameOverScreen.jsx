import React from 'react';

const GameOverScreen = ({ reason, onRestart, onQuit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h1>
        <p className="text-xl text-white mb-6">{reason}</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={onRestart}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
          >
            Play Again
          </button>
          <button 
            onClick={onQuit}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors"
          >
            Quit Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;