import React from 'react';

const OrderSummary = ({ items, onPlaceOrder, onClearCart, cartHasItems }) => {
  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 5.99 : 0;
  const serviceFee = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee + serviceFee;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Delivery Fee</span>
          <span className="font-medium">${deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm">
          <span>Service Fee</span>
          <span className="font-medium">${serviceFee.toFixed(2)}</span>
        </div>
        <div className="pt-3 border-t border-gray-100 flex justify-between">
          <span className="font-bold text-gray-800">Total</span>
          <span className="font-bold text-xl text-purple-600">${total.toFixed(2)}</span>
        </div>
      </div>

      {cartHasItems && (
        <div className="mt-6 space-y-3">
          <button 
            onClick={onPlaceOrder}
            className="w-full bg-purple-600 hover:bg-opacity-80 text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            Place Order
          </button>
          <button 
            onClick={onClearCart}
            className="w-full bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-rose-300 hover:scale-[1.02]"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
