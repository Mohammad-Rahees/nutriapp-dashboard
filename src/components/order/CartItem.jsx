import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const itemTitle = item.name || item.title || 'Meal Item';
  const itemPrice = Number(item.price || 0);
  const itemQuantity = Number(item.quantity || 1);
  const itemImage = item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-purple-50 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 bg-white group cursor-pointer">
      {/* Item Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl shadow-sm border border-gray-100 flex-shrink-0 overflow-hidden">
        <img src={itemImage} alt={itemTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      
      {/* Item Info */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800">{itemTitle}</h3>
        <p className="text-sm text-gray-500 mt-1">${itemPrice.toFixed(2)} / {item.unit || 'meal'}</p>
      </div>
      
      {/* Controls & Price */}
      <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-3">
        <span className="font-bold text-gray-800 sm:text-lg">${(itemPrice * itemQuantity).toFixed(2)}</span>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-1 shadow-sm transition-all duration-300">
            <button 
              onClick={(e) => { e.stopPropagation(); onDecrease && onDecrease(); }}
              className="p-1 rounded-md text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-semibold text-sm">{itemQuantity}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onIncrease && onIncrease(); }}
              className="p-1 rounded-md text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove && onRemove(); }}
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
