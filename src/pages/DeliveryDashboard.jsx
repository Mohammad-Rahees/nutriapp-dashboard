import React, { useEffect, useState, useMemo } from 'react';
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
  Search,
  Filter,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  ListOrdered,
  History,
  FileText
} from 'lucide-react';
import DeliveryTimeline from '../components/delivery/DeliveryTimeline';
import DeliveryDetailModal from '../components/delivery/DeliveryDetailModal';

const DeliveryDashboard = () => {
  const { 
    user, 
    deliveryOrders, 
    fetchDeliveryOrders,
    deliveryStats,
    fetchDeliveryStats,
    deliveryHistory,
    historyPagination,
    fetchDeliveryHistory,
    deliveryLogs,
    myLogsPagination,
    fetchDeliveryLogs,
    updateDeliveryStatus, 
    setRoute 
  } = useStore();

  // Active Tab: 'active' | 'history' | 'logs'
  const [activeTab, setActiveTab] = useState('active');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  // Modal & Detail State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    // Refresh data when tab or filters change
    if (activeTab === 'history') {
      fetchDeliveryHistory({
        search: searchQuery,
        status: statusFilter,
        paymentStatus: paymentFilter,
        dateRange: dateRangeFilter,
        page,
        limit: 10,
      });
    } else if (activeTab === 'logs') {
      fetchDeliveryLogs({
        search: searchQuery,
        status: statusFilter,
        dateRange: dateRangeFilter,
        page,
        limit: 10,
      });
    }
  }, [activeTab, searchQuery, statusFilter, paymentFilter, dateRangeFilter, page]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchDeliveryOrders(),
      fetchDeliveryStats(),
      fetchDeliveryHistory({ page: 1, limit: 10 }),
      fetchDeliveryLogs({ page: 1, limit: 10 }),
    ]);
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
    await Promise.all([
      fetchDeliveryOrders(),
      fetchDeliveryStats(),
      fetchDeliveryLogs({ page: 1, limit: 10 }),
    ]);
    setUpdatingId(null);
  };

  const handlePaymentCollect = async (orderId, currentStatus) => {
    setUpdatingId(orderId);
    await updateDeliveryStatus(orderId, currentStatus, true);
    await Promise.all([
      fetchDeliveryOrders(),
      fetchDeliveryStats(),
      fetchDeliveryLogs({ page: 1, limit: 10 }),
    ]);
    setUpdatingId(null);
  };

  const handleOpenOrderDetails = (order) => {
    setSelectedOrder(order);
    setSelectedLog(null);
    setIsModalOpen(true);
  };

  const handleOpenLogDetails = (log) => {
    setSelectedLog(log);
    setSelectedOrder(log.order);
    setIsModalOpen(true);
  };

  // Active Orders filtered in real time
  const filteredActiveOrders = useMemo(() => {
    return deliveryOrders.filter((order) => {
      const isCompleted = ['Delivered', 'Failed Delivery'].includes(order.deliveryStatus);
      if (isCompleted) return false;

      const custName = (order.user?.name || order.user?.username || 'Customer').toLowerCase();
      const custPhone = (order.deliveryPhone || order.user?.phone || '').toLowerCase();
      const orderIdStr = String(order._id || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || custName.includes(q) || custPhone.includes(q) || orderIdStr.includes(q);
      const matchesStatus = statusFilter === 'ALL' || order.deliveryStatus === statusFilter;
      
      let matchesPayment = true;
      if (paymentFilter === 'Paid Online') {
        matchesPayment = order.paymentStatus === 'Paid' && !order.paymentCollected;
      } else if (paymentFilter === 'Cash On Delivery') {
        matchesPayment = order.paymentStatus !== 'Paid' && !order.paymentCollected;
      } else if (paymentFilter === 'Payment Collected') {
        matchesPayment = Boolean(order.paymentCollected);
      }

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [deliveryOrders, searchQuery, statusFilter, paymentFilter]);

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

  const activePagination = activeTab === 'history' ? historyPagination : myLogsPagination;

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
              Welcome back, <span className="font-bold text-white">{user?.name || user?.username}</span>! Here is your daily order activity and delivery overview.
            </p>
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 backdrop-blur-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-8">
        {/* Requirement 1: Summary Statistics Cards (Loaded dynamically from MongoDB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Today's Orders</p>
              <h3 className="text-3xl font-extrabold text-purple-900 mt-1">
                {deliveryStats?.todayOrders ?? 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Deliveries</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">
                {deliveryStats?.activeDeliveries ?? 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Truck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivered Today</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">
                {deliveryStats?.deliveredToday ?? 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Failed Today</p>
              <h3 className="text-3xl font-extrabold text-rose-600 mt-1">
                {deliveryStats?.failedToday ?? 0}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('active'); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Truck className="w-4 h-4" /> Active Deliveries
            </button>

            <button
              onClick={() => { setActiveTab('history'); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <History className="w-4 h-4" /> Delivery History
            </button>

            <button
              onClick={() => { setActiveTab('logs'); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'logs'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListOrdered className="w-4 h-4" /> Daily Order Log
            </button>
          </div>
        </div>

        {/* Requirement 3 & 4: Search & Multi-Filters Toolbar */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Customer, Phone, Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Delivery Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Delivery Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Failed Delivery">Failed Delivery</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Payment Modes</option>
              <option value="Paid Online">Paid Online</option>
              <option value="Cash On Delivery">Cash On Delivery (COD)</option>
              <option value="Payment Collected">Payment Collected</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <select
              value={dateRangeFilter}
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Time</option>
              <option value="today">Today</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* TAB CONTENT 1: Active Deliveries */}
        {activeTab === 'active' && (
          <div>
            {filteredActiveOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-gray-100 my-4">
                <div className="w-20 h-20 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Deliveries</h3>
                <p className="text-gray-500 max-w-sm mx-auto text-sm">
                  You have no active assigned deliveries matching your search filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredActiveOrders.map((order) => {
                  const customerName = order.deliveryPhone ? (order.user?.name || 'Customer') : (order.user?.name || order.user?.username || 'Customer');
                  const customerPhone = order.deliveryPhone || order.user?.phone || '+91 9876543210';
                  const deliveryAddress = order.deliveryAddress || order.user?.address || 'Standard Delivery Address';
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

                        {/* Quick Action: View Order */}
                        <button
                          onClick={() => handleOpenOrderDetails(order)}
                          className="self-start sm:self-auto text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl border border-purple-200 flex items-center gap-1.5 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Order
                        </button>
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
                                {/* Requirement 14: Quick Action Call Customer */}
                                <a 
                                  href={`tel:${customerPhone}`}
                                  className="text-purple-600 hover:text-purple-700 font-semibold text-xs flex items-center gap-1 mt-0.5"
                                >
                                  <Phone className="w-3.5 h-3.5" /> Call Customer ({customerPhone})
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

                          {/* Requirement 14: Quick Action Open Maps */}
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <a
                              href={getGoogleMapsSearchUrl(deliveryAddress, order.location)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 px-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <MapPin className="w-3.5 h-3.5 text-purple-600" />
                              Open Maps
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
                                    {item.quantity}x {item.title || item.name}
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

                        {/* Requirement 14: Quick Action Update Status & Requirement 6 Timeline */}
                        <div className="space-y-4 lg:col-span-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Update Status</h4>
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

                          {/* Requirement 6: Timeline View */}
                          <div className="pt-3 border-t border-gray-100">
                            <h5 className="text-[10px] font-extrabold text-gray-400 uppercase mb-1">Timeline</h5>
                            <DeliveryTimeline order={order} compact={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT 2: Delivery History Page (Requirement 2, 14, 15) */}
        {activeTab === 'history' && (
          <div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-extrabold text-gray-800 text-lg">Completed Delivery History</h3>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-3 py-1 rounded-xl">
                  {historyPagination?.total || deliveryHistory.length} Delivered / Failed Orders
                </span>
              </div>

              {deliveryHistory.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm italic">No completed delivery history records found matching criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-400 font-extrabold uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="py-3.5 px-4">Order ID</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Delivery Address</th>
                        <th className="py-3.5 px-4">Total Amount</th>
                        <th className="py-3.5 px-4">Payment Method</th>
                        <th className="py-3.5 px-4">Delivery Status</th>
                        <th className="py-3.5 px-4">Delivered Date & Time</th>
                        <th className="py-3.5 px-4 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                      {deliveryHistory.map((order) => {
                        const custName = order.user?.name || order.user?.username || 'Customer';
                        const custPhone = order.deliveryPhone || order.user?.phone || '';
                        const deliveredTs = order.deliveredAt || order.failedAt || order.updatedAt;

                        return (
                          <tr key={order._id} className="hover:bg-gray-50/80 transition-all">
                            <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                              #{String(order._id).substring(String(order._id).length - 8).toUpperCase()}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-gray-900">{custName}</p>
                              <p className="text-[11px] text-gray-400">{custPhone}</p>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate" title={order.deliveryAddress}>
                              {order.deliveryAddress || 'Standard Address'}
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-gray-900">
                              ₹{order.totalAmount}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                order.paymentStatus === 'Paid' || order.paymentCollected
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {order.paymentStatus === 'Paid' || order.paymentCollected ? 'Paid' : 'COD'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                order.deliveryStatus === 'Delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {order.deliveryStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500">
                              {deliveredTs ? new Date(deliveredTs).toLocaleString() : 'N/A'}
                            </td>
                            {/* Requirement 14: Completed Orders: View Details Only */}
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => handleOpenOrderDetails(order)}
                                className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-200 transition-all inline-flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Details
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Requirement 15: Pagination Controls */}
              {historyPagination?.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">
                    Page {historyPagination.page} of {historyPagination.totalPages} ({historyPagination.total} records)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold disabled:opacity-50 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      disabled={page >= historyPagination.totalPages}
                      onClick={() => setPage((p) => Math.min(p + 1, historyPagination.totalPages))}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold disabled:opacity-50 flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB CONTENT 3: Daily Order Activity Log (Requirement 7, 8, 9, 10, 15) */}
        {activeTab === 'logs' && (
          <div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-800 text-lg">Daily Order Activity Log</h3>
                  <p className="text-xs text-gray-400">Complete audit trail generated automatically for all delivery actions.</p>
                </div>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-xl">
                  {myLogsPagination?.total || deliveryLogs.length} Audit Entries
                </span>
              </div>

              {deliveryLogs.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-gray-400 text-sm italic">No daily order activity log entries found.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {deliveryLogs.map((log) => {
                    const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                    const dateStr = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                    const orderIdShort = log.order?._id
                      ? String(log.order._id).substring(String(log.order._id).length - 8).toUpperCase()
                      : 'ORD-N/A';

                    return (
                      <div 
                        key={log._id} 
                        onClick={() => handleOpenLogDetails(log)}
                        className="p-4 hover:bg-purple-50/50 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                            {timeStr}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-extrabold text-xs text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                #{orderIdShort}
                              </span>
                              <h4 className="font-bold text-gray-900 text-sm">{log.action}</h4>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Customer: <span className="font-semibold text-gray-700">{log.customerName}</span> ({log.customerPhone || 'N/A'})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-[11px] font-mono text-gray-400">{dateStr}</span>
                          <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                            {log.status}
                          </span>
                          <button className="text-xs font-bold text-purple-600 bg-white border border-purple-200 hover:bg-purple-50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Requirement 15: Pagination Controls for Logs */}
              {myLogsPagination?.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">
                    Page {myLogsPagination.page} of {myLogsPagination.totalPages} ({myLogsPagination.total} logs)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold disabled:opacity-50 flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <button
                      disabled={page >= myLogsPagination.totalPages}
                      onClick={() => setPage((p) => Math.min(p + 1, myLogsPagination.totalPages))}
                      className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold disabled:opacity-50 flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delivery Detail Modal */}
      <DeliveryDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
        log={selectedLog}
      />
    </div>
  );
};

export default DeliveryDashboard;
