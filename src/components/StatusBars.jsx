import React, { useState, useEffect } from 'react';

const StatusBars = ({ playerName, stats, day, time, greeting }) => {
  const [moneyAnimation, setMoneyAnimation] = useState(false);
  const prevMoneyRef = React.useRef(stats.money);
  
  // Add money animation when money changes
  useEffect(() => {
    if (stats.money !== prevMoneyRef.current) {
      setMoneyAnimation(true);
      const timer = setTimeout(() => {
        setMoneyAnimation(false);
      }, 300);
      prevMoneyRef.current = stats.money;
      return () => clearTimeout(timer);
    }
  }, [stats.money]);
  
  // Get color class based on stat value
  const getColorClass = (value) => {
    if (value <= 20) return 'bg-red-500';
    if (value <= 40) return 'bg-orange-500';
    if (value <= 60) return 'bg-yellow-500';
    if (value <= 80) return 'bg-lime-500';
    return 'bg-green-500';
  };
  
  return (
    <header className="bg-gradient-to-r from-indigo-900 to-blue-800 text-white shadow-lg p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="mr-3 bg-blue-700 p-2 rounded-full shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">{greeting}</h1>
          </div>
          <div className="text-right bg-blue-700 px-4 py-2 rounded-lg shadow-inner">
            <p className="font-semibold">Day <span className="text-yellow-300">{day}</span></p>
            <p className="text-blue-200">{time}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {/* Meal/Hunger */}
          <div className="bg-blue-700 p-3 rounded-lg shadow-md">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Meal
              </span>
              <span className="text-sm bg-blue-800 px-2 py-0.5 rounded-full">{Math.round(stats.hunger)}%</span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-2.5 shadow-inner">
              <div 
                className={`${getColorClass(stats.hunger)} h-2.5 rounded-full transition-all duration-500`} 
                style={{ width: `${stats.hunger}%` }}
              ></div>
            </div>
          </div>
          
          {/* Sleep/Energy */}
          <div className="bg-blue-700 p-3 rounded-lg shadow-md">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Energy
              </span>
              <span className="text-sm bg-blue-800 px-2 py-0.5 rounded-full">{Math.round(stats.energy)}%</span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-2.5 shadow-inner">
              <div 
                className={`${getColorClass(stats.energy)} h-2.5 rounded-full transition-all duration-500`} 
                style={{ width: `${stats.energy}%` }}
              ></div>
            </div>
          </div>
          
          {/* Hygiene */}
          <div className="bg-blue-700 p-3 rounded-lg shadow-md">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
                Hygiene
              </span>
              <span className="text-sm bg-blue-800 px-2 py-0.5 rounded-full">{Math.round(stats.hygiene)}%</span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-2.5 shadow-inner">
              <div 
                className={`${getColorClass(stats.hygiene)} h-2.5 rounded-full transition-all duration-500`} 
                style={{ width: `${stats.hygiene}%` }}
              ></div>
            </div>
          </div>
          
          {/* Happiness */}
          <div className="bg-blue-700 p-3 rounded-lg shadow-md">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Happiness
              </span>
              <span className="text-sm bg-blue-800 px-2 py-0.5 rounded-full">{Math.round(stats.happiness)}%</span>
            </div>
            <div className="w-full bg-blue-900 rounded-full h-2.5 shadow-inner">
              <div 
                className={`${getColorClass(stats.happiness)} h-2.5 rounded-full transition-all duration-500`} 
                style={{ width: `${stats.happiness}%` }}
              ></div>
            </div>
          </div>
          
          {/* Money */}
          <div className="bg-blue-700 p-3 rounded-lg shadow-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium mr-2">Money:</span>
            <span className={`font-bold text-yellow-300 ${moneyAnimation ? 'scale-110' : ''} transition-all duration-300`}>
              ${stats.money}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StatusBars;