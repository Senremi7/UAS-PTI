import { useState } from 'react';
import PropTypes from 'prop-types';

const ActivityMenu = ({ onSelectActivity, isVisible, onClose }) => {
  // Define available activities
  const activities = [
    { 
      id: 'makan', 
      name: 'Makan', 
      duration: 10,
      description: 'Meningkatkan kenyang dan sedikit energi',
      effects: { kenyang: 30, energi: 10 }
    },
    { 
      id: 'tidur', 
      name: 'Tidur', 
      duration: 20,
      description: 'Memulihkan energi dan kesehatan',
      effects: { energi: 40, kesehatan: 15 }
    },
    { 
      id: 'olahraga', 
      name: 'Olahraga', 
      duration: 15,
      description: 'Meningkatkan kesehatan, mengurangi kenyang dan energi',
      effects: { kesehatan: 25, kenyang: -10, energi: -15 }
    },
    { 
      id: 'belajar', 
      name: 'Belajar', 
      duration: 15,
      description: 'Meningkatkan kecerdasan, mengurangi energi',
      effects: { kecerdasan: 25, energi: -10 }
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="activity-menu">
      <div className="activity-menu-header">
        <h3>Pilih Aktivitas</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="activity-list">
        {activities.map(activity => (
          <div 
            key={activity.id} 
            className="activity-item"
            onClick={() => onSelectActivity(activity)}
          >
            <div className="activity-item-header">
              <h4>{activity.name}</h4>
              <span className="duration">{activity.duration} detik</span>
            </div>
            
            <p className="activity-description">{activity.description}</p>
            
            <div className="activity-effects-preview">
              {Object.entries(activity.effects).map(([stat, value]) => (
                <span 
                  key={stat} 
                  className={`effect-badge ${value > 0 ? 'positive' : 'negative'}`}
                >
                  {stat}: {value > 0 ? '+' : ''}{value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ActivityMenu.propTypes = {
  onSelectActivity: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ActivityMenu;