import React, { useState, useEffect } from 'react';
import ActivityManager from './ActivityManager';
import ItemSystem from './ItemSystem';
import './ActivityStyles.css';
import './ActivityMenuStyles.css';
import './GameStyles.css';
import './ItemStyles.css';

const Game = () => {
  // State untuk posisi pemain dan data game lainnya
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  
  // State untuk statistik pemain
  const [playerStats, setPlayerStats] = useState({
    kenyang: 70,
    energi: 80,
    kesehatan: 90,
    kecerdasan: 50
  });
  
  // State untuk inventaris pemain
  const [playerInventory, setPlayerInventory] = useState({
    vitamin: 2,
    makanan: 2,
    obat: 1,
    buku: 1,
    kartuGym: 1,
    alatPancing: 1,
    alatBerkebun: 1,
    ikan: 3,
    buah: 3
  });
  
  // State untuk uang pemain
  const [playerMoney, setPlayerMoney] = useState(200);
  
  // Referensi ke peta besar yang sudah ada
  const mainMapImage = "/images/Peta besar.png";
  
  // Fungsi untuk menangani pergerakan pemain
  const handleMovement = (direction) => {
    // Implementasi logika pergerakan
    switch(direction) {
      case 'up':
        setPlayerPosition(prev => ({ ...prev, y: prev.y - 10 }));
        break;
      case 'down':
        setPlayerPosition(prev => ({ ...prev, y: prev.y + 10 }));
        break;
      case 'left':
        setPlayerPosition(prev => ({ ...prev, x: prev.x - 10 }));
        break;
      case 'right':
        setPlayerPosition(prev => ({ ...prev, x: prev.x + 10 }));
        break;
      default:
        break;
    }
  };

  // Event listener untuk keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowUp':
          handleMovement('up');
          break;
        case 'ArrowDown':
          handleMovement('down');
          break;
        case 'ArrowLeft':
          handleMovement('left');
          break;
        case 'ArrowRight':
          handleMovement('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Fungsi untuk memperbarui statistik pemain
  const updatePlayerStats = (newStats) => {
    setPlayerStats(newStats);
  };
  
  // Fungsi untuk memperbarui inventaris pemain
  const updatePlayerInventory = (newInventory) => {
    setPlayerInventory(newInventory);
  };
  
  // Fungsi untuk memperbarui uang pemain
  const updatePlayerMoney = (newMoney) => {
    setPlayerMoney(newMoney);
  };
  
  // Fungsi untuk mendapatkan item dari aktivitas
  const getItemFromActivity = (activityId) => {
    // Contoh: aktivitas memancing mendapatkan ikan
    if (activityId === 'memancing') {
      const updatedInventory = { ...playerInventory };
      updatedInventory['ikan'] = (updatedInventory['ikan'] || 0) + 1;
      updatePlayerInventory(updatedInventory);
      alert('Anda mendapatkan Ikan dari aktivitas memancing!');
    }
    // Contoh: aktivitas berkebun mendapatkan buah
    else if (activityId === 'berkebun') {
      const updatedInventory = { ...playerInventory };
      updatedInventory['buah'] = (updatedInventory['buah'] || 0) + 1;
      updatePlayerInventory(updatedInventory);
      alert('Anda mendapatkan Buah dari aktivitas berkebun!');
    }
  };

  return (
    <div className="game-container">
      <div 
        className="game-map" 
        style={{
          backgroundImage: `url(${mainMapImage})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '600px',
          position: 'relative'
        }}
      >
        <div 
          className="player" 
          style={{
            position: 'absolute',
            left: `${playerPosition.x}px`,
            top: `${playerPosition.y}px`,
            width: '20px',
            height: '20px',
            backgroundColor: 'red',
            borderRadius: '50%'
          }}
        />
      </div>
      
      <div className="controls">
        <button onClick={() => handleMovement('up')}>Up</button>
        <button onClick={() => handleMovement('down')}>Down</button>
        <button onClick={() => handleMovement('left')}>Left</button>
        <button onClick={() => handleMovement('right')}>Right</button>
      </div>

      {/* Tampilkan statistik pemain */}
      <div className="player-stats">
        {Object.entries(playerStats).map(([stat, value]) => (
          <div key={stat} className="stat-bar">
            <div className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
            <div className="stat-progress">
              <div 
                className="stat-fill" 
                style={{ 
                  width: `${value}%`,
                  backgroundColor: value > 70 ? '#4ae24a' : value > 30 ? '#e2c94a' : '#e24a4a'
                }}
              ></div>
            </div>
            <div className="stat-value">{value}%</div>
          </div>
        ))}
      </div>

      {/* Tampilkan uang pemain */}
      <div className="player-money">
        <span className="money-icon">💰</span>
        <span className="money-value">{playerMoney} koin</span>
      </div>

      {/* Tambahkan ActivityManager */}
      <ActivityManager 
        playerStats={playerStats}
        updatePlayerStats={updatePlayerStats}
        onActivityComplete={getItemFromActivity}
      />
      
      {/* Tambahkan ItemSystem */}
      <ItemSystem 
        playerStats={playerStats}
        updatePlayerStats={updatePlayerStats}
        playerInventory={playerInventory}
        updatePlayerInventory={updatePlayerInventory}
        playerMoney={playerMoney}
        updatePlayerMoney={updatePlayerMoney}
      />
    </div>
  );
};

export default Game;