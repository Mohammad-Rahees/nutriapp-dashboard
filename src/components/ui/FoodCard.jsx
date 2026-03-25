import React from 'react';
import { Heart, Clock, Flame, ShoppingCart, Plus, Minus } from 'lucide-react';
import useStore from '../../store/useStore';

const FoodCard = ({ id, title, image, calories, time, difficulty }) => {
  const { likedRecipes, toggleLike, addToCart, removeFromCart, cartItems, setSelectedRecipe } = useStore();
  const cartItem = cartItems.find(i => i.id === id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isLiked = likedRecipes.includes(id);

  const difficultyStyles = {
    Easy: 'bg-emerald-100 text-emerald-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-rose-100 text-rose-700',
  };

  const handleCardClick = () => {
    setSelectedRecipe({ id, title, image, calories, time, difficulty });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 group cursor-pointer flex flex-col h-full"
    >
      {/* Image container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Like Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            toggleLike(id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10 shadow-sm"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-gray-800 line-clamp-1 flex-1" title={title}>{title}</h3>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${difficultyStyles[difficulty] || difficultyStyles.Easy}`}>
            {difficulty}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between text-gray-500 text-sm pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-medium">{calories} kcal</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="font-medium hidden sm:inline">{time}</span>
            </div>
            
            {quantity > 0 ? (
              <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-1 border border-purple-100 shadow-sm transition-all duration-300">
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromCart(id); }}
                  className="p-1 rounded text-purple-600 hover:bg-white transition-colors hover:shadow-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-purple-700 w-4 text-center">{quantity}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart({ id, name: title, image, calories, time, difficulty }); }}
                  className="p-1 rounded text-purple-600 hover:bg-white transition-colors hover:shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart({ id, name: title, image, calories, time, difficulty });
                }}
                className="flex items-center gap-1.5 p-1.5 px-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-semibold"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="text-xs">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
