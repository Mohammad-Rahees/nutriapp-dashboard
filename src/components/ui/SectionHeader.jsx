import React from 'react';

const SectionHeader = ({ title, actionText, onAction }) => (
  <div className="flex items-center justify-between mb-4 lg:mb-6">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    {actionText && (
      <button 
        onClick={onAction}
        className="px-4 py-1.5 bg-purple-50 hover:bg-purple-100 text-sm font-semibold text-purple-600 hover:text-purple-700 rounded-full transition-all duration-300 shadow-sm"
      >
        {actionText}
      </button>
    )}
  </div>
);

export default SectionHeader;
