import { useState, useEffect, useCallback, useRef } from 'react';
import StatusBars from './StatusBars';
import GameMap from './GameMap';
import InteriorView from './InteriorView';
import ActionPanel from './ActionPanel';

const GameScreen = ({ playerName, avatarIndex, stats, gameDay, gameTime, onGameOver }) => {
  const [playerStats, setPlayerStats] = useState(stats);
  const [currentDay, setCurrentDay] = useState(gameDay);
  const [currentTime, setCurrentTime] = useState(gameTime);
  const [currentLocation, setCurrentLocation] = useState('');
  const [gameHour, setGameHour] = useState(8);
  const [gameMinute, setGameMinute] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ 
    x: 0, 
    y: 0, 
    size: 60,
    speed: 8
  });
  const [isInterior, setIsInterior] = useState(false);
  const [interiorLocation, setInteriorLocation] = useState('');
  
  // Use refs to avoid unnecessary re-renders
  const playerStatsRef = useRef(playerStats);
  playerStatsRef.current = playerStats;
  
  // Format time as HH:MM AM/PM
  const formatTime = useCallback(() => {
    const period = gameHour >= 12 ? 'PM' : 'AM';
    const formattedHour = gameHour % 12 === 0 ? 12 : gameHour % 12;
    const formattedMinute = gameMinute.toString().padStart(2, '0');
    return `${formattedHour}:${formattedMinute} ${period}`;
  }, [gameHour, gameMinute]);
  
  // Update greeting based on time
  const getGreeting = useCallback(() => {
    if (gameHour >= 5 && gameHour < 12) {
      return `Good Morning, ${playerName}!`;
    } else if (gameHour >= 12 && gameHour < 17) {
      return `Good Afternoon, ${playerName}!`;
    } else if (gameHour >= 17 && gameHour < 21) {
      return `Good Evening, ${playerName}!`;
    } else {
      return `Good Night, ${playerName}!`;
    }
  }, [gameHour, playerName]);
  
  // Update game time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setGameMinute(prev => {
        if (prev === 59) {
          setGameHour(prevHour => {
            if (prevHour === 23) {
              setCurrentDay(prevDay => prevDay + 1);
              return 0;
            }
            return prevHour + 1;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 1000); // 1 second = 1 minute in game
    
    return () => clearInterval(timeInterval);
  }, []);
  
  // Update formatted time when hour or minute changes
  useEffect(() => {
    setCurrentTime(formatTime());
  }, [gameHour, gameMinute, formatTime]);
  
  // Game loop effect - decrease stats over time
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPlayerStats(prev => {
        const newStats = {
          hunger: Math.max(0, prev.hunger - 0.5),
          energy: Math.max(0, prev.energy - 0.3),
          hygiene: Math.max(0, prev.hygiene - 0.2),
          happiness: Math.max(0, prev.happiness - 0.4),
          money: prev.money
        };
        
        // Check for game over conditions
        if (newStats.energy <= 0) {
          clearInterval(gameLoop);
          onGameOver('You ran out of energy!');
        } else if (newStats.hunger <= 0) {
          clearInterval(gameLoop);
          onGameOver('You starved to death!');
        } else if (newStats.happiness <= 0) {
          clearInterval(gameLoop);
          onGameOver('You became too depressed to continue!');
        } else if (newStats.hygiene <= 0) {
          clearInterval(gameLoop);
          onGameOver('Your poor hygiene made you sick!');
        } else if (newStats.money < 0) {
          clearInterval(gameLoop);
          onGameOver('You went bankrupt!');
        }
        
        return newStats;
      });
    }, 5000);
    
    return () => clearInterval(gameLoop);
  }, [onGameOver]);
  
  // Check critical levels
  useEffect(() => {
    if (playerStats.hunger < 20) {
      alert("Warning: You're getting very hungry!");
    }
    if (playerStats.energy < 15) {
      alert("Warning: You're exhausted and need rest!");
    }
  }, [playerStats.hunger, playerStats.energy]);
  
  // Check location interaction
  const checkLocationInteraction = useCallback((position, areas) => {
    const { x, y, size } = position;
    
    if (
      x < areas.homeArea.x + areas.homeArea.width &&
      x + size > areas.homeArea.x &&
      y < areas.homeArea.y + areas.homeArea.height &&
      y + size > areas.homeArea.y
    ) {
      setCurrentLocation('home');
    } else if (
      x < areas.danauArea.x + areas.danauArea.width &&
      x + size > areas.danauArea.x &&
      y < areas.danauArea.y + areas.danauArea.height &&
      y + size > areas.danauArea.y
    ) {
      setCurrentLocation('danau');
    } else if (
      x < areas.pantaiArea.x + areas.pantaiArea.width &&
      x + size > areas.pantaiArea.x &&
      y < areas.pantaiArea.y + areas.pantaiArea.height &&
      y + size > areas.pantaiArea.y
    ) {
      setCurrentLocation('pantai');
    } else if (
      x < areas.gunungArea.x + areas.gunungArea.width &&
      x + size > areas.gunungArea.x &&
      y < areas.gunungArea.y + areas.gunungArea.height &&
      y + size > areas.gunungArea.y
    ) {
      setCurrentLocation('gunung');
    } else if (
      x < areas.candiArea.x + areas.candiArea.width &&
      x + size > areas.candiArea.x &&
      y < areas.candiArea.y + areas.candiArea.height &&
      y + size > areas.candiArea.y
    ) {
      setCurrentLocation('candi');
    } else {
      setCurrentLocation('');
    }
  }, []);
  
  // Handle movement
  const handleMove = useCallback((direction) => {
    setPlayerPosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      
      switch(direction) {
        case 'up':
          newY = Math.max(0, prev.y - prev.speed);
          break;
        case 'down':
          newY = prev.y + prev.speed;
          break;
        case 'left':
          newX = Math.max(0, prev.x - prev.speed);
          break;
        case 'right':
          newX = prev.x + prev.speed;
          break;
        default:
          break;
      }
      
      return { ...prev, x: newX, y: newY };
    });
    
    // Decrease energy slightly on movement
    setPlayerStats(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 0.1)
    }));
  }, []);
  
  // Enter building
  const enterBuilding = useCallback(() => {
    if (currentLocation && ['home', 'candi', 'danau', 'pantai', 'gunung'].includes(currentLocation)) {
      setInteriorLocation(currentLocation);
      setIsInterior(true);
      // Reset player position for interior view
      setPlayerPosition(prev => ({
        ...prev,
        x: 0,
        y: 0,
        isReset: false
      }));
    }
  }, [currentLocation]);
  
  // Exit building
  const exitBuilding = useCallback(() => {
    setIsInterior(false);
  }, []);
  
  // Perform actions based on location
  const performAction = useCallback((action) => {
    // Special action for entering buildings
    if (action === 'enter') {
      enterBuilding();
      return;
    }
    
    switch(action) {
      // HOME ACTIONS
      case 'sleep':
        setPlayerStats(prev => ({
          ...prev,
          energy: Math.min(100, prev.energy + 30)
        }));
        setGameHour(h => (h + 4) % 24);
        if (gameHour < 4) setCurrentDay(d => d + 1);
        break;
      case 'eat':
        setPlayerStats(prev => ({
          ...prev,
          hunger: Math.min(100, prev.hunger + 20)
        }));
        break;
      case 'play':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 20),
          energy: Math.max(0, prev.energy - 10)
        }));
        break;
      case 'shower':
        setPlayerStats(prev => ({
          ...prev,
          hygiene: Math.min(100, prev.hygiene + 20)
        }));
        break;
      case 'work':
        if (playerStatsRef.current.energy >= 20) {
          setPlayerStats(prev => ({
            ...prev,
            money: prev.money + 25,
            energy: Math.max(0, prev.energy - 20),
            happiness: Math.max(0, prev.happiness - 5)
          }));
          alert("You earned $25 from remote work!");
        } else {
          alert("Too tired to work! Get some rest first.");
        }
        break;
      case 'read':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 15),
          energy: Math.max(0, prev.energy - 5)
        }));
        break;
        
      // DANAU ACTIONS
      case 'fish':
        setPlayerStats(prev => ({
          ...prev,
          hunger: Math.min(100, prev.hunger + 15),
          happiness: Math.min(100, prev.happiness + 10),
          energy: Math.max(0, prev.energy - 10)
        }));
        break;
      case 'swimDanau':
        setPlayerStats(prev => ({
          ...prev,
          hygiene: Math.min(100, prev.hygiene + 15),
          energy: Math.max(0, prev.energy - 15),
          happiness: Math.min(100, prev.happiness + 10)
        }));
        break;
      case 'rest':
        setPlayerStats(prev => ({
          ...prev,
          energy: Math.min(100, prev.energy + 15)
        }));
        setGameHour(h => (h + 1) % 24);
        if (gameHour === 23) setCurrentDay(d => d + 1);
        break;
      case 'takePhotos':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 10),
          energy: Math.max(0, prev.energy - 5),
          money: prev.money + 10
        }));
        break;
        
      // PANTAI ACTIONS
      case 'swimPantai':
        setPlayerStats(prev => ({
          ...prev,
          hygiene: Math.min(100, prev.hygiene + 20),
          energy: Math.max(0, prev.energy - 10),
          happiness: Math.min(100, prev.happiness + 15)
        }));
        break;
      case 'sunbathe':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 20),
          energy: Math.min(100, prev.energy + 10),
          hunger: Math.max(0, prev.hunger - 5)
        }));
        break;
      case 'buildSandcastle':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 25),
          energy: Math.max(0, prev.energy - 10)
        }));
        break;
      case 'buySouvenir':
        if (playerStatsRef.current.money >= 15) {
          setPlayerStats(prev => ({
            ...prev,
            money: prev.money - 15,
            happiness: Math.min(100, prev.happiness + 20)
          }));
          alert("You bought a cute souvenir! Happiness +20");
        } else {
          alert("Not enough money for souvenir!");
        }
        break;
        
      // GUNUNG ACTIONS
      case 'hike':
        setPlayerStats(prev => ({
          ...prev,
          energy: Math.max(0, prev.energy - 20),
          happiness: Math.min(100, prev.happiness + 20),
          hunger: Math.max(0, prev.hunger - 10)
        }));
        break;
      case 'camp':
        setPlayerStats(prev => ({
          ...prev,
          energy: Math.min(100, prev.energy + 20),
          happiness: Math.min(100, prev.happiness + 15)
        }));
        setGameHour(h => (h + 2) % 24);
        if (gameHour < 2) setCurrentDay(d => d + 1);
        break;
      case 'findTreasure':
        const treasureValue = Math.floor(Math.random() * 50) + 10; // $10-$60
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money + treasureValue,
          energy: Math.max(0, prev.energy - 15)
        }));
        alert(`You found treasure worth $${treasureValue}!`);
        break;
      case 'takeMountainPhotos':
        const photoValue = Math.floor(Math.random() * 20) + 5; // $5-$25
        setPlayerStats(prev => ({
          ...prev,
          money: prev.money + photoValue,
          energy: Math.max(0, prev.energy - 10)
        }));
        alert(`You sold mountain photos for $${photoValue}!`);
        break;
        
      // CANDI ACTIONS
      case 'meditate':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 20),
          energy: Math.min(100, prev.energy + 15)
        }));
        setGameHour(h => (h + 1) % 24);
        if (gameHour === 23) setCurrentDay(d => d + 1);
        break;
      case 'pray':
        if (playerStatsRef.current.money < 10) {
          alert("Not enough money for offering!");
          return;
        }
        const statToBoost = ['energy', 'happiness', 'hygiene'][Math.floor(Math.random() * 3)];
        const boostAmount = Math.floor(Math.random() * 15) + 5;
        
        setPlayerStats(prev => {
          const newStats = { ...prev, money: prev.money - 10 };
          newStats[statToBoost] = Math.min(100, prev[statToBoost] + boostAmount);
          return newStats;
        });
        
        alert(`You made an offering. ${statToBoost} +${boostAmount}`);
        break;
      case 'explore':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 15),
          energy: Math.max(0, prev.energy - 10),
          hunger: Math.max(0, prev.hunger - 5)
        }));
        break;
      case 'study':
        setPlayerStats(prev => ({
          ...prev,
          happiness: Math.min(100, prev.happiness + 10),
          energy: Math.max(0, prev.energy - 5)
        }));
        break;
      default:
        break;
    }
  }, [gameHour, setCurrentDay, enterBuilding]);
  
  return (
    <div id="game-screen" className="h-full flex flex-col">
      <StatusBars 
        playerName={playerName}
        stats={playerStats}
        day={currentDay}
        time={currentTime}
        greeting={getGreeting()}
      />
      
      <div className="flex-grow flex flex-col md:flex-row">
        {isInterior ? (
          <InteriorView 
            location={interiorLocation}
            playerPosition={playerPosition}
            setPlayerPosition={setPlayerPosition}
            avatarIndex={avatarIndex}
            onExit={exitBuilding}
            playerName={playerName}
          />
        ) : (
          <GameMap 
            playerPosition={playerPosition}
            setPlayerPosition={setPlayerPosition}
            avatarIndex={avatarIndex}
            checkLocationInteraction={checkLocationInteraction}
            playerName={playerName}
          />
        )}
        
        <div className="w-full md:w-1/3 flex flex-col justify-between gap-4 p-4">
          <ActionPanel 
            onAction={performAction}
            stats={playerStats}
            location={currentLocation}
            isInterior={isInterior}
            interiorLocation={interiorLocation}
          />
          
          <div className="bg-white p-4 rounded-xl shadow-md flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-2">Controls</h2>
            <div className="grid grid-cols-3 gap-2">
              <div></div>
              <button 
                onClick={() => handleMove('up')}
                className="bg-gray-100 rounded-full w-12 h-12 hover:bg-gray-200 flex items-center justify-center p-2"
              >
                <img src="/images/up.png" alt="Up" className="w-full h-full" />
              </button>
              <div></div>
              
              <button 
                onClick={() => handleMove('left')}
                className="bg-gray-100 rounded-full w-12 h-12 hover:bg-gray-200 flex items-center justify-center p-2"
              >
                <img src="/images/left.png" alt="Left" className="w-full h-full" />
              </button>
              <div></div>
              <button 
                onClick={() => handleMove('right')}
                className="bg-gray-100 rounded-full w-12 h-12 hover:bg-gray-200 flex items-center justify-center p-2"
              >
                <img src="/images/right.png" alt="Right" className="w-full h-full" />
              </button>
              
              <div></div>
              <button 
                onClick={() => handleMove('down')}
                className="bg-gray-100 rounded-full w-12 h-12 hover:bg-gray-200 flex items-center justify-center p-2"
              >
                <img src="/images/down.png" alt="Down" className="w-full h-full" />
              </button>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;