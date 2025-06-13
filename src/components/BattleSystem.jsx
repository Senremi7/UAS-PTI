import React, { useState, useEffect, useRef } from 'react';

const BattleSystem = ({ playerStats, setPlayerStats, onBattleEnd, avatarIndex }) => {
  const canvasRef = useRef(null);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
  const [battleMessage, setBattleMessage] = useState('Battle started!');
  const [battleEnded, setBattleEnded] = useState(false);
  
  // Player and enemy sprites
  const playerSprites = {
    idle: '/images/Soldier_Idle.png',
    attack: '/images/Soldier_Attack01.png',
    hit: '/images/Soldier_Hit.png',
    death: '/images/Soldier_Death.png'
  };
  
  const enemySprites = {
    idle: '/images/Soldier_Idle.png',
    attack: '/images/Soldier_Attack02.png',
    hit: '/images/Soldier_Hit.png',
    death: '/images/Soldier_Death.png'
  };
  
  const [playerSprite, setPlayerSprite] = useState(playerSprites.idle);
  const [enemySprite, setEnemySprite] = useState(enemySprites.idle);
  
  // Attack function
  const playerAttack = () => {
    if (isPlayerAttacking || battleEnded) return;
    
    setIsPlayerAttacking(true);
    setPlayerSprite(playerSprites.attack);
    
    // Calculate damage (15-25 damage)
    const damage = Math.floor(Math.random() * 11) + 15;
    
    setTimeout(() => {
      setEnemySprite(enemySprites.hit);
      setEnemyHealth(prev => {
        const newHealth = Math.max(0, prev - damage);
        setBattleMessage(`You dealt ${damage} damage!`);
        
        if (newHealth <= 0) {
          setBattleMessage('You won the battle!');
          setBattleEnded(true);
          setEnemySprite(enemySprites.death);
          
          // Reward player
          setPlayerStats(prev => ({
            ...prev,
            money: prev.money + 50,
            happiness: Math.min(100, prev.happiness + 15)
          }));
          
          setTimeout(() => {
            onBattleEnd(true);
          }, 2000);
        } else {
          // Enemy attacks back after a delay
          setTimeout(() => {
            enemyAttack();
          }, 1000);
        }
        
        return newHealth;
      });
      
      setTimeout(() => {
        if (enemyHealth > 0) {
          setEnemySprite(enemySprites.idle);
        }
        setIsPlayerAttacking(false);
        setPlayerSprite(playerSprites.idle);
      }, 500);
    }, 300);
  };
  
  const enemyAttack = () => {
    if (isEnemyAttacking || battleEnded) return;
    
    setIsEnemyAttacking(true);
    setEnemySprite(enemySprites.attack);
    
    // Calculate damage (10-20 damage)
    const damage = Math.floor(Math.random() * 11) + 10;
    
    setTimeout(() => {
      setPlayerSprite(playerSprites.hit);
      setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - damage);
        setBattleMessage(`Enemy dealt ${damage} damage!`);
        
        if (newHealth <= 0) {
          setBattleMessage('You lost the battle!');
          setBattleEnded(true);
          setPlayerSprite(playerSprites.death);
          
          // Penalty for losing
          setPlayerStats(prev => ({
            ...prev,
            energy: Math.max(0, prev.energy - 20),
            happiness: Math.max(0, prev.happiness - 10)
          }));
          
          setTimeout(() => {
            onBattleEnd(false);
          }, 2000);
        }
        
        return newHealth;
      });
      
      setTimeout(() => {
        if (playerHealth > 0) {
          setPlayerSprite(playerSprites.idle);
        }
        setIsEnemyAttacking(false);
      }, 500);
    }, 300);
  };
  
  // Draw battle scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    // Load background
    const bgImage = new Image();
    bgImage.src = '/images/Dalaman candi..png';
    
    // Load player sprite
    const playerImg = new Image();
    playerImg.src = playerSprite;
    
    // Load enemy sprite
    const enemyImg = new Image();
    enemyImg.src = enemySprite;
    
    // Draw scene when images are loaded
    const drawScene = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      
      // Draw battle UI background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.3);
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
      
      // Draw player
      const playerX = canvas.width * 0.2;
      const playerY = canvas.height * 0.5;
      const characterSize = Math.min(150, canvas.width * 0.2); // Larger character size
      ctx.drawImage(playerImg, playerX, playerY, characterSize, characterSize);
      
      // Draw enemy
      const enemyX = canvas.width * 0.7;
      const enemyY = canvas.height * 0.5;
      ctx.drawImage(enemyImg, enemyX, enemyY, characterSize, characterSize);
      
      // Draw health bars with improved visibility
      // Player health bar
      const barHeight = 20; // Taller health bar
      const barWidth = characterSize * 1.2; // Wider health bar
      
      // Player health bar
      ctx.fillStyle = 'black';
      ctx.fillRect(playerX - 2, playerY - 32, barWidth + 4, barHeight + 4);
      ctx.fillStyle = 'red';
      ctx.fillRect(playerX, playerY - 30, barWidth, barHeight);
      ctx.fillStyle = 'lime'; // Brighter green
      ctx.fillRect(playerX, playerY - 30, barWidth * (playerHealth / 100), barHeight);
      
      // Health text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${playerHealth}%`, 
        playerX + barWidth / 2, 
        playerY - 16
      );
      
      // Enemy health bar
      ctx.fillStyle = 'black';
      ctx.fillRect(enemyX - 2, enemyY - 32, barWidth + 4, barHeight + 4);
      ctx.fillStyle = 'red';
      ctx.fillRect(enemyX, enemyY - 30, barWidth, barHeight);
      ctx.fillStyle = 'lime'; // Brighter green
      ctx.fillRect(enemyX, enemyY - 30, barWidth * (enemyHealth / 100), barHeight);
      
      // Health text
      ctx.fillStyle = 'white';
      ctx.fillText(
        `${enemyHealth}%`, 
        enemyX + barWidth / 2, 
        enemyY - 16
      );
      
      // Draw battle message
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(battleMessage, canvas.width / 2, canvas.height * 0.15);
      
      // Draw battle controls if battle is not ended
      if (!battleEnded) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, canvas.height * 0.8, 300, 60);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('Click to Attack', canvas.width / 2, canvas.height * 0.83);
      }
    };
    
    // Wait for images to load
    let imagesLoaded = 0;
    const totalImages = 3;
    
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        drawScene();
      }
    };
    
    bgImage.onload = onImageLoad;
    playerImg.onload = onImageLoad;
    enemyImg.onload = onImageLoad;
    
    // Handle click for attack
    const handleClick = () => {
      if (!isPlayerAttacking && !isEnemyAttacking && !battleEnded) {
        playerAttack();
      }
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [playerSprite, enemySprite, playerHealth, enemyHealth, battleMessage, battleEnded, isPlayerAttacking, isEnemyAttacking]);
  
  return (
    <div className="battle-container w-full h-full bg-gray-800 rounded-xl shadow-inner overflow-hidden relative">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      
      <div className="absolute bottom-10 left-4 right-4 flex justify-center">
        <button 
          onClick={playerAttack}
          disabled={isPlayerAttacking || isEnemyAttacking || battleEnded}
          className={`px-8 py-4 rounded-lg font-bold text-xl text-white ${
            isPlayerAttacking || isEnemyAttacking || battleEnded 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700 shadow-lg'
          }`}
        >
          Attack
        </button>
      </div>
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
        <p className="font-bold text-lg">Battle Mode</p>
      </div>
    </div>
  );
};

export default BattleSystem;