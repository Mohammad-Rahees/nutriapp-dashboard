import React from 'react';

const ProfileFormSection = ({ title, icon: Icon, iconColorClass, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 hover:shadow-md hover:scale-[1.01] transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default ProfileFormSection;
