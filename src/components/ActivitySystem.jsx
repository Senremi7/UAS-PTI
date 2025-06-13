import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CharacterAnimation from './CharacterAnimation';

const ActivitySystem = ({ 
  onUpdateStats, 
  onActivityComplete, 
  playerStats, 
  isVisible, 
  onClose,
  currentActivity 
}) => {
  const [progress, setProgress] = useState(0);
  const [isFastForward, setIsFastForward] = useState(false);
  const intervalRef = useRef(null);

  // Start an activity
  const startActivity = () => {
    setProgress(0);
    setIsFastForward(false);
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up the interval for normal mode
    const updateInterval = 100; // Update every 100ms for smooth progress
    const totalUpdates = activity.duration * 1000 / updateInterval;
    const statIncrement = {};
    
    // Calculate incremental stat changes
    Object.keys(activity.effects).forEach(stat => {
      statIncrement[stat] = activity.effects[stat] / totalUpdates;
    });
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / totalUpdates);
        
        // Apply incremental stat changes in normal mode
        if (!isFastForward) {
          onUpdateStats(statIncrement);
        }
        
        // Check if activity is complete
        if (newProgress >= 100) {
          clearInterval(intervalRef.current);
          onActivityComplete(activity.id);
          return 100;
        }
        
        return newProgress;
      });
    }, updateInterval);
  };

  // Handle fast forward
  const handleFastForward = () => {
    if (!currentActivity) return;
    
    setIsFastForward(true);
    clearInterval(intervalRef.current);
    
    // Apply all remaining stat changes at once
    const remainingProgress = 100 - progress;
    const remainingFraction = remainingProgress / 100;
    
    const finalStats = {};
    Object.keys(currentActivity.effects).forEach(stat => {
      finalStats[stat] = currentActivity.effects[stat] * remainingFraction;
    });
    
    // Apply the remaining stats all at once
    onUpdateStats(finalStats);
    
    // Complete the activity
    setProgress(100);
    setTimeout(() => {
      onActivityComplete();
    }, 500); // Short delay for visual feedback
  };

  // Start activity when component becomes visible or activity changes
  useEffect(() => {
    if (isVisible && currentActivity) {
      startActivity();
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up the interval for normal mode
      const updateInterval = 100; // Update every 100ms for smooth progress
      const totalUpdates = currentActivity.duration * 1000 / updateInterval;
      const statIncrement = {};
      
      // Calculate incremental stat changes
      Object.keys(currentActivity.effects).forEach(stat => {
        statIncrement[stat] = currentActivity.effects[stat] / totalUpdates;
      });
      
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / totalUpdates);
          
          // Apply incremental stat changes in normal mode
          if (!isFastForward) {
            onUpdateStats(statIncrement);
          }
          
          // Check if activity is complete
          if (newProgress >= 100) {
            clearInterval(intervalRef.current);
            onActivityComplete();
            return 100;
          }
          
          return newProgress;
        });
      }, updateInterval);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible, currentActivity, isFastForward]);

  // If not visible, don't render
  if (!isVisible || !currentActivity) return null;

  return (
    <div className="activity-system">
      <div className="activity-header">
        <h3>{currentActivity.name}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="activity-animation">
        {/* Advanced character animation */}
        <CharacterAnimation 
          activity={currentActivity.animation} 
          avatarIndex={0} 
        />
      </div>
      
      <div className="activity-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="progress-text">{Math.round(progress)}%</div>
      </div>
      
      <div className="activity-controls">
        {!isFastForward && progress < 100 && (
          <button 
            className="fast-forward-button"
            onClick={handleFastForward}
          >
            Fast Forward
          </button>
        )}
      </div>
      
      <div className="activity-effects">
        <h4>Efek Aktivitas:</h4>
        <ul>
          {currentActivity && Object.entries(currentActivity.effects).map(([stat, value]) => (
            <li key={stat}>
              {stat.charAt(0).toUpperCase() + stat.slice(1)}: 
              <span className={value > 0 ? 'positive' : 'negative'}>
                {value > 0 ? '+' : ''}{value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ActivitySystem.propTypes = {
  onUpdateStats: PropTypes.func.isRequired,
  onActivityComplete: PropTypes.func.isRequired,
  playerStats: PropTypes.object.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ActivitySystem;