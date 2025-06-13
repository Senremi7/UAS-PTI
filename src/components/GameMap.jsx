import { useEffect, useRef, useState, useCallback } from 'react';

const GameMap = ({ playerPosition, setPlayerPosition, avatarIndex, checkLocationInteraction, playerName }) => {
  const canvasRef = useRef(null);
  const mapImageRef = useRef(null);
  const playerImgRef = useRef(null);
  const animationRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const lastMoveTimeRef = useRef(0);
  const poseImagesRef = useRef([]);
  const [posesLoaded, setPosesLoaded] = useState(0);
  
  // Define areas as percentages of canvas width and height
  const areaTemplates = {
    homeArea: {
      xPercent: 0.15, // Rumah di bagian kiri atas
      yPercent: 0.15,    
      widthPercent: 0.12, 
      heightPercent: 0.14 
    },
    danauArea: {
      xPercent: 0.85, // Danau di bagian kanan tengah, lebih condong ke kanan
      yPercent: 0.45,
      widthPercent: 0.12, 
      heightPercent: 0.15 
    },
    pantaiArea: {
      xPercent: 0.75,  // Pantai di bagian kanan bawah
      yPercent: 0.75,     
      widthPercent: 0.15,  
      heightPercent: 0.15 
    },
    gunungArea: {
      xPercent: 0.85,  // Gunung di bagian kanan atas
      yPercent: 0.15, 
      widthPercent: 0.12,  
      heightPercent: 0.15 
    },
    candiArea: {
      xPercent: 0.15,  // Candi di bagian kiri bawah
      yPercent: 0.75,  
      widthPercent: 0.10, 
      heightPercent: 0.12 
    }
  };

  // Calculate dynamic areas based on canvas size
  const calculateDynamicAreas = useCallback((canvas) => {
    const dynamicAreas = {};
    for (const areaKey in areaTemplates) {
      const template = areaTemplates[areaKey];
      dynamicAreas[areaKey] = {
        x: template.xPercent * canvas.width,
        y: template.yPercent * canvas.height,
        width: template.widthPercent * canvas.width,
        height: template.heightPercent * canvas.height
      };
    }
    return dynamicAreas;
  }, []);
  
  // Get avatar image source based on avatarIndex
  const getAvatarSrc = useCallback((index) => {
    // Avatar list with available avatars
    const avatars = [
      { id: 0, src: '/images/Soldier_Walk.png' }, // Fallback to Soldier_Walk.png
      { id: 1, src: '/images/Jeremiah.png' },
      { id: 2, src: '/images/Soldier_Walk.png' }  // Fallback to Soldier_Walk.png
    ];
    
    return avatars[index].src;
  }, []);
  
  // Draw function that will be called in animation loop
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !mapLoaded || !avatarLoaded) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw map
    if (mapImageRef.current) {
      ctx.drawImage(mapImageRef.current, 0, 0, canvas.width, canvas.height);
    }
    
    // Get the correct pose image based on direction
    let poseIndex = 0; // default to down/front (pose 1)
    
    switch(direction) {
      case 'down': poseIndex = 0; break;  // pose 1 untuk depan
      case 'right': poseIndex = 1; break; // pose 2 untuk kanan
      case 'up': poseIndex = 2; break;    // pose 3 untuk belakang
      case 'left': poseIndex = 3; break;  // pose 4 untuk kiri
    }
    
    const currentImage = poseImagesRef.current[poseIndex];
    
    if (currentImage) {
      // Add a slight bobbing effect if moving for realistic walking
      let yOffset = 0;
      if (isMoving) {
        // Use walkFrame to create a bobbing effect
        yOffset = (walkFrame % 2 === 0) ? 0 : -2;
      }
      
      ctx.drawImage(
        currentImage,
        playerPosition.x,
        playerPosition.y + yOffset,
        playerPosition.size,
        playerPosition.size
      );
    }
    else if (playerImgRef.current) {
      // Fallback to default avatar if pose not loaded
      ctx.drawImage(
        playerImgRef.current,
        playerPosition.x,
        playerPosition.y,
        playerPosition.size,
        playerPosition.size
      );
    } 
    // Fallback to static avatar if poses aren't loaded
    else if (playerImgRef.current) {
      ctx.drawImage(
        playerImgRef.current,
        playerPosition.x,
        playerPosition.y,
        playerPosition.size,
        playerPosition.size
      );
    }
    
    // Draw player name above head
    ctx.font = '14px Arial';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    const nameText = playerName || 'Player';
    const textWidth = ctx.measureText(nameText).width;
    const textX = playerPosition.x + (playerPosition.size / 2) - (textWidth / 2);
    const textY = playerPosition.y - 10;
    
    // Draw text outline for better visibility
    ctx.strokeText(nameText, textX, textY);
    ctx.fillText(nameText, textX, textY);
    
    // Check location interactions
    const dynamicAreas = calculateDynamicAreas(canvas);
    checkLocationInteraction(playerPosition, dynamicAreas);
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(drawCanvas);
    
    // Update walk frame for bobbing effect if moving
    if (isMoving) {
      const now = Date.now();
      if (now - lastMoveTimeRef.current > 200) {
        setWalkFrame(prev => prev + 1);
        lastMoveTimeRef.current = now;
      }
    }
  }, [playerPosition, mapLoaded, avatarLoaded, calculateDynamicAreas, checkLocationInteraction, playerName, isMoving, walkFrame, direction]);
  
  // Load images
  useEffect(() => {
    // Load map image
    if (!mapImageRef.current) {
      mapImageRef.current = new Image();
      mapImageRef.current.src = '/images/Peta besar.png';
      mapImageRef.current.onload = () => setMapLoaded(true);
      mapImageRef.current.onerror = () => {
        console.error("Failed to load map image");
        setMapLoaded(true); // Continue anyway
      };
    }
    
    // Load player image
    playerImgRef.current = new Image();
    playerImgRef.current.src = getAvatarSrc(avatarIndex);
    playerImgRef.current.onload = () => setAvatarLoaded(true);
    playerImgRef.current.onerror = () => {
      console.error("Failed to load avatar image");
      // Try fallback image
      playerImgRef.current.src = '/images/Soldier_Walk.png';
      setAvatarLoaded(true);
    };
    
    // Clear existing pose images
    poseImagesRef.current = [];
    let loadedCount = 0;
    
    // Load pose images for walking animation
    poseImagesRef.current = [];
    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `/images/pose ${i}.png`;
      img.onload = () => {
        loadedCount++;
        setPosesLoaded(loadedCount);
      };
      img.onerror = () => {
        console.error(`Failed to load pose ${i} image`);
        img.src = playerImgRef.current.src;
      };
      poseImagesRef.current.push(img);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [avatarIndex, getAvatarSrc]);
  
  // Start animation loop when images are loaded
  useEffect(() => {
    if (mapLoaded && avatarLoaded) {
      animationRef.current = requestAnimationFrame(drawCanvas);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mapLoaded, avatarLoaded, drawCanvas]);
  
  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    
    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // If player position not set, initialize it
      if (playerPosition.x === 0 && playerPosition.y === 0) {
        setPlayerPosition({
          x: canvas.width * 0.15, // Posisi awal pemain di dekat rumah
          y: canvas.height * 0.15,
          size: Math.min(50, canvas.width * 0.08),
          speed: 7
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setPlayerPosition, playerPosition]);
  
  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      setIsMoving(true);
      
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          setDirection('up');
          setPlayerPosition(prev => ({
            ...prev,
            y: Math.max(0, prev.y - prev.speed)
          }));
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          setDirection('down');
          setPlayerPosition(prev => ({
            ...prev,
            y: prev.y + prev.speed
          }));
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setDirection('left');
          setPlayerPosition(prev => ({
            ...prev,
            x: Math.max(0, prev.x - prev.speed)
          }));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setDirection('right');
          setPlayerPosition(prev => ({
            ...prev,
            x: prev.x + prev.speed
          }));
          break;
        default:
          break;
      }
    };
    
    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
        setIsMoving(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setPlayerPosition]);
  
  // Handle movement buttons
  const handleMove = useCallback((dir) => {
    setIsMoving(true);
    setDirection(dir);
    
    switch(dir) {
      case 'up':
        setPlayerPosition(prev => ({
          ...prev,
          y: Math.max(0, prev.y - prev.speed)
        }));
        break;
      case 'down':
        setPlayerPosition(prev => ({
          ...prev,
          y: prev.y + prev.speed
        }));
        break;
      case 'left':
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.max(0, prev.x - prev.speed)
        }));
        break;
      case 'right':
        setPlayerPosition(prev => ({
          ...prev,
          x: prev.x + prev.speed
        }));
        break;
      default:
        break;
    }
    
    // Stop moving animation after a short delay
    setTimeout(() => {
      setIsMoving(false);
    }, 150);
  }, [setPlayerPosition]);
  
  return (
    <div className="map-container w-full md:w-2/3 bg-gray-200 rounded-xl shadow-inner overflow-hidden relative mb-4 md:mb-0">
      {/* Canvas overlay for player and interactivity */}
      <canvas 
        ref={canvasRef}
        id="game-map"
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Touch controls for mobile */}
      <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 md:hidden">
        <div></div>
        <button 
          onTouchStart={() => handleMove('up')}
          className="bg-gray-100 bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div></div>
        
        <button 
          onTouchStart={() => handleMove('left')}
          className="bg-gray-100 bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div></div>
        <button 
          onTouchStart={() => handleMove('right')}
          className="bg-gray-100 bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div></div>
        <button 
          onTouchStart={() => handleMove('down')}
          className="bg-gray-100 bg-opacity-70 rounded-full w-12 h-12 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div></div>
      </div>
    </div>
  );
};

export default GameMap;