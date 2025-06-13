import React from 'react';

const ActionPanel = ({ onAction, stats, location, isInterior, interiorLocation }) => {
  // Define available actions based on location
  const locationActions = {
    home: [
      { 
        id: 'enter', 
        name: 'Enter Home', 
        class: 'bg-purple-600 hover:bg-purple-700',
        disabled: false,
        description: 'Go inside your home',
        showOnlyOutside: true
      },
      { 
        id: 'sleep', 
        name: 'Sleep', 
        class: 'bg-blue-500 hover:bg-blue-600',
        disabled: false,
        description: 'Restore energy (+30), Time +4 hours',
        showOnlyInside: true
      },
      { 
        id: 'eat', 
        name: 'Eat', 
        class: 'bg-yellow-500 hover:bg-yellow-600',
        disabled: false,
        description: 'Restore hunger (+20)',
        showOnlyInside: true
      },
      { 
        id: 'play', 
        name: 'Play Games', 
        class: 'bg-pink-500 hover:bg-pink-600',
        disabled: false,
        description: 'Increase happiness (+20), Energy -10',
        showOnlyInside: true
      },
      { 
        id: 'shower', 
        name: 'Take a bath', 
        class: 'bg-green-500 hover:bg-green-600',
        disabled: false,
        description: 'Improve hygiene (+20)',
        showOnlyInside: true
      },
      { 
        id: 'work', 
        name: 'Work', 
        class: 'bg-indigo-500 hover:bg-indigo-600',
        disabled: stats.energy < 20,
        description: '+$25, Energy -20, Happiness -5',
        showOnlyInside: true
      },
      { 
        id: 'read', 
        name: 'Read a Book', 
        class: 'bg-purple-500 hover:bg-purple-600',
        disabled: false,
        description: 'Happiness +15, Energy -5',
        showOnlyInside: true
      }
    ],
    danau: [
      { 
        id: 'enter', 
        name: 'Explore Lake', 
        class: 'bg-purple-600 hover:bg-purple-700',
        disabled: false,
        description: 'Go inside the lake area',
        showOnlyOutside: true
      },
      { 
        id: 'fish', 
        name: 'Fishing', 
        class: 'bg-blue-500 hover:bg-blue-600',
        disabled: false,
        description: 'Hunger +15, Happiness +10, Energy -10',
        showOnlyInside: true
      },
      { 
        id: 'swimDanau', 
        name: 'Swimming', 
        class: 'bg-cyan-500 hover:bg-cyan-600',
        disabled: false,
        description: 'Hygiene +15, Energy -15, Happiness +10',
        showOnlyInside: true
      },
      { 
        id: 'rest', 
        name: 'Take a Rest', 
        class: 'bg-gray-500 hover:bg-gray-600',
        disabled: false,
        description: 'Energy +15, Time +1 hour',
        showOnlyInside: true
      },
      { 
        id: 'takePhotos', 
        name: 'Take Nature Photos', 
        class: 'bg-amber-500 hover:bg-amber-600',
        disabled: false,
        description: '+$10, Happiness +10, Energy -5',
        showOnlyInside: true
      }
    ],
    pantai: [
      { 
        id: 'enter', 
        name: 'Explore Beach', 
        class: 'bg-purple-600 hover:bg-purple-700',
        disabled: false,
        description: 'Go to the beach area',
        showOnlyOutside: true
      },
      { 
        id: 'swimPantai', 
        name: 'Swimming', 
        class: 'bg-blue-500 hover:bg-blue-600',
        disabled: false,
        description: 'Hygiene +20, Energy -10, Happiness +15',
        showOnlyInside: true
      },
      { 
        id: 'sunbathe', 
        name: 'Sunbathe', 
        class: 'bg-yellow-500 hover:bg-yellow-600',
        disabled: false,
        description: 'Happiness +20, Energy +10, Hunger -5',
        showOnlyInside: true
      },
      { 
        id: 'buildSandcastle', 
        name: 'Make a Sandcastle', 
        class: 'bg-amber-500 hover:bg-amber-600',
        disabled: false,
        description: 'Happiness +25, Energy -10',
        showOnlyInside: true
      },
      { 
        id: 'buySouvenir', 
        name: 'Buy Souvenir', 
        class: 'bg-pink-500 hover:bg-pink-600',
        disabled: stats.money < 15,
        description: '-$15, Happiness +20',
        showOnlyInside: true
      }
    ],
    gunung: [
      { 
        id: 'enter', 
        name: 'Climb Mountain', 
        class: 'bg-purple-600 hover:bg-purple-700',
        disabled: false,
        description: 'Go to the mountain area',
        showOnlyOutside: true
      },
      { 
        id: 'hike', 
        name: 'Hike', 
        class: 'bg-green-500 hover:bg-green-600',
        disabled: false,
        description: 'Happiness +20, Energy -20, Hunger -10',
        showOnlyInside: true
      },
      { 
        id: 'camp', 
        name: 'Camping', 
        class: 'bg-amber-700 hover:bg-amber-800',
        disabled: false,
        description: 'Energy +20, Happiness +15, Time +2 hours',
        showOnlyInside: true
      },
      { 
        id: 'findTreasure', 
        name: 'Find a Treasure', 
        class: 'bg-yellow-500 hover:bg-yellow-600',
        disabled: false,
        description: '+$10-$60, Energy -15',
        showOnlyInside: true
      },
      { 
        id: 'takeMountainPhotos', 
        name: 'Take Mountain Photos', 
        class: 'bg-blue-500 hover:bg-blue-600',
        disabled: false,
        description: '+$5-$25, Energy -10',
        showOnlyInside: true
      }
    ],
    candi: [
      { 
        id: 'enter', 
        name: 'Enter Temple', 
        class: 'bg-purple-600 hover:bg-purple-700',
        disabled: false,
        description: 'Go inside the temple',
        showOnlyOutside: true
      },
      { 
        id: 'meditate', 
        name: 'Meditate', 
        class: 'bg-purple-500 hover:bg-purple-600',
        disabled: false,
        description: 'Happiness +20, Energy +15, Time +1 hour',
        showOnlyInside: true
      },
      { 
        id: 'pray', 
        name: 'Pray/Make an Offering', 
        class: 'bg-gray-500 hover:bg-gray-600',
        disabled: stats.money < 10,
        description: '-$10, Random stat boost',
        showOnlyInside: true
      },
      { 
        id: 'explore', 
        name: 'Explore', 
        class: 'bg-red-500 hover:bg-red-600',
        disabled: false,
        description: 'Happiness +15, Energy -10, Hunger -5',
        showOnlyInside: true
      },
      { 
        id: 'study', 
        name: 'Learn History', 
        class: 'bg-indigo-500 hover:bg-indigo-600',
        disabled: false,
        description: 'Happiness +10, Energy -5',
        showOnlyInside: true
      }
    ]
  };
  
  // Get actions for current location
  let actions = [];
  
  if (isInterior) {
    // If inside a building, show only interior actions
    actions = (locationActions[interiorLocation] || []).filter(action => !action.showOnlyOutside);
  } else if (location) {
    // If outside, show only exterior actions
    actions = (locationActions[location] || []).filter(action => !action.showOnlyInside);
  }
  
  // Get location name for display
  const getLocationName = () => {
    if (isInterior) {
      switch(interiorLocation) {
        case 'home': return 'Home Interior';
        case 'candi': return 'Temple Interior';
        case 'danau': return 'Lake Interior';
        case 'pantai': return 'Beach Interior';
        case 'gunung': return 'Mountain Interior';
        default: return 'Interior';
      }
    } else if (location) {
      switch(location) {
        case 'home': return 'Home';
        case 'candi': return 'Temple';
        case 'danau': return 'Lake';
        case 'pantai': return 'Beach';
        case 'gunung': return 'Mountain';
        default: return location.charAt(0).toUpperCase() + location.slice(1);
      }
    }
    return 'Actions';
  };
  
  return (
    <div className="bg-gradient-to-r from-indigo-900 to-blue-800 p-4 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-white flex items-center">
        {location && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
        {getLocationName()}
      </h2>
      
      {actions.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 actions-grid actions-container">
          {actions.map(action => (
            <div key={action.id} className="mb-2 w-full tooltip">
              <button
                onClick={() => onAction(action.id)}
                disabled={action.disabled}
                className={`text-white py-2 px-3 rounded-lg ${action.class} w-full flex flex-col items-center justify-center transition-all duration-200 transform hover:scale-105 ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg'
                }`}
              >
                <div className="font-medium">{action.name}</div>
                <div className="text-xs mt-1 text-white text-opacity-80">{action.description}</div>
              </button>
              {action.moneyEffect && (
                <span className="tooltiptext">{action.moneyEffect}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-300 italic text-center py-4">Move to a location to see available actions</p>
      )}
    </div>
  );
};

export default ActionPanel;