import { useState, useEffect } from 'react';

const AvatarSelection = ({ onStartGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Single avatar configuration - using Jeremiah but without showing the name
  const avatar = {
    id: 1,
    src: '/images/Jeremiah.png',
    name: 'Player'  // Changed from 'Jeremiah' to 'Player'
  };

  const handleStartGame = () => {
    if (playerName.trim()) {
      onStartGame(playerName, 1); // Use avatar index 1 for Jeremiah
    } else {
      // Fokus ke input nama jika kosong
      document.getElementById('player-name').focus();
      // Animasi sederhana untuk menarik perhatian
      document.getElementById('player-name').classList.add('shake');
      setTimeout(() => {
        document.getElementById('player-name').classList.remove('shake');
      }, 500);
    }
  };

  // Handle input name change
  const handleNameChange = (e) => {
    setPlayerName(e.target.value);
  };

  // Handle Enter key press to start game
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && playerName.trim()) {
      handleStartGame();
    }
  };

  // Load avatar image
  useEffect(() => {
    const img = new Image();
    img.src = avatar.src;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error(`Failed to load avatar image: ${avatar.src}`);
      setImageLoaded(true); // Continue anyway
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-indigo-900 z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-4">Life Simulator Game</h1>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Your Character</h2>
        
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center p-1 shadow-lg transform transition-transform duration-300 hover:scale-105">
              <div className="bg-white rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                {imageLoaded ? (
                  <img 
                    src={avatar.src} 
                    alt="Character" 
                    className="max-w-full max-h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/Soldier_Walk.png';
                    }}
                  />
                ) : (
                  <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                )}
              </div>
            </div>
            {/* Removed the name label completely */}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="player-name" className="block text-lg font-medium text-gray-700 mb-2">Your Name:</label>
          <input 
            type="text" 
            id="player-name" 
            value={playerName}
            onChange={handleNameChange}
            onKeyPress={handleKeyPress}
            className="w-full p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" 
            placeholder="Enter your name"
            autoFocus
          />
          {!playerName.trim() && (
            <p className="text-red-500 text-sm mt-1">* Nama harus diisi sebelum memulai permainan</p>
          )}
        </div>
        
        <button 
          onClick={handleStartGame}
          disabled={!playerName.trim()}
          className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-bold text-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          title={!playerName.trim() ? "Masukkan nama terlebih dahulu" : "Mulai bermain"}
        >
          <span>Start Exploring</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <style jsx>{`
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AvatarSelection;