import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const CourierInfo = ({ name, rating, deliveries, image }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Courier</h2>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={image || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200"} 
            alt="Courier" 
            className="w-14 h-14 rounded-full border-2 border-white box-content shadow-sm object-cover"
          />
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-yellow-500 mt-0.5">
            ★ <span className="text-gray-700 font-medium">{rating}</span> <span className="text-gray-400 text-xs">({deliveries} deliveries)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 bg-purple-50 hover:bg-opacity-80 hover:bg-purple-100 text-purple-700 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-sm hover:scale-[1.02]">
          <MessageSquare className="w-4 h-4" />
          Message
        </button>
        <button className="p-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.05] hover:bg-opacity-80">
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CourierInfo;
