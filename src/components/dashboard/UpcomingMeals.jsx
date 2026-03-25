import React from 'react';

const UpcomingMeals = ({ meals }) => {
  return (
    <div className="space-y-4">
      {meals.map((meal, idx) => (
        <div 
          key={idx} 
          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300 border border-transparent hover:border-gray-100 hover:shadow-sm cursor-pointer group"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold shrink-0 group-hover:bg-purple-200 transition-colors shadow-sm">
            {meal.initials}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-800">{meal.name}</h4>
            <p className="text-xs text-gray-500 font-medium">{meal.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingMeals;
