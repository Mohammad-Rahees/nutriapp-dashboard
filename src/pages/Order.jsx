import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CartItem from '../components/order/CartItem';
import OrderSummary from '../components/order/OrderSummary';
import useStore from '../store/useStore';
import { ShoppingBag, CheckCircle2, Clock, PackageCheck, Truck, Calendar, ShieldCheck, RefreshCw, CreditCard } from 'lucide-react';

const Order = () => {
  const { 
    user, setRoute, cartItems, removeFromCart, addToCart, clearCart, 
    startRazorpayCheckout, retryRazorpayCheckout, customerOrders, fetchCustomerOrders 
  } = useStore();
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [profileAlert, setProfileAlert] = useState(false);

  useEffect(() => {
    fetchCustomerOrders();
  }, [fetchCustomerOrders]);

  const handlePlaceOrder = async () => {
    // Check if customer delivery profile is completed
    const hasAddress = user?.address && user.address.trim().length > 0;
    const hasPhone = user?.phone && user.phone.trim().length > 0;

    if (!user?.profileCompleted && (!hasAddress || !hasPhone)) {
      setProfileAlert(true);
      return;
    }

    if (cartItems.length > 0) {
      await startRazorpayCheckout();
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  return (
    <PageLayout>
      {/* Profile Completion Warning Banner */}
      {(!user?.profileCompleted || profileAlert) && (
        <div className="mb-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-300/80 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
              !
            </div>
            <div>
              <h3 className="font-extrabold text-amber-900 text-base">Complete Delivery Address Required</h3>
              <p className="text-xs text-amber-800 font-medium mt-0.5">
                Please complete your delivery address and phone number before placing an order.
              </p>
            </div>
          </div>
          <button
            onClick={() => setRoute('profile')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md self-start sm:self-auto flex items-center gap-1.5"
          >
            Complete Address Profile ➔
          </button>
        </div>
      )}

      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Order Details & Cart</h1>
          <p className="text-gray-500 text-sm mt-1">Review your cart, proceed to checkout, and track your active orders.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-500" />
            Your Shopping Cart
          </h2>
          
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onIncrease={() => addToCart(item)}
                  onDecrease={() => removeFromCart(item.id)}
                  onRemove={() => removeFromCart(item.id, true)}
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

        {/* Right Column: Summary & Checkout */}
        <div className="space-y-6">
          <OrderSummary 
            items={cartItems} 
            onPlaceOrder={handlePlaceOrder} 
            onClearCart={handleClearCart} 
            cartHasItems={cartItems.length > 0} 
          />
        </div>
      </div>

      {/* Customer Orders History & Live Tracking Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-purple-600" />
              My Orders & Live Tracking
            </h2>
            <p className="text-gray-500 text-xs mt-1">Track live status updates on your past purchases updated by the kitchen and delivery team.</p>
          </div>
          <button
            onClick={() => fetchCustomerOrders()}
            className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Order Status
          </button>
        </div>

        {customerOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm font-medium">
            You haven't placed any orders yet. Completing a checkout will display your live order tracking here.
          </div>
        ) : (
          <div className="space-y-4">
            {customerOrders.map((order) => {
              const orderId = order._id ? String(order._id) : order.razorpayOrderId || 'ORD-UNKNOWN';
              const dateStr = new Date(order.createdAt || Date.now()).toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              // Status Badge Color Mapping
              const statusColors = {
                Pending: 'bg-amber-100 text-amber-800 border-amber-200',
                Preparing: 'bg-blue-100 text-blue-800 border-blue-200',
                Shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                'In Transit': 'bg-purple-100 text-purple-800 border-purple-200',
                Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                Cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
              };

              return (
                <div key={order._id} className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100 space-y-4">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200/60 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">Order #{orderId.slice(-8)}</span>
                        <span className={`text-xs font-black px-3 py-0.5 rounded-full border ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                          ● {order.status || 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" /> Placed on {dateStr}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-gray-500">Payment:</span>
                      {order.paymentStatus === 'Pending' ? (
                        <button
                          onClick={() => retryRazorpayCheckout(order)}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 hover:scale-105"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          Complete Payment
                        </button>
                      ) : (
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Paid
                        </span>
                      )}
                      <span className="text-lg font-black text-purple-700 ml-2">₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Purchased Items List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {order.orderItems && order.orderItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop'}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-800 truncate">{item.title}</p>
                          <p className="text-2xs text-gray-400 font-medium">Qty: {item.quantity} × ₹{Number(item.price || 0).toFixed(2)}</p>
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Order;
