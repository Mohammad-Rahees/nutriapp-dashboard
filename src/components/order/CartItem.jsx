import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onUpdateQuantity }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-purple-50 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 bg-white group cursor-pointer">
      {/* Item Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl shadow-sm border border-gray-100 flex-shrink-0 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      
      {/* Item Info */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">${(item.price || 0).toFixed(2)} / {item.unit || 'unit'}</p>
      </div>
      
      {/* Controls & Price */}
      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-3">
        <span className="font-bold text-gray-800 sm:text-lg">${((item.price || 0) * item.quantity).toFixed(2)}</span>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm transition-all duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, -1); }}
              className="p-1 rounded-md text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, 1); }}
              className="p-1 rounded-md text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(item.id, -item.quantity); }}
            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
            title="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
