import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActivitySystem from './ActivitySystem';
import ActivityMenu from './ActivityMenu';
import './ActivityStyles.css';
import './ActivityMenuStyles.css';

const ActivityManager = ({ playerStats, updatePlayerStats, onActivityComplete }) => {
  const [showActivityMenu, setShowActivityMenu] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [showActivitySystem, setShowActivitySystem] = useState(false);

  // Handle selecting an activity from the menu
  const handleSelectActivity = (activity) => {
    setCurrentActivity(activity);
    setShowActivityMenu(false);
    setShowActivitySystem(true);
  };

  // Handle updating stats during an activity
  const handleUpdateStats = (statChanges) => {
    const updatedStats = { ...playerStats };
    
    // Apply stat changes
    Object.entries(statChanges).forEach(([stat, value]) => {
      if (updatedStats[stat] !== undefined) {
        // Ensure stats stay within bounds (0-100)
        updatedStats[stat] = Math.max(0, Math.min(100, updatedStats[stat] + value));
      }
    });
    
    updatePlayerStats(updatedStats);
  };

  // Handle activity completion
  const handleActivityComplete = () => {
    if (onActivityComplete && currentActivity) {
      onActivityComplete(currentActivity.id);
    }
    setShowActivitySystem(false);
    setCurrentActivity(null);
  };

  // Toggle activity menu
  const toggleActivityMenu = () => {
    setShowActivityMenu(prev => !prev);
  };

  // Close activity menu
  const closeActivityMenu = () => {
    setShowActivityMenu(false);
  };

  // Close activity system
  const closeActivitySystem = () => {
    setShowActivitySystem(false);
    setCurrentActivity(null);
  };

  return (
    <>
      {/* Button to open activity menu */}
      <button 
        className="activity-button"
        onClick={toggleActivityMenu}
      >
        Aktivitas
      </button>

      {/* Activity menu component */}
      <ActivityMenu 
        isVisible={showActivityMenu}
        onClose={closeActivityMenu}
        onSelectActivity={handleSelectActivity}
      />

      {/* Activity system component */}
      <ActivitySystem 
        isVisible={showActivitySystem}
        onClose={closeActivitySystem}
        playerStats={playerStats}
        onUpdateStats={handleUpdateStats}
        onActivityComplete={handleActivityComplete}
        currentActivity={currentActivity}
      />
    </>
  );
};

ActivityManager.propTypes = {
  playerStats: PropTypes.object.isRequired,
  updatePlayerStats: PropTypes.func.isRequired,
  onActivityComplete: PropTypes.func
};

export default ActivityManager;