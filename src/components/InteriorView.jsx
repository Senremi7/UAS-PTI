import React, { useEffect, useRef, useState, useCallback } from 'react';

const InteriorView = ({ location, playerPosition, setPlayerPosition, avatarIndex, onExit, playerName }) => {
  const canvasRef = useRef(null);
  const interiorImageRef = useRef(null);
  const playerImgRef = useRef(null);
  const goblinImgRef = useRef(null);
  const monsterImgRefs = useRef([null, null, null]); // Refs untuk monster 1, 2, 3
  const souvenirImgRef = useRef(null); // Ref untuk gambar souvenir
  const photoImgRef = useRef(null); // Ref untuk gambar hasil foto danau
  const animationRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [goblinLoaded, setGoblinLoaded] = useState(false);
  const [monstersLoaded, setMonstersLoaded] = useState([false, false, false]); // Status loading untuk monster 1, 2, 3
  const [souvenirLoaded, setSouvenirLoaded] = useState(false); // Status loading untuk souvenir
  const [photoLoaded, setPhotoLoaded] = useState(false); // Status loading untuk foto danau
  const [showPhoto, setShowPhoto] = useState(false); // Status menampilkan foto
  const [takingPhoto, setTakingPhoto] = useState(false); // Status sedang memfoto
  const [direction, setDirection] = useState('down');
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);
  const lastMoveTimeRef = useRef(0);
  const poseImagesRef = useRef([]);
  const [posesLoaded, setPosesLoaded] = useState(0);
  const [playerAction, setPlayerAction] = useState('idle'); // idle, walk, sleep, sit, jump
  const [showSouvenirShop, setShowSouvenirShop] = useState(false); // Menampilkan toko souvenir
  const [hasSouvenir, setHasSouvenir] = useState(false); // Status kepemilikan souvenir
  const [obstacles, setObstacles] = useState([]);
  const [collisionMap, setCollisionMap] = useState([]);
  const [jumpHeight, setJumpHeight] = useState(0); // untuk animasi lompat
  const [sitScale, setSitScale] = useState(1); // untuk animasi duduk, attack, slash
  const [collisionObjects, setCollisionObjects] = useState([]); // untuk collision detection
  const [slashEffect, setSlashEffect] = useState(null); // untuk efek tebasan
  const [showGoblin, setShowGoblin] = useState(false);
  const [showMonsters, setShowMonsters] = useState(false); // untuk menampilkan monster di gunung
  const [goblins, setGoblins] = useState([
    { id: 1, x: 0, y: 0, size: 50, health: 100, show: true },
    { id: 2, x: 0, y: 0, size: 50, health: 100, show: true },
    { id: 3, x: 0, y: 0, size: 50, health: 100, show: true }
  ]);
  const [monsters, setMonsters] = useState([
    { id: 1, x: 0, y: 0, size: 60, health: 100, show: true },
    { id: 2, x: 0, y: 0, size: 60, health: 100, show: true },
    { id: 3, x: 0, y: 0, size: 60, health: 100, show: true }
  ]);
  const [inBattle, setInBattle] = useState(false);
  const [activeGoblinId, setActiveGoblinId] = useState(null);
  const [activeMonsterID, setActiveMonsterID] = useState(null);
  const [autoAttacking, setAutoAttacking] = useState(false);
  const autoAttackIntervalRef = useRef(null);
  
  // Get interior image based on location
  const getInteriorImage = useCallback(() => {
    // Log current location for debugging
    console.log("Getting interior image for location:", location);
    
    // Fix path issues with correct filenames based on actual files in public/images
    switch(location) {
      case 'home':
        return '/images/interior rumah.jpg';
      case 'candi':
        return '/images/Dalaman candi..png'; // Note: double dot in filename
      case 'danau':
        return '/images/Dalaman Danau.png'; // Correct casing
      case 'pantai':
        return '/images/dalaman pantai.png'; // Correct casing
      case 'gunung':
        return '/images/interior gunung.png';
      default:
        return '/images/interior rumah.jpg';
    }
  }, [location]);
  
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
  
  // Simple collision detection function
  const checkCollision = useCallback((newX, newY, size) => {
    // Basic boundary check
    const canvas = canvasRef.current;
    if (!canvas) return false;
    
    // Check if player is within canvas boundaries
    if (newX < 0 || newY < 0 || 
        newX + size > canvas.width || 
        newY + size > canvas.height) {
      return true; // Collision with canvas boundaries
    }
    
    // Check collision with obstacles
    for (const obstacle of obstacles) {
      // Simple collision detection with reduced hitbox (80% of player size)
      const hitboxSize = size * 0.8;
      const offset = (size - hitboxSize) / 2;
      
      if (
        newX + offset < obstacle.x + obstacle.width &&
        newX + offset + hitboxSize > obstacle.x &&
        newY + offset < obstacle.y + obstacle.height &&
        newY + offset + hitboxSize > obstacle.y
      ) {
        return true; // Collision detected
      }
    }
    
    return false; // No collision
  }, [obstacles]);
  
  // Draw function for animation loop
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Log slash effect for debugging
    if (slashEffect) {
      console.log("Drawing slash effect:", slashEffect);
    }
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw obstacles for debugging (uncomment to see)
    /*
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    obstacles.forEach(obj => {
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });
    */
    
    // Draw interior - always attempt to draw even if imageLoaded is false
    // This ensures interior is visible as soon as possible
    if (interiorImageRef.current && interiorImageRef.current.complete && interiorImageRef.current.naturalWidth !== 0) {
      try {
        console.log("Drawing interior image:", interiorImageRef.current.src);
        ctx.drawImage(interiorImageRef.current, 0, 0, canvas.width, canvas.height);
        
        // If we successfully drew the image but imageLoaded was false, update it
        if (!imageLoaded) {
          setImageLoaded(true);
        }
        
        // Show camera flash effect if taking photo
        if (location === 'danau' && takingPhoto) {
          // Draw flash effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw photo if in danau location and photo is loaded
        if (location === 'danau' && showPhoto && photoImgRef.current && photoLoaded) {
          // Draw circular photo in the corner
          const photoSize = Math.min(canvas.width, canvas.height) * 0.25; // 25% of smallest dimension
          const photoX = canvas.width - photoSize - 20; // Right side with 20px margin
          const photoY = 20; // Top with 20px margin
          const radius = photoSize / 2;
          
          // Save context for clipping
          ctx.save();
          
          // Create circular clipping path
          ctx.beginPath();
          ctx.arc(photoX + radius, photoY + radius, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          
          // Draw the photo inside the circle
          ctx.drawImage(photoImgRef.current, photoX, photoY, photoSize, photoSize);
          
          // Restore context
          ctx.restore();
          
          // Draw border around circular photo
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(photoX + radius, photoY + radius, radius, 0, Math.PI * 2);
          ctx.stroke();
          
          // Draw second border
          ctx.strokeStyle = 'black';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(photoX + radius, photoY + radius, radius + 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      } catch (error) {
        console.error("Error drawing interior image:", error);
        // Draw fallback colored background if image fails
        ctx.fillStyle = '#8B4513'; // Brown color for interior
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      // Draw fallback colored background if no image
      console.warn("No interior image available or image not fully loaded");
      ctx.fillStyle = '#8B4513'; // Brown color for interior
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw souvenir shop if in pantai location (without showing the souvenir image)
    if (location === 'pantai' && showSouvenirShop) {
      // Draw shop area at the left top edge of the screen
      const shopWidth = 100;
      const shopHeight = 100;
      const shopX = canvas.width * 0.25 - shopWidth / 2;
      const shopY = 20;
      
      // Draw shop text without the colored rectangle
      
      // Draw "Souvenir" text above the shop
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      const shopText = "Souvenir";
      const textWidth = ctx.measureText(shopText).width;
      const textX = shopX + (shopWidth / 2) - (textWidth / 2);
      const textY = shopY - 10;
      
      ctx.strokeText(shopText, textX, textY);
      ctx.fillText(shopText, textX, textY);
      
      // Check if player is near the shop to trigger interaction
      const playerCenterX = playerPosition.x + playerPosition.size / 2;
      const playerCenterY = playerPosition.y + playerPosition.size / 2;
      const shopCenterX = shopX + shopWidth / 2;
      const shopCenterY = shopY + shopHeight / 2;
      
      const distance = Math.sqrt(
        Math.pow(playerCenterX - shopCenterX, 2) + 
        Math.pow(playerCenterY - shopCenterY, 2)
      );
      
      // If player is close to the shop, show interaction prompt
      if (distance < (playerPosition.size + shopWidth) / 2) {
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        const promptText = "Press 'B' to buy souvenir";
        const promptWidth = ctx.measureText(promptText).width;
        const promptX = canvas.width / 2 - promptWidth / 2;
        const promptY = canvas.height - 50;
        
        ctx.strokeText(promptText, promptX, promptY);
        ctx.fillText(promptText, promptX, promptY);
      }
    }
    
    // Draw souvenir only if player has bought it
    if (hasSouvenir && souvenirImgRef.current && souvenirLoaded) {
      // Draw souvenir in player's hand or floating nearby
      const souvenirSize = playerPosition.size * 0.6;
      const souvenirX = playerPosition.x + playerPosition.size * 0.8;
      const souvenirY = playerPosition.y - souvenirSize * 0.3;
      
      ctx.drawImage(
        souvenirImgRef.current,
        souvenirX,
        souvenirY,
        souvenirSize,
        souvenirSize
      );
      
      // Draw a message that player has bought a souvenir
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      const boughtText = "Souvenir Bought!";
      const boughtWidth = ctx.measureText(boughtText).width;
      const boughtX = canvas.width / 2 - boughtWidth / 2;
      const boughtY = 50;
      
      ctx.strokeText(boughtText, boughtX, boughtY);
      ctx.fillText(boughtText, boughtX, boughtY);
    }
    
    // Draw goblins if in candi location
    if (location === 'candi' && goblinImgRef.current && showGoblin) {
      // Draw each goblin
      goblins.forEach(goblin => {
        if (goblin.show) {
          // Gambar goblin tanpa efek melayang dan tanpa kotak merah
          ctx.drawImage(
            goblinImgRef.current,
            goblin.x,
            goblin.y,
            goblin.size,
            goblin.size
          );
          
          // Draw health bar above goblin
          const healthBarWidth = goblin.size;
          const healthBarHeight = 8;
          const healthBarX = goblin.x;
          const healthBarY = goblin.y - 20;
          
          // Draw background (empty health bar)
          ctx.fillStyle = 'black';
          ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
          
          // Draw health (filled portion)
          ctx.fillStyle = 'red';
          const currentHealthWidth = (goblin.health / 100) * healthBarWidth;
          ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
          
          // Draw goblin number
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(`Goblin ${goblin.id}`, goblin.x, goblin.y - 30);
        }
      });
      
      // Draw battle text if in battle
      if (inBattle && activeGoblinId) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(`BATTLE GOBLIN ${activeGoblinId}!`, canvas.width / 2 - 100, 50);
      }
    }
    
    // Draw monsters if in gunung location
    if (location === 'gunung' && showMonsters) {
      // Draw each monster
      monsters.forEach((monster, index) => {
        if (monster.show && monsterImgRefs.current[index]) {
          // Gambar monster
          ctx.drawImage(
            monsterImgRefs.current[index],
            monster.x,
            monster.y,
            monster.size,
            monster.size
          );
          
          // Draw health bar above monster
          const healthBarWidth = monster.size;
          const healthBarHeight = 8;
          const healthBarX = monster.x;
          const healthBarY = monster.y - 20;
          
          // Draw background (empty health bar)
          ctx.fillStyle = 'black';
          ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
          
          // Draw health (filled portion)
          ctx.fillStyle = 'red';
          const currentHealthWidth = (monster.health / 100) * healthBarWidth;
          ctx.fillRect(healthBarX, healthBarY, currentHealthWidth, healthBarHeight);
          
          // Draw monster number
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(`Monster ${monster.id}`, monster.x, monster.y - 30);
        }
      });
      
      // Draw battle text if in battle
      if (inBattle && activeMonsterID) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText(`BATTLE MONSTER ${activeMonsterID}!`, canvas.width / 2 - 100, 50);
      }
    }
    

    
    // HANYA gambar satu karakter berdasarkan lokasi
    if (location === 'candi') {
      // Di candi, HANYA gunakan Musuh1.png jika sudah dimuat
      if (playerImgRef.current && avatarLoaded) {
        // Add walking animation effect
        let yOffset = 0;
        if (isMoving) {
          // Animate walking by changing vertical position based on walkFrame
          yOffset = (walkFrame % 2 === 0) ? 0 : -2;
        }
        
        // Jika sedang menyerang, gambar karakter dengan efek maju
        if (playerAction === 'attack') {
          // Geser karakter ke arah goblin yang sedang dilawan
          const activeGoblin = goblins.find(g => g.id === activeGoblinId && g.show);
          if (activeGoblin) {
            // Arahkan karakter ke goblin
            const goblinCenterX = activeGoblin.x + activeGoblin.size / 2;
            const playerCenterX = playerPosition.x + playerPosition.size / 2;
            
            // Geser karakter sedikit ke arah goblin saat menyerang
            const moveTowardsGoblin = goblinCenterX > playerCenterX ? 10 : -10;
            
            ctx.drawImage(
              playerImgRef.current,
              playerPosition.x + moveTowardsGoblin,
              playerPosition.y,
              playerPosition.size,
              playerPosition.size
            );
          } else {
            ctx.drawImage(
              playerImgRef.current,
              playerPosition.x,
              playerPosition.y,
              playerPosition.size,
              playerPosition.size
            );
          }
        } else {
          // Gambar normal jika tidak sedang menyerang
          ctx.drawImage(
            playerImgRef.current,
            playerPosition.x,
            playerPosition.y + yOffset,
            playerPosition.size,
            playerPosition.size
          );
        }
        
        // Gambar efek tebasan jika ada
        if (slashEffect) {
          // Gambar latar belakang tebasan (aura)
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = '#FF9500';
          ctx.beginPath();
          ctx.arc(slashEffect.x1, slashEffect.y1, 50, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#FF0000';
          ctx.beginPath();
          ctx.arc(slashEffect.x2, slashEffect.y2, 60, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          
          // Efek glow yang sangat kuat
          ctx.shadowBlur = 30;
          ctx.shadowColor = '#FF0000';
          
          // Garis tebasan utama (sangat tebal)
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 15;
          ctx.beginPath();
          ctx.moveTo(slashEffect.x1, slashEffect.y1);
          ctx.lineTo(slashEffect.x2, slashEffect.y2);
          ctx.stroke();
          
          // Garis tebasan kedua (efek api)
          ctx.strokeStyle = '#FF0000';
          ctx.lineWidth = 25;
          ctx.beginPath();
          ctx.moveTo(slashEffect.x1, slashEffect.y1);
          ctx.lineTo(slashEffect.x2, slashEffect.y2);
          ctx.stroke();
          
          // Garis tebasan ketiga (efek dalam)
          ctx.strokeStyle = '#FFFF00';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(slashEffect.x1, slashEffect.y1);
          ctx.lineTo(slashEffect.x2, slashEffect.y2);
          ctx.stroke();
          
          // Reset shadow untuk elemen lain
          ctx.shadowBlur = 0;
          
          // Kilatan di sepanjang garis tebasan (lebih banyak dan lebih besar)
          const steps = 12;
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = slashEffect.x1 + (slashEffect.x2 - slashEffect.x1) * t;
            const y = slashEffect.y1 + (slashEffect.y2 - slashEffect.y1) * t;
            
            // Variasi ukuran untuk efek lebih dinamis (lebih besar)
            const size = i === 0 || i === steps ? 20 : 10 + Math.random() * 15;
            
            // Efek kilatan dengan gradien
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, 'white');
            gradient.addColorStop(0.3, 'yellow');
            gradient.addColorStop(0.7, 'orange');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0.8)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Tambahkan efek ledakan besar di titik akhir (target)
          ctx.fillStyle = 'rgba(255, 165, 0, 0.6)';
          ctx.beginPath();
          ctx.arc(slashEffect.x2, slashEffect.y2, 40, 0, Math.PI * 2);
          ctx.fill();
          
          // Tambahkan percikan yang lebih banyak dan lebih besar
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 10;
            const sparkX = slashEffect.x2 + Math.cos(angle) * distance;
            const sparkY = slashEffect.y2 + Math.sin(angle) * distance;
            const sparkSize = Math.random() * 8 + 4;
            
            ctx.fillStyle = i % 3 === 0 ? '#FFFF00' : (i % 3 === 1 ? '#FF6600' : '#FF0000');
            ctx.beginPath();
            ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Tambahkan teks "SLASH!" di dekat tebasan
          ctx.font = 'bold 36px Arial';
          ctx.fillStyle = '#FF0000';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          
          const midX = (slashEffect.x1 + slashEffect.x2) / 2;
          const midY = (slashEffect.y1 + slashEffect.y2) / 2 - 30;
          
          ctx.strokeText('SLASH!', midX - 60, midY);
          ctx.fillText('SLASH!', midX - 60, midY);
        }
      }
    } else {
      // Di lokasi lain, HANYA gunakan pose sesuai arah jika sudah dimuat
      if (poseImagesRef.current.length > 0 && posesLoaded > 0) {
        let poseIndex = 0; // default to down/front (pose 1)
        
        switch(direction) {
          case 'down': poseIndex = 0; break;  // pose 1 untuk depan
          case 'right': poseIndex = 1; break; // pose 2 untuk kanan
          case 'up': poseIndex = 2; break;    // pose 3 untuk belakang
          case 'left': poseIndex = 3; break;  // pose 4 untuk kiri
        }
        
        // Pastikan indeks valid
        poseIndex = Math.min(poseIndex, poseImagesRef.current.length - 1);
        
        const currentImage = poseImagesRef.current[poseIndex];
        
        if (currentImage) {
          // Add a slight bobbing effect if moving for realistic walking
          let yOffset = 0;
          if (isMoving) {
            // Use walkFrame to create a bobbing effect
            yOffset = (walkFrame % 2 === 0) ? 0 : -2;
          }
          
          // Tambahkan efek lompatan jika sedang melompat
          const jumpOffset = playerAction === 'jump' ? jumpHeight : 0;
          
          // Modifikasi untuk efek duduk
          let drawHeight = playerPosition.size;
          let drawY = playerPosition.y + yOffset - jumpOffset;
          
          if (playerAction === 'sit') {
            // Saat duduk, karakter menjadi lebih pendek (75% tinggi normal)
            // dan posisi Y digeser ke bawah agar terlihat duduk di lantai
            drawHeight = playerPosition.size * 0.75;
            drawY = playerPosition.y + (playerPosition.size * 0.25) + yOffset;
          }
          
          ctx.drawImage(
            currentImage,
            playerPosition.x,
            drawY,
            playerPosition.size,
            drawHeight
          );
        }
      }
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
    
    // Draw "Zzz" effect when sleeping
    if (playerAction === 'sleep') {
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = '#4FC3F7'; // Light blue color for Zzz
      ctx.strokeStyle = '#0277BD'; // Darker blue for outline
      ctx.lineWidth = 1;
      
      // Draw multiple Z's with animation based on walkFrame
      const zCount = 3;
      for (let i = 0; i < zCount; i++) {
        const offset = (walkFrame + i) % 3; // 0, 1, or 2
        const zSize = 12 + (i * 4); // Increasing size for each Z
        const zX = playerPosition.x + playerPosition.size - 10 + (i * 8);
        const zY = playerPosition.y - 15 - (offset * 5) - (i * 8);
        
        ctx.strokeText("Z", zX, zY);
        ctx.fillText("Z", zX, zY);
      }
      
      // Update walkFrame for Zzz animation even when not moving
      const now = Date.now();
      if (now - lastMoveTimeRef.current > 500) { // Slower animation for sleep
        setWalkFrame(prev => prev + 1);
        lastMoveTimeRef.current = now;
      }
    }
    
    // Check for collision with any goblin
    if (showGoblin && !inBattle) {
      const playerCenterX = playerPosition.x + playerPosition.size / 2;
      const playerCenterY = playerPosition.y + playerPosition.size / 2;
      
      // Check collision with each goblin
      goblins.forEach(goblin => {
        if (goblin.show) {
          const goblinCenterX = goblin.x + goblin.size / 2;
          const goblinCenterY = goblin.y + goblin.size / 2;
          
          const distance = Math.sqrt(
            Math.pow(playerCenterX - goblinCenterX, 2) + 
            Math.pow(playerCenterY - goblinCenterY, 2)
          );
          
          if (distance < (playerPosition.size + goblin.size) / 2) {
            setInBattle(true);
            setActiveGoblinId(goblin.id);
          }
        }
      });
    }
    
    // Check for collision with any monster in gunung
    if (showMonsters && !inBattle) {
      const playerCenterX = playerPosition.x + playerPosition.size / 2;
      const playerCenterY = playerPosition.y + playerPosition.size / 2;
      
      // Check collision with each monster
      monsters.forEach(monster => {
        if (monster.show) {
          const monsterCenterX = monster.x + monster.size / 2;
          const monsterCenterY = monster.y + monster.size / 2;
          
          const distance = Math.sqrt(
            Math.pow(playerCenterX - monsterCenterX, 2) + 
            Math.pow(playerCenterY - monsterCenterY, 2)
          );
          
          if (distance < (playerPosition.size + monster.size) / 2) {
            setInBattle(true);
            setActiveMonsterID(monster.id);
          }
        }
      });
    }
    
    // Continue animation loop
    animationRef.current = requestAnimationFrame(drawCanvas);
    
    // Update walk frame for bobbing effect if moving
    if (isMoving) {
      const now = Date.now();
      // Gunakan interval yang sama dengan GameMap (150ms) untuk konsistensi animasi
      if (now - lastMoveTimeRef.current > 150) {
        setWalkFrame(prev => prev + 1);
        lastMoveTimeRef.current = now;
      }
    }
  }, [playerPosition, imageLoaded, avatarLoaded, isMoving, walkFrame, playerName, direction, slashEffect, playerAction, goblins, activeGoblinId, location, showGoblin, inBattle, jumpHeight, sitScale, obstacles, showSouvenirShop, hasSouvenir, souvenirLoaded, showPhoto, photoLoaded, takingPhoto]);
  
  // Setup obstacles based on location
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Define obstacles based on location
    let obstacleList = [];
    
    switch(location) {
      case 'home':
        // Obstacles for home interior
        obstacleList = [
          // Walls - make them thinner for better gameplay
          { x: 0, y: 0, width: 10, height: canvas.height }, // Left wall
          { x: canvas.width - 10, y: 0, width: 10, height: canvas.height }, // Right wall
          { x: 0, y: 0, width: canvas.width, height: 10 }, // Top wall
          { x: 0, y: canvas.height - 10, width: canvas.width * 0.4, height: 10 }, // Bottom wall left
          { x: canvas.width * 0.6, y: canvas.height - 10, width: canvas.width * 0.4, height: 10 }, // Bottom wall right
          // Furniture - make it more precise
          { x: canvas.width * 0.4, y: canvas.height * 0.4, width: canvas.width * 0.2, height: canvas.height * 0.1 } // Table
        ];
        break;
      case 'candi':
        // Obstacles for candi interior
        obstacleList = [
          // Walls
          { x: 0, y: 0, width: 20, height: canvas.height }, // Left wall
          { x: canvas.width - 20, y: 0, width: 20, height: canvas.height }, // Right wall
          { x: 0, y: 0, width: canvas.width, height: 20 }, // Top wall
          { x: 0, y: canvas.height - 20, width: canvas.width * 0.4, height: 20 }, // Bottom wall left
          { x: canvas.width * 0.6, y: canvas.height - 20, width: canvas.width * 0.4, height: 20 }, // Bottom wall right
          // Altar
          { x: canvas.width * 0.4, y: canvas.height * 0.2, width: canvas.width * 0.2, height: canvas.height * 0.1 } // Altar
        ];
        break;
      case 'danau':
        // Obstacles for danau interior
        obstacleList = [
          // Walls
          { x: 0, y: 0, width: 20, height: canvas.height }, // Left wall
          { x: canvas.width - 20, y: 0, width: 20, height: canvas.height }, // Right wall
          { x: 0, y: 0, width: canvas.width, height: 20 }, // Top wall
          { x: 0, y: canvas.height - 20, width: canvas.width * 0.4, height: 20 }, // Bottom wall left
          { x: canvas.width * 0.6, y: canvas.height - 20, width: canvas.width * 0.4, height: 20 }, // Bottom wall right
          // Rocks
          { x: canvas.width * 0.2, y: canvas.height * 0.3, width: 30, height: 30 },
          { x: canvas.width * 0.7, y: canvas.height * 0.4, width: 40, height: 40 }
        ];
        break;
      case 'pantai':
      case 'gunung':
      default:
        // Default obstacles (just walls)
        obstacleList = [
          { x: 0, y: 0, width: 20, height: canvas.height }, // Left wall
          { x: canvas.width - 20, y: 0, width: 20, height: canvas.height }, // Right wall
          { x: 0, y: 0, width: canvas.width, height: 20 }, // Top wall
          { x: 0, y: canvas.height - 20, width: canvas.width * 0.4, height: 20 }, // Bottom wall left
          { x: canvas.width * 0.6, y: canvas.height - 20, width: canvas.width * 0.4, height: 20 } // Bottom wall right
        ];
    }
    
    setObstacles(obstacleList);
    setCollisionObjects(obstacleList); // For backward compatibility
  }, [location, canvasRef.current?.width, canvasRef.current?.height]);
  
  // Handle location change and character setup
  useEffect(() => {
    // Completely reset all character images
    poseImagesRef.current = [];
    setPosesLoaded(0);
    setAvatarLoaded(false);
    
    // Clear auto attack interval when changing location
    if (autoAttackIntervalRef.current) {
      clearInterval(autoAttackIntervalRef.current);
      autoAttackIntervalRef.current = null;
    }
    setAutoAttacking(false);
    
    // Show souvenir shop if in pantai location
    if (location === 'pantai') {
      setShowSouvenirShop(true);
    } else {
      setShowSouvenirShop(false);
    }
    
    // Reset photo state when changing location
    if (location === 'danau') {
      setShowPhoto(false);
      setTakingPhoto(false);
    } else {
      setShowPhoto(false);
    }
    
    if (location === 'candi') {
      setShowGoblin(true);
      setShowMonsters(false);
      setInBattle(false);
      
      // Position three goblins in the candi with larger size and better spacing
      const canvas = canvasRef.current;
      if (canvas) {
        // Set goblin size to be proportional to character size
        const goblinSize = 45;
        
        setGoblins([
          { 
            id: 1, 
            x: canvas.width * 0.3 - (goblinSize/2), // Kiri
            y: canvas.height * 0.4, 
            size: goblinSize,
            health: 100,
            show: true
          },
          { 
            id: 2, 
            x: canvas.width * 0.5 - (goblinSize/2), // Tengah
            y: canvas.height * 0.4, 
            size: goblinSize,
            health: 100,
            show: true
          },
          { 
            id: 3, 
            x: canvas.width * 0.7 - (goblinSize/2), // Kanan
            y: canvas.height * 0.4, 
            size: goblinSize,
            health: 100,
            show: true
          }
        ]);
      }
      
      // ONLY load Musuh1.png for candi location
      playerImgRef.current = new Image();
      playerImgRef.current.src = '/images/Musuh1.png';
      playerImgRef.current.onload = () => {
        console.log("Musuh1.png loaded successfully");
        setAvatarLoaded(true);
      };
      playerImgRef.current.onerror = () => {
        console.error("Failed to load Musuh1.png");
        setAvatarLoaded(false);
      };
      
      // Do NOT load any pose images for candi
    } else if (location === 'gunung') {
      // For gunung location
      setShowGoblin(false);
      setShowMonsters(true);
      setInBattle(false);
      
      // Position three monsters in the gunung with good spacing
      const canvas = canvasRef.current;
      if (canvas) {
        // Set monster size to be proportional to character size
        const monsterSize = 60;
        
        setMonsters([
          { 
            id: 1, 
            x: canvas.width * 0.2 - (monsterSize/2), // Kiri
            y: canvas.height * 0.3, 
            size: monsterSize,
            health: 100,
            show: true
          },
          { 
            id: 2, 
            x: canvas.width * 0.5 - (monsterSize/2), // Tengah
            y: canvas.height * 0.5, 
            size: monsterSize,
            health: 100,
            show: true
          },
          { 
            id: 3, 
            x: canvas.width * 0.8 - (monsterSize/2), // Kanan
            y: canvas.height * 0.3, 
            size: monsterSize,
            health: 100,
            show: true
          }
        ]);
      }
      
      // Load pose images for gunung location
      poseImagesRef.current = [];
      let loadedCount = 0;
      
      for (let i = 1; i <= 4; i++) {
        const img = new Image();
        img.src = `/images/pose ${i}.png`;
        img.onload = () => {
          loadedCount++;
          setPosesLoaded(loadedCount);
        };
        img.onerror = () => {
          console.error(`Failed to load pose ${i} image`);
        };
        poseImagesRef.current.push(img);
      }
    } else {
      // For other locations
      setShowGoblin(false);
      setShowMonsters(false);
      setInBattle(false);
      
      // Do NOT load player image for non-candi locations
      playerImgRef.current = null;
      setAvatarLoaded(false);
      
      // ONLY load pose images for non-candi locations
      poseImagesRef.current = [];
      let loadedCount = 0;
      
      for (let i = 1; i <= 4; i++) {
        const img = new Image();
        img.src = `/images/pose ${i}.png`;
        img.onload = () => {
          loadedCount++;
          setPosesLoaded(loadedCount);
        };
        img.onerror = () => {
          console.error(`Failed to load pose ${i} image`);
        };
        poseImagesRef.current.push(img);
      }
    }
  }, [location]);

  // Load interior, goblin, monster, souvenir, and photo images
  useEffect(() => {
    // Load interior image
    interiorImageRef.current = new Image();
    const imagePath = getInteriorImage();
    console.log("Attempting to load interior image:", imagePath);
    
    // Preload image to check if it exists
    interiorImageRef.current.src = imagePath;
    interiorImageRef.current.onload = () => {
      console.log("Interior image loaded successfully:", interiorImageRef.current.src);
      setImageLoaded(true);
    };
    interiorImageRef.current.onerror = () => {
      console.error("Failed to load interior image:", interiorImageRef.current.src);
      
      // Try fallback image with absolute path
      const fallbackPath = '/images/interior rumah.jpg';
      console.log("Trying fallback image:", fallbackPath);
      
      // Create new image for fallback to avoid issues with previous error
      const fallbackImg = new Image();
      fallbackImg.src = fallbackPath;
      
      fallbackImg.onload = () => {
        console.log("Fallback image loaded successfully");
        interiorImageRef.current = fallbackImg;
        setImageLoaded(true);
      };
      
      fallbackImg.onerror = () => {
        console.error("Fallback image also failed to load");
        // Set a colored background as last resort
        setImageLoaded(true);
      };
    };
    
    // Load photo image for danau
    photoImgRef.current = new Image();
    photoImgRef.current.src = '/images/picture lake.png';
    photoImgRef.current.onload = () => {
      console.log("Photo image loaded successfully");
      setPhotoLoaded(true);
    };
    photoImgRef.current.onerror = () => {
      console.error("Failed to load photo image");
      setPhotoLoaded(true); // Still mark as loaded so we can draw something
    };
    
    // Load goblin image for candi
    goblinImgRef.current = new Image();
    goblinImgRef.current.src = '/images/goblin.png';
    goblinImgRef.current.onload = () => {
      console.log("Goblin image loaded successfully");
      setGoblinLoaded(true);
    };
    goblinImgRef.current.onerror = () => {
      console.error("Failed to load goblin image");
      // Fallback to a colored rectangle if image fails to load
      setGoblinLoaded(true); // Still mark as loaded so we can draw something
    };
    
    // Load souvenir image for pantai
    souvenirImgRef.current = new Image();
    souvenirImgRef.current.src = '/images/souvenir beach.png';
    souvenirImgRef.current.onload = () => {
      console.log("Souvenir image loaded successfully");
      setSouvenirLoaded(true);
    };
    souvenirImgRef.current.onerror = () => {
      console.error("Failed to load souvenir image");
      // Fallback to a colored rectangle if image fails to load
      setSouvenirLoaded(true); // Still mark as loaded so we can draw something
    };
    
    // Load monster images for gunung
    for (let i = 0; i < 3; i++) {
      monsterImgRefs.current[i] = new Image();
      monsterImgRefs.current[i].src = `/images/monster ${i+1}.png`;
      
      monsterImgRefs.current[i].onload = () => {
        console.log(`Monster ${i+1} image loaded successfully`);
        setMonstersLoaded(prev => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });
      };
      
      monsterImgRefs.current[i].onerror = () => {
        console.error(`Failed to load monster ${i+1} image`);
        // Fallback to a colored rectangle if image fails to load
        setMonstersLoaded(prev => {
          const newState = [...prev];
          newState[i] = true; // Still mark as loaded so we can draw something
          return newState;
        });
      };
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [getInteriorImage]);
  
  // Start animation loop when images are loaded
  useEffect(() => {
    // Start animation loop as soon as interior image is loaded
    // Don't wait for avatar to be loaded for non-candi locations
    if (imageLoaded && (avatarLoaded || location !== 'candi')) {
      console.log("Starting animation loop - Interior loaded:", imageLoaded, "Avatar loaded:", avatarLoaded);
      animationRef.current = requestAnimationFrame(drawCanvas);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Clear auto attack interval when component unmounts
      if (autoAttackIntervalRef.current) {
        clearInterval(autoAttackIntervalRef.current);
        autoAttackIntervalRef.current = null;
      }
    };
  }, [imageLoaded, avatarLoaded, drawCanvas, location]);
  
  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = canvas.parentElement;
    
    const handleResize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Reset player position when entering interior
      if (playerPosition.isReset !== true) {
        // Set different starting positions based on location
        let startX, startY;
        
        switch(location) {
          case 'home':
            startX = canvas.width * 0.5;  // Center
            startY = canvas.height * 0.75; // Bottom area for home interior
            break;
          case 'candi':
            startX = canvas.width * 0.5;  // Center
            startY = canvas.height * 0.3; // Upper part of screen
            break;
          case 'danau':
            startX = canvas.width * 0.5;  // Center
            startY = canvas.height * 0.5; // Center
            break;
          case 'pantai':
            startX = canvas.width * 0.5;  // Center
            startY = canvas.height * 0.5; // Center
            break;
          case 'gunung':
            startX = canvas.width * 0.5;  // Center
            startY = canvas.height * 0.5; // Center
            break;
          default:
            startX = canvas.width * 0.5;  // Default center
            startY = canvas.height * 0.5; // Default center
        }
        
        // Set character size to be even smaller
        const charSize = Math.min(40, canvas.width * 0.08);
        
        setPlayerPosition({
          x: startX - (charSize / 2),
          y: startY - (charSize / 2),
          size: charSize,
          speed: 6,
          isReset: true
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setPlayerPosition, playerPosition, location]);
  
  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip keyboard input if taking photo
      if (takingPhoto) return;
      
      // Handle movement keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
        setIsMoving(true);
        setPlayerAction('walk');
        
        switch(e.key) {
          case 'ArrowUp':
          case 'w':
          case 'W':
            setDirection('up'); // Menggunakan pose 3 (belakang)
            setPlayerPosition(prev => ({
              ...prev,
              y: Math.max(0, prev.y - prev.speed)
            }));
            break;
          case 'ArrowDown':
          case 's':
          case 'S':
            setDirection('down'); // Menggunakan pose 1 (depan)
            setPlayerPosition(prev => ({
              ...prev,
              y: Math.min(canvasRef.current.height - prev.size, prev.y + prev.speed)
            }));
            break;
          case 'ArrowLeft':
          case 'a':
          case 'A':
            setDirection('left'); // Menggunakan pose 4 (kiri)
            setPlayerPosition(prev => ({
              ...prev,
              x: Math.max(0, prev.x - prev.speed)
            }));
            break;
          case 'ArrowRight':
          case 'd':
          case 'D':
            setDirection('right'); // Menggunakan pose 2 (kanan)
            setPlayerPosition(prev => ({
              ...prev,
              x: Math.min(canvasRef.current.width - prev.size, prev.x + prev.speed)
            }));
            break;
          default:
            break;
        }
      }
      // Handle action keys
      else {
        switch(e.key) {
          case 'b':
          case 'B':
            // Buy souvenir if in pantai location and near the shop
            if (location === 'pantai' && showSouvenirShop) {
              const canvas = canvasRef.current;
              if (canvas) {
                const shopWidth = 100;
                const shopHeight = 100;
                const shopX = canvas.width * 0.25 - shopWidth / 2;
                const shopY = 20;
                
                const playerCenterX = playerPosition.x + playerPosition.size / 2;
                const playerCenterY = playerPosition.y + playerPosition.size / 2;
                const shopCenterX = shopX + shopWidth / 2;
                const shopCenterY = shopY + shopHeight / 2;
                
                const distance = Math.sqrt(
                  Math.pow(playerCenterX - shopCenterX, 2) + 
                  Math.pow(playerCenterY - shopCenterY, 2)
                );
                
                // If player is close to the shop, buy souvenir
                if (distance < (playerPosition.size + shopWidth) / 2) {
                  setHasSouvenir(true);
                  
                  // Show a message that player has bought a souvenir
                  const ctx = canvas.getContext('2d');
                  ctx.font = 'bold 24px Arial';
                  ctx.fillStyle = 'yellow';
                  ctx.strokeStyle = 'black';
                  ctx.lineWidth = 2;
                  const boughtText = "Souvenir Bought!";
                  const boughtWidth = ctx.measureText(boughtText).width;
                  const boughtX = canvas.width / 2 - boughtWidth / 2;
                  const boughtY = 100;
                  
                  ctx.strokeText(boughtText, boughtX, boughtY);
                  ctx.fillText(boughtText, boughtX, boughtY);
                }
              }
            }
            break;
            
          case ' ': // Space for jump
            setPlayerAction('jump');
            
            // Animasi lompatan
            let jumpStep = 0;
            const maxJumpHeight = 40; // Ketinggian maksimum lompatan
            const jumpInterval = setInterval(() => {
              jumpStep++;
              
              // Parabola untuk efek lompatan yang natural
              // Naik lalu turun
              if (jumpStep <= 5) {
                // Fase naik
                setJumpHeight(jumpStep * (maxJumpHeight/5));
              } else if (jumpStep <= 10) {
                // Fase turun
                setJumpHeight((10 - jumpStep) * (maxJumpHeight/5));
              } else {
                // Selesai melompat
                clearInterval(jumpInterval);
                setJumpHeight(0);
                setPlayerAction('idle');
              }
            }, 60); // Interval waktu antar langkah lompatan
            
            break;
          case 'z': // Z for sleep - only in home
            if (location === 'home') {
              setPlayerAction('sleep');
            }
            break;
          case 'p': // P for photo - only in danau
            if (location === 'danau' && !showPhoto && !takingPhoto) {
              handleAction('photo');
            }
            break;
          case 'x': // X for sit
            if (playerAction === 'sit') {
              // Jika sudah duduk, berdiri kembali
              setPlayerAction('idle');
            } else {
              // Jika belum duduk, duduk
              setPlayerAction('sit');
            }
            break;
          case 'Escape':
            onExit();
            break;
          default:
            break;
        }
      }
    };
    
    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
        setIsMoving(false);
        setPlayerAction('idle');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setPlayerPosition, onExit, takingPhoto]);
  
  // Handle movement buttons
  const handleMove = useCallback((dir) => {
    setIsMoving(true);
    setPlayerAction('walk');
    setDirection(dir); // Mengatur arah untuk menggunakan pose yang sesuai
    
    switch(dir) {
      case 'up': // Menggunakan pose 3 (belakang)
        setPlayerPosition(prev => ({
          ...prev,
          y: Math.max(0, prev.y - prev.speed)
        }));
        break;
      case 'down': // Menggunakan pose 1 (depan)
        setPlayerPosition(prev => ({
          ...prev,
          y: Math.min(canvasRef.current.height - prev.size, prev.y + prev.speed)
        }));
        break;
      case 'left': // Menggunakan pose 4 (kiri)
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.max(0, prev.x - prev.speed)
        }));
        break;
      case 'right': // Menggunakan pose 2 (kanan)
        setPlayerPosition(prev => ({
          ...prev,
          x: Math.min(canvasRef.current.width - prev.size, prev.x + prev.speed)
        }));
        break;
      default:
        break;
    }
    
    // Stop moving animation after a short delay
    setTimeout(() => {
      setIsMoving(false);
      setPlayerAction('idle');
    }, 150);
  }, [setPlayerPosition, canvasRef]);
  

  
  // Function to attack current goblin or monster
  const attackCurrentEnemy = useCallback(() => {
    // Attack goblin in candi
    if (inBattle && activeGoblinId && location === 'candi') {
      setPlayerAction('attack');
      
      // Find active goblin
      const activeGoblin = goblins.find(g => g.id === activeGoblinId && g.show);
      if (activeGoblin) {
        // Create slash effect from player to goblin
        const playerCenterX = playerPosition.x + playerPosition.size / 2;
        const playerCenterY = playerPosition.y + playerPosition.size / 2;
        const goblinCenterX = activeGoblin.x + activeGoblin.size / 2;
        const goblinCenterY = activeGoblin.y + activeGoblin.size / 2;
        
        // Buat efek tebasan yang lebih dramatis
        console.log("Creating slash effect!");
        
        // Create slash effect
        setSlashEffect({
          x1: playerCenterX,
          y1: playerCenterY,
          x2: goblinCenterX,
          y2: goblinCenterY
        });
        
        // Remove slash effect after a longer delay for better visibility
        setTimeout(() => setSlashEffect(null), 300);
      }
      
      // Damage active goblin (reduce health)
      setGoblins(prevGoblins => {
        return prevGoblins.map(goblin => {
          if (goblin.id === activeGoblinId) {
            const newHealth = goblin.health - 25; // Setiap serangan mengurangi 25 darah
            
            // If goblin health reaches 0 or below, hide this goblin
            if (newHealth <= 0) {
              // Check if all goblins are defeated
              const remainingGoblins = prevGoblins.filter(g => 
                g.id !== activeGoblinId && g.show && g.health > 0
              );
              
              if (remainingGoblins.length === 0) {
                // All goblins defeated
                setInBattle(false);
                setActiveGoblinId(null);
                setAutoAttacking(false);
                
                // Clear auto attack interval
                if (autoAttackIntervalRef.current) {
                  clearInterval(autoAttackIntervalRef.current);
                  autoAttackIntervalRef.current = null;
                }
                
                // Show victory message
                const canvas = canvasRef.current;
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  ctx.font = 'bold 24px Arial';
                  ctx.fillStyle = 'green';
                  ctx.fillText('All Goblins Defeated!', canvas.width / 2 - 100, 100);
                }
              } else {
                // Find next goblin to battle
                const nextGoblin = remainingGoblins[0];
                setActiveGoblinId(nextGoblin.id);
              }
              
              return { ...goblin, health: 0, show: false };
            }
            
            return { ...goblin, health: newHealth };
          }
          return goblin;
        });
      });
      
      // Reset attack animation after a short delay
      setTimeout(() => setPlayerAction('idle'), 300);
    }
    // Attack monster in gunung
    else if (inBattle && activeMonsterID && location === 'gunung') {
      setPlayerAction('attack');
      
      // Find active monster
      const activeMonster = monsters.find(m => m.id === activeMonsterID && m.show);
      if (activeMonster) {
        // Create slash effect from player to monster
        const playerCenterX = playerPosition.x + playerPosition.size / 2;
        const playerCenterY = playerPosition.y + playerPosition.size / 2;
        const monsterCenterX = activeMonster.x + activeMonster.size / 2;
        const monsterCenterY = activeMonster.y + activeMonster.size / 2;
        
        // Create slash effect
        setSlashEffect({
          x1: playerCenterX,
          y1: playerCenterY,
          x2: monsterCenterX,
          y2: monsterCenterY
        });
        
        // Remove slash effect after a longer delay for better visibility
        setTimeout(() => setSlashEffect(null), 300);
      }
      
      // Damage active monster (reduce health)
      setMonsters(prevMonsters => {
        return prevMonsters.map(monster => {
          if (monster.id === activeMonsterID) {
            const newHealth = monster.health - 20; // Setiap serangan mengurangi 20 darah
            
            // If monster health reaches 0 or below, hide this monster
            if (newHealth <= 0) {
              // Check if all monsters are defeated
              const remainingMonsters = prevMonsters.filter(m => 
                m.id !== activeMonsterID && m.show && m.health > 0
              );
              
              if (remainingMonsters.length === 0) {
                // All monsters defeated
                setInBattle(false);
                setActiveMonsterID(null);
                setAutoAttacking(false);
                
                // Clear auto attack interval
                if (autoAttackIntervalRef.current) {
                  clearInterval(autoAttackIntervalRef.current);
                  autoAttackIntervalRef.current = null;
                }
                
                // Show victory message
                const canvas = canvasRef.current;
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  ctx.font = 'bold 24px Arial';
                  ctx.fillStyle = 'green';
                  ctx.fillText('All Monsters Defeated!', canvas.width / 2 - 100, 100);
                }
              } else {
                // Find next monster to battle
                const nextMonster = remainingMonsters[0];
                setActiveMonsterID(nextMonster.id);
              }
              
              return { ...monster, health: 0, show: false };
            }
            
            return { ...monster, health: newHealth };
          }
          return monster;
        });
      });
      
      // Reset attack animation after a short delay
      setTimeout(() => setPlayerAction('idle'), 300);
    }
  }, [inBattle, activeGoblinId, activeMonsterID, playerPosition, goblins, monsters, location]);
  
  // Handle action buttons
  const handleAction = useCallback((action) => {
    setPlayerAction(action);
    
    if (action === 'jump') {
      // Animasi lompatan untuk tombol jump
      let jumpStep = 0;
      const maxJumpHeight = 40; // Ketinggian maksimum lompatan
      const jumpInterval = setInterval(() => {
        jumpStep++;
        
        // Parabola untuk efek lompatan yang natural
        if (jumpStep <= 5) {
          // Fase naik
          setJumpHeight(jumpStep * (maxJumpHeight/5));
        } else if (jumpStep <= 10) {
          // Fase turun
          setJumpHeight((10 - jumpStep) * (maxJumpHeight/5));
        } else {
          // Selesai melompat
          clearInterval(jumpInterval);
          setJumpHeight(0);
          setPlayerAction('idle');
        }
      }, 60); // Interval waktu antar langkah lompatan
    }
    
    if (action === 'attack' && inBattle) {
      // Start auto-attacking
      setAutoAttacking(true);
      
      // Clear any existing interval
      if (autoAttackIntervalRef.current) {
        clearInterval(autoAttackIntervalRef.current);
      }
      
      // Attack immediately
      attackCurrentEnemy();
      
      // Set up interval to attack every 500ms
      autoAttackIntervalRef.current = setInterval(() => {
        attackCurrentEnemy();
      }, 500);
    }
    
    if (action === 'photo' && location === 'danau') {
      // Start photo taking animation
      setTakingPhoto(true);
      
      // Show flash effect then display photo
      setTimeout(() => {
        setTakingPhoto(false);
        setShowPhoto(true);
      }, 500);
    }
  }, [inBattle, activeGoblinId, activeMonsterID, attackCurrentEnemy, location]);
  
  return (
    <div className="interior-container w-full md:w-2/3 bg-gray-200 rounded-xl shadow-inner overflow-hidden relative mb-4 md:mb-0">
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onExit}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Exit
        </button>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
        {location === 'home' ? 'Home Interior' : 
         location === 'candi' ? 'Temple Interior' : 
         location === 'danau' ? 'Lake Interior' : 
         location === 'pantai' ? 'Beach Interior' :
         location === 'gunung' ? 'Mountain Interior' : 'Interior'}
      </div>
      
      {/* Touch controls for movement */}
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
      
      {/* Action buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {location !== 'candi' && !inBattle && (
          <>
            <button 
              onClick={() => handleAction('jump')}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
            >
              Jump
            </button>
            <button 
              onClick={() => handleAction(playerAction === 'sit' ? 'idle' : 'sit')}
              className={`${playerAction === 'sit' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg`}
            >
              Sit
            </button>
            {/* Only show sleep button in home interior */}
            {location === 'home' && (
              <button 
                onClick={() => handleAction('sleep')}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
              >
                Sleep
              </button>
            )}
            
            {/* Show take photo button in danau interior */}
            {location === 'danau' && !showPhoto && !takingPhoto && (
              <button 
                onClick={() => handleAction('photo')}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full w-auto px-3 h-12 flex items-center justify-center shadow-lg"
              >
                Take a Photo
              </button>
            )}
            {/* Show buy souvenir button in pantai interior only when player is near the shop */}
            {location === 'pantai' && showSouvenirShop && !hasSouvenir && (() => {
              // Check if player is near the shop
              const canvas = canvasRef.current;
              if (canvas) {
                const shopWidth = 100;
                const shopHeight = 100;
                const shopX = canvas.width * 0.25 - shopWidth / 2;
                const shopY = 20;
                
                const playerCenterX = playerPosition.x + playerPosition.size / 2;
                const playerCenterY = playerPosition.y + playerPosition.size / 2;
                const shopCenterX = shopX + shopWidth / 2;
                const shopCenterY = shopY + shopHeight / 2;
                
                const distance = Math.sqrt(
                  Math.pow(playerCenterX - shopCenterX, 2) + 
                  Math.pow(playerCenterY - shopCenterY, 2)
                );
                
                // Only show button if player is close to the shop
                if (distance < (playerPosition.size + shopWidth) / 2) {
                  return (
                    <button 
                      onClick={() => {
                        setHasSouvenir(true);
                        // Show a message that player has bought a souvenir
                        const ctx = canvas.getContext('2d');
                        ctx.font = 'bold 24px Arial';
                        ctx.fillStyle = 'yellow';
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 2;
                        const boughtText = "Souvenir Bought!";
                        const boughtWidth = ctx.measureText(boughtText).width;
                        const boughtX = canvas.width / 2 - boughtWidth / 2;
                        const boughtY = 100;
                        
                        ctx.strokeText(boughtText, boughtX, boughtY);
                        ctx.fillText(boughtText, boughtX, boughtY);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full w-auto px-3 h-12 flex items-center justify-center shadow-lg"
                    >
                      Buy Souvenir
                    </button>
                  );
                }
              }
              return null;
            })()}
          </>
        )}
        {inBattle && location === 'candi' && (
          <button 
            onClick={() => handleAction('attack')}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse"
          >
            Attack
          </button>
        )}
        {inBattle && location === 'gunung' && (
          <button 
            onClick={() => handleAction('attack')}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse"
          >
            Attack
          </button>
        )}
      </div>
      
      {/* Battle message */}
      {location === 'candi' && inBattle && activeGoblinId && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg animate-bounce">
          Musuh1 vs Goblin {activeGoblinId}! FIGHT!
        </div>
      )}
      
      {/* Battle message for gunung */}
      {location === 'gunung' && inBattle && activeMonsterID && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg animate-bounce">
          Player vs Monster {activeMonsterID}! FIGHT!
        </div>
      )}
      
      {/* Photo message for danau */}
      {location === 'danau' && showPhoto && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Photo taken!
        </div>
      )}
      
      {/* Take Photo button for danau */}
      {location === 'danau' && !showPhoto && !takingPhoto && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          Press the "Take a Photo" button to capture the lake!
        </div>
      )}
    </div>
  );
};

export default InteriorView;