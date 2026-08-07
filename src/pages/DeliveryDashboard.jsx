import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  IndianRupee, 
  RefreshCw, 
  ShieldAlert,
  ArrowRight,
  Check,
  AlertTriangle
} from 'lucide-react';

const DeliveryDashboard = () => {
  const { 
    user, 
    deliveryOrders, 
    fetchDeliveryOrders, 
    updateDeliveryStatus, 
    setRoute 
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    await fetchDeliveryOrders();
    setLoading(false);
  };

  // Restrict access if non-delivery user somehow lands here
  if (user?.role !== 'Delivery') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">Access Restricted</h2>
          <p className="text-gray-500 text-sm mb-6">
            You must be logged in as a Delivery Personnel account to view this dashboard.
          </p>
          <button
            onClick={() => setRoute('dashboard')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            Back to Home Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    await updateDeliveryStatus(orderId, newStatus);
    setUpdatingId(null);
  };

  const handlePaymentCollect = async (orderId, currentStatus) => {
    setUpdatingId(orderId);
    await updateDeliveryStatus(orderId, currentStatus, true);
    setUpdatingId(null);
  };

  // Filter orders
  const filteredOrders = deliveryOrders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'ACTIVE') {
      return ['Assigned', 'Picked Up', 'Out for Delivery'].includes(order.deliveryStatus || 'Assigned');
    }
    if (statusFilter === 'DELIVERED') return order.deliveryStatus === 'Delivered';
    if (statusFilter === 'FAILED') return order.deliveryStatus === 'Failed Delivery';
    return true;
  });

  // Calculate statistics
  const totalAssigned = deliveryOrders.length;
  const activeCount = deliveryOrders.filter(o => ['Assigned', 'Picked Up', 'Out for Delivery'].includes(o.deliveryStatus || 'Assigned')).length;
  const deliveredCount = deliveryOrders.filter(o => o.deliveryStatus === 'Delivered').length;
  const codPendingTotal = deliveryOrders
    .filter(o => o.paymentStatus !== 'Paid' && !o.paymentCollected && o.deliveryStatus !== 'Failed Delivery')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Google Maps URLs
  const getGoogleMapsSearchUrl = (address, location) => {
    if (location?.lat && location?.lng) {
      return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    }
    const query = encodeURIComponent(address || 'Customer Location');
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getGoogleMapsNavUrl = (address, location) => {
    if (location?.lat && location?.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
    }
    const query = encodeURIComponent(address || 'Customer Location');
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 text-white pt-8 pb-16 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <Truck className="w-6 h-6 text-purple-300" />
              </div>
              <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                Delivery Portal
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Delivery Dashboard</h1>
            <p className="text-purple-200 text-sm mt-1">
              Welcome back, <span className="font-bold text-white">{user?.name || user?.username}</span>! Manage your assigned order deliveries in real time.
            </p>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Orders
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Orders</p>
              <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{totalAssigned}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Deliveries</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivered</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{deliveredCount}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">COD Collection Pending</p>
              <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">₹{codPendingTotal}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'ALL', label: 'All Assigned', count: totalAssigned },
            { id: 'ACTIVE', label: 'Active Deliveries', count: activeCount },
            { id: 'DELIVERED', label: 'Completed', count: deliveredCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${
                statusFilter === tab.id ? 'bg-purple-800 text-purple-100' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-gray-100 my-4">
            <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Assigned Orders</h3>
            <p className="text-gray-500 max-w-sm mx-auto text-sm">
              You currently have no orders matching this filter. Once an admin assigns orders to you, they will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((order) => {
              const customerName = order.deliveryPhone ? (order.user?.name || 'Customer') : (order.user?.name || order.user?.username || 'Customer');
              const customerPhone = order.deliveryPhone || order.user?.phone || '+91 9876543210';
              const deliveryAddress = order.deliveryAddress || order.user?.address || 'Standard Delivery Address, City';
              const isCOD = order.paymentStatus !== 'Paid' && !order.paymentCollected;
              const currentDeliveryStatus = order.deliveryStatus || 'Assigned';

              return (
                <div key={order._id} className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                  {/* Card Header */}
                  <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold bg-purple-100 text-purple-800 px-3 py-1 rounded-xl">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">ETA:</span>
                      <span className="text-xs font-extrabold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {order.estimatedDeliveryTime || '25-30 min'}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer & Address Details */}
                    <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Customer Details</h4>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{customerName}</h3>
                            <a 
                              href={`tel:${customerPhone}`}
                              className="text-purple-600 hover:text-purple-700 font-semibold text-xs flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3.5 h-3.5" /> {customerPhone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-1.5">Delivery Address</h4>
                        <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <MapPin className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 font-medium leading-relaxed">
                            {deliveryAddress}
                          </p>
                        </div>
                      </div>

                      {/* Google Maps Actions */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <a
                          href={getGoogleMapsSearchUrl(deliveryAddress, order.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                        >
                          <MapPin className="w-3.5 h-3.5 text-purple-600" />
                          Google Maps
                        </a>
                        <a
                          href={getGoogleMapsNavUrl(deliveryAddress, order.location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Start Nav
                        </a>
                      </div>
                    </div>

                    {/* Order Items & Payment Info */}
                    <div className="space-y-4 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-6">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Order Items</h4>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                              <span className="font-semibold text-gray-800">
                                {item.quantity}x {item.title}
                              </span>
                              <span className="font-bold text-gray-600">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-gray-500">Total Order Amount:</span>
                          <span className="text-lg font-extrabold text-gray-900">₹{order.totalAmount}</span>
                        </div>

                        {/* Payment Status Info */}
                        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-extrabold text-gray-400 uppercase">Payment Mode</p>
                            <p className="text-xs font-bold text-gray-800">
                              {order.paymentStatus === 'Paid' || order.paymentCollected ? 'Paid Online / Collected' : 'Cash on Delivery (COD)'}
                            </p>
                          </div>

                          {isCOD ? (
                            <div className="text-right">
                              <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100 inline-block">
                                Collect ₹{order.totalAmount}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Paid
                            </span>
                          )}
                        </div>

                        {/* Mark Payment Collected Button for COD */}
                        {isCOD && (
                          <button
                            onClick={() => handlePaymentCollect(order._id, currentDeliveryStatus)}
                            disabled={updatingId === order._id}
                            className="w-full mt-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                            Mark as Payment Collected
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Delivery Status Controls */}
                    <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Update Delivery Status</h4>
                        
                        {/* Status Buttons Workflow */}
                        <div className="space-y-2">
                          {[
                            { status: 'Assigned', color: 'bg-blue-50 text-blue-700 border-blue-200' },
                            { status: 'Picked Up', color: 'bg-purple-50 text-purple-700 border-purple-200' },
                            { status: 'Out for Delivery', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                            { status: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                            { status: 'Failed Delivery', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                          ].map((s) => {
                            const isCurrent = currentDeliveryStatus === s.status;
                            return (
                              <button
                                key={s.status}
                                onClick={() => handleStatusChange(order._id, s.status)}
                                disabled={updatingId === order._id}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between border ${
                                  isCurrent
                                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                                }`}
                              >
                                <span>{s.status}</span>
                                {isCurrent && <Check className="w-4 h-4 text-white" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Current Status Highlight Badge */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-400">Current Status:</span>
                          <span className="font-extrabold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                            {currentDeliveryStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
