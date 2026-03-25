import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CartItem from '../components/order/CartItem';
import OrderSummary from '../components/order/OrderSummary';
import DeliveryTracker from '../components/order/DeliveryTracker';
import CourierInfo from '../components/order/CourierInfo';
import useStore from '../store/useStore';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

const Order = () => {
  const { cartItems, updateQuantity, clearCart } = useStore();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handlePlaceOrder = () => {
    if (cartItems.length > 0) {
      setIsOrderPlaced(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  return (
    <PageLayout>
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Order Details</h1>
          <p className="text-gray-500 text-sm mt-1">Review your cart and track your delivery.</p>
        </div>
        {isOrderPlaced && (
          <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm w-fit shadow-sm hover:shadow-md transition-all duration-300">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
            In Transit
          </div>
        )}
      </div>

      {isOrderPlaced && (
        <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-900">Order Placed Successfully!</h2>
            <p className="text-sm text-green-700 mt-1">Your delicious food is being prepared. You can track its progress below.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            Your Items
          </h2>
          
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onUpdateQuantity={updateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200 hover:scale-[1.01] transition-all duration-300">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Your cart is completely empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some items from the dashboard to get started.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <OrderSummary 
            items={cartItems} 
            onPlaceOrder={handlePlaceOrder} 
            onClearCart={handleClearCart} 
            cartHasItems={cartItems.length > 0 && !isOrderPlaced} 
          />
          {isOrderPlaced && (
            <>
              <DeliveryTracker />
              <CourierInfo />
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Order;
