import React from 'react';

const StatCard = ({ title, primaryValue, secondaryValue, secondaryUnit, secondaryColorClass = "text-gray-400" }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300">
      <h3 className="text-gray-500 text-sm font-semibold mb-2 tracking-wide">{title}</h3>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-semibold text-gray-800">{primaryValue}</span>
        <span className={`text-sm font-medium mb-1 ${secondaryColorClass}`}>
          {secondaryValue} {secondaryUnit && ` ${secondaryUnit}`}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
