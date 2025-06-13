import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const CharacterAnimation = ({ activity, avatarIndex }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameRef = useRef(0);
  
  // Get avatar image source based on avatarIndex and activity
  const getAnimationSrc = () => {
    // In a real implementation, you would have different animation sprites
    // for different activities. For now, we'll use the same base image.
    return `/images/pose 1.png`;
  };
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = getAnimationSrc();
    
    img.onload = () => {
      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply animation effects based on activity
        switch(activity) {
          case 'eating':
            // Eating animation - slight bobbing
            const eatingOffset = Math.sin(frameRef.current * 0.2) * 3;
            ctx.drawImage(
              img, 
              canvas.width/2 - 32, 
              canvas.height/2 - 32 + eatingOffset, 
              64, 
              64
            );
            break;
            
          case 'sleeping':
            // Sleeping animation - character lying down
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(Math.PI / 2); // Rotate 90 degrees
            ctx.drawImage(img, -32, -32, 64, 64);
            ctx.restore();
            
            // Add "Z" particles floating up
            if (frameRef.current % 20 === 0) {
              ctx.font = '16px Arial';
              ctx.fillStyle = 'white';
              ctx.fillText('Z', canvas.width/2 + 20, canvas.height/2 - 10);
            } else if (frameRef.current % 20 === 10) {
              ctx.font = '12px Arial';
              ctx.fillStyle = 'rgba(255,255,255,0.7)';
              ctx.fillText('z', canvas.width/2 + 30, canvas.height/2 - 20);
            }
            break;
            
          case 'exercising':
            // Exercising animation - jumping
            const jumpHeight = Math.abs(Math.sin(frameRef.current * 0.2) * 10);
            ctx.drawImage(
              img, 
              canvas.width/2 - 32, 
              canvas.height/2 - 32 - jumpHeight, 
              64, 
              64
            );
            break;
            
          case 'studying':
            // Studying animation - slight head movement
            const studyTilt = Math.sin(frameRef.current * 0.05) * 0.1;
            ctx.save();
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.rotate(studyTilt);
            ctx.drawImage(img, -32, -32, 64, 64);
            ctx.restore();
            
            // Add a book
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(canvas.width/2 - 20, canvas.height/2 + 20, 40, 10);
            break;
            
          default:
            // Default animation - just draw the character
            ctx.drawImage(
              img, 
              canvas.width/2 - 32, 
              canvas.height/2 - 32, 
              64, 
              64
            );
        }
        
        frameRef.current++;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animate();
    };
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activity, avatarIndex]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={120} 
      height={120} 
      className="character-animation-canvas"
    />
  );
};

CharacterAnimation.propTypes = {
  activity: PropTypes.string.isRequired,
  avatarIndex: PropTypes.number
};

CharacterAnimation.defaultProps = {
  avatarIndex: 0
};

export default CharacterAnimation;