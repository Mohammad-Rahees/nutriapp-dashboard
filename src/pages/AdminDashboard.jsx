import React, { useState, useMemo, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SectionHeader from '../components/ui/SectionHeader';
import FoodCard from '../components/ui/FoodCard';
import useStore from '../store/useStore';
import { 
  PlusCircle, Upload, CheckCircle2, AlertCircle, ShieldAlert, Utensils,
  ShoppingBag, Clock, PackageCheck, Truck, DollarSign, Search, Filter, ArrowUpDown,
  CreditCard, User, Mail, Calendar, Edit3, Trash2, X, Eye, ListOrdered, ChevronLeft, ChevronRight
} from 'lucide-react';
import DeliveryDetailModal from '../components/delivery/DeliveryDetailModal';

const AdminDashboard = () => {
  const { 
    user, meals, categories, addMeal, updateMeal, deleteMeal, 
    adminOrders, fetchAdminOrders, updateOrderStatus, setRoute,
    deliveryUsers, fetchDeliveryUsers, assignDeliveryPerson,
    createDeliveryUser, updateUserById, deleteUserAccount,
    adminLogs, adminLogsPagination, fetchAdminDeliveryLogs
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'delivery' | 'meals' | 'logs'
  const [mealSubTab, setMealSubTab] = useState('manage'); // 'manage' | 'add'

  // Edit Meal Modal State
  const [editingMeal, setEditingMeal] = useState(null);

  // Delivery Personnel Modal & Form State
  const [isAddDeliveryModalOpen, setIsAddDeliveryModalOpen] = useState(false);
  const [editingDeliveryUser, setEditingDeliveryUser] = useState(null);

  const [delName, setDelName] = useState('');
  const [delUsername, setDelUsername] = useState('');
  const [delEmail, setDelEmail] = useState('');
  const [delPhone, setDelPhone] = useState('');
  const [delPassword, setDelPassword] = useState('');
  const [delConfirmPassword, setDelConfirmPassword] = useState('');
  const [delGender, setDelGender] = useState('Prefer not to say');
  const [delVehicleType, setDelVehicleType] = useState('Bike');
  const [delVehicleNumber, setDelVehicleNumber] = useState('');
  const [delEmergencyContact, setDelEmergencyContact] = useState('');

  // Admin Delivery Activity Logs State
  const [logDeliveryPersonFilter, setLogDeliveryPersonFilter] = useState('ALL');
  const [logDateRangeFilter, setLogDateRangeFilter] = useState('ALL');
  const [logStartDate, setLogStartDate] = useState('');
  const [logEndDate, setLogEndDate] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('ALL');
  const [logPage, setLogPage] = useState(1);
  const [selectedLogForModal, setSelectedLogForModal] = useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Fetch admin orders & delivery users on mount
  useEffect(() => {
    fetchAdminOrders();
    fetchDeliveryUsers();
  }, [fetchAdminOrders, fetchDeliveryUsers]);

  // Fetch admin delivery logs when filters or logs tab active
  useEffect(() => {
    if (activeTab === 'logs') {
      fetchAdminDeliveryLogs({
        deliveryPerson: logDeliveryPersonFilter,
        search: logSearch,
        status: logStatusFilter,
        dateRange: logDateRangeFilter,
        startDate: logStartDate,
        endDate: logEndDate,
        page: logPage,
        limit: 10,
      });
    }
  }, [activeTab, logDeliveryPersonFilter, logSearch, logStatusFilter, logDateRangeFilter, logStartDate, logEndDate, logPage]);

  // Form State (Add New Meal)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [calories, setCalories] = useState('');
  const [price, setPrice] = useState('9.99');
  const [category, setCategory] = useState('');
  const [time, setTime] = useState('15 min');
  const [difficulty, setDifficulty] = useState('Easy');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop');

  const [notification, setNotification] = useState(null);

  // Delivery Personnel Handlers
  const handleAddDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!delName.trim() || !delUsername.trim() || !delEmail.trim() || !delPassword.trim()) {
      setNotification({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }
    if (delPassword !== delConfirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    const payload = {
      name: delName.trim(),
      username: delUsername.trim().toLowerCase().replace(/\s+/g, '_'),
      email: delEmail.trim().toLowerCase(),
      phone: delPhone.trim(),
      password: delPassword.trim(),
      gender: delGender,
      vehicleType: delVehicleType,
      vehicleNumber: delVehicleNumber.trim(),
      emergencyContact: delEmergencyContact.trim(),
    };

    const res = await createDeliveryUser(payload);
    if (res.success) {
      setNotification({ type: 'success', message: `✅ Created Delivery Personnel: ${payload.name}` });
      setIsAddDeliveryModalOpen(false);
      setDelName(''); setDelUsername(''); setDelEmail(''); setDelPhone('');
      setDelPassword(''); setDelConfirmPassword(''); setDelVehicleNumber(''); setDelEmergencyContact('');
    } else {
      setNotification({ type: 'error', message: res.message || 'Failed to create delivery user.' });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleEditDeliverySubmit = async (e) => {
    e.preventDefault();
    if (!editingDeliveryUser) return;

    const res = await updateUserById(editingDeliveryUser._id, editingDeliveryUser);
    if (res.success) {
      setNotification({ type: 'success', message: `✅ Updated Delivery Personnel: ${editingDeliveryUser.name}` });
      setEditingDeliveryUser(null);
    } else {
      setNotification({ type: 'error', message: res.message || 'Failed to update delivery user.' });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleUserActive = async (u) => {
    const newStatus = u.isActive === false ? true : false;
    const res = await updateUserById(u._id, { isActive: newStatus });
    if (res.success) {
      setNotification({
        type: 'success',
        message: `User ${u.name} status set to ${newStatus ? 'Active' : 'Inactive'}.`,
      });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteDeliveryUser = async (u) => {
    if (window.confirm(`Are you sure you want to delete delivery personnel ${u.name}?`)) {
      const res = await deleteUserAccount(u._id);
      if (res.success) {
        setNotification({ type: 'success', message: `Deleted user ${u.name}.` });
      } else {
        setNotification({ type: 'error', message: 'Failed to delete user.' });
      }
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Orders Filter & Search State
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');

  // Meals Search & Category Filter State
  const [mealSearch, setMealSearch] = useState('');
  const [mealCategoryFilter, setMealCategoryFilter] = useState('All');

  // Load existing categories dynamically from store & meals
  const existingCategories = useMemo(() => {
    const fromCategories = categories.map((c) => c.name);
    const fromMeals = meals.map((m) => m.category);
    const cats = Array.from(new Set([...fromCategories, ...fromMeals].filter(Boolean)));
    return cats.length > 0 ? cats : ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Vegan', 'Dessert'];
  }, [categories, meals]);

  // Compute Summary Statistics
  const stats = useMemo(() => {
    const totalOrders = adminOrders.length;
    const pending = adminOrders.filter((o) => o.status === 'Pending').length;
    const preparing = adminOrders.filter((o) => o.status === 'Preparing').length;
    const shipped = adminOrders.filter((o) => o.status === 'Shipped').length;
    const inTransit = adminOrders.filter((o) => o.status === 'In Transit').length;
    const delivered = adminOrders.filter((o) => o.status === 'Delivered').length;
    
    // Revenue sum of Paid orders
    const totalRevenue = adminOrders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return { totalOrders, pending, preparing, shipped, inTransit, delivered, totalRevenue };
  }, [adminOrders]);

  // Filter & Sort Orders List
  const filteredOrders = useMemo(() => {
    return adminOrders
      .filter((o) => {
        const custName = o.user?.name || o.user?.username || 'Guest Customer';
        const custEmail = o.user?.email || '';
        const orderId = String(o._id || o.razorpayOrderId || '');
        const q = orderSearch.toLowerCase().trim();

        const matchesSearch = !q || custName.toLowerCase().includes(q) || custEmail.toLowerCase().includes(q) || orderId.toLowerCase().includes(q);
        const matchesPayment = paymentFilter === 'All' || o.paymentStatus === paymentFilter;
        const matchesStatus = statusFilter === 'All' || o.status === statusFilter;

        return matchesSearch && matchesPayment && matchesStatus;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [adminOrders, orderSearch, paymentFilter, statusFilter, sortOrder]);

  // Filter Meals List
  const filteredMeals = useMemo(() => {
    return meals.filter((m) => {
      const q = mealSearch.toLowerCase().trim();
      const name = (m.title || m.name || '').toLowerCase();
      const desc = (m.description || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || desc.includes(q);
      const matchesCategory = mealCategoryFilter === 'All' || m.category === mealCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [meals, mealSearch, mealCategoryFilter]);

  // Handle Order Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setNotification({
        type: 'success',
        message: `Order status updated to "${newStatus}"!`,
      });
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({
        type: 'error',
        message: 'Failed to update order status in database.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Handle Meal Delete Action
  const handleDeleteMealClick = async (meal) => {
    const mealId = meal.id || meal._id;
    const mealName = meal.title || meal.name;
    if (window.confirm(`Are you sure you want to delete "${mealName}" from the database?`)) {
      const res = await deleteMeal(mealId);
      if (res.success) {
        setNotification({
          type: 'success',
          message: `Meal "${mealName}" successfully removed from database!`,
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        setNotification({
          type: 'error',
          message: `Failed to delete meal "${mealName}".`,
        });
        setTimeout(() => setNotification(null), 4000);
      }
    }
  };

  // Handle Open Edit Modal
  const handleStartEditMeal = (meal) => {
    setEditingMeal({
      id: meal.id || meal._id,
      title: meal.title || meal.name || '',
      description: meal.description || '',
      category: meal.category || '',
      price: meal.price !== undefined ? meal.price : '9.99',
      calories: meal.calories !== undefined ? meal.calories : 350,
      time: meal.time || '15 min',
      difficulty: meal.difficulty || 'Easy',
      image: meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
    });
  };

  // Handle Save Edit Meal
  const handleSaveEditMealSubmit = async (e) => {
    e.preventDefault();
    if (!editingMeal || !editingMeal.title || !editingMeal.calories) return;

    const res = await updateMeal(editingMeal.id, {
      title: editingMeal.title.trim(),
      name: editingMeal.title.trim(),
      description: editingMeal.description.trim(),
      category: editingMeal.category,
      price: Number(editingMeal.price) || 9.99,
      calories: Number(editingMeal.calories) || 0,
      time: editingMeal.time,
      difficulty: editingMeal.difficulty,
      image: editingMeal.image,
    });

    if (res.success) {
      setNotification({
        type: 'success',
        message: `Meal "${editingMeal.title}" updated successfully!`,
      });
      setEditingMeal(null);
      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({
        type: 'error',
        message: `Failed to update meal "${editingMeal.title}".`,
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Handle Image File Upload (Add Meal)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Image File Upload (Edit Meal)
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && editingMeal) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingMeal((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Submit Add Meal
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !calories || !category) {
      setNotification({ type: 'error', message: 'Please fill out all required fields (Meal Name, Calories, Category).' });
      return;
    }

    const res = await addMeal({
      title: title.trim(),
      description: description.trim(),
      calories: Number(calories),
      price: Number(price) || 9.99,
      category,
      time,
      difficulty,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      image: imagePreview,
    });

    if (res && res.success) {
      setNotification({ type: 'success', message: `Meal "${title}" saved successfully to database!` });

      // Reset Form
      setTitle('');
      setDescription('');
      setCalories('');
      setPrice('9.99');
      setCategory('');
      setProtein('');
      setCarbs('');
      setFat('');
      setImagePreview('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop');

      setTimeout(() => setNotification(null), 4000);
    } else {
      setNotification({ type: 'error', message: `Failed to save meal "${title}" to database. ${res?.error || ''}` });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Restrict Admin view if non-admin user somehow loaded this route
  if (user?.role !== 'Admin') {
    return (
      <PageLayout>
        <div className="py-20 text-center bg-white rounded-3xl p-8 border border-rose-100 shadow-sm max-w-md mx-auto">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6">You must be logged in as an Admin user to view this panel.</p>
          <button
            onClick={() => setRoute('dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 transition-all"
          >
            Back to Customer Dashboard
          </button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Header & Main Tab Switcher */}
      <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-100 text-purple-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Admin Portal
            </span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Admin Control Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer orders, edit or delete meals, and publish new food items.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders ({stats.totalOrders})
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'delivery'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Truck className="w-4 h-4" />
            Delivery Personnel ({deliveryUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'meals'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Meals Catalog ({meals.length})
          </button>
          <button
            onClick={() => { setActiveTab('logs'); setLogPage(1); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            Delivery Activity Logs
          </button>
        </div>
      </div>

      {/* Toast Notification Alert */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 shadow-md animate-in fade-in slide-in-from-top-3 ${
            notification.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-900' : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="font-semibold text-sm">{notification.message}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: ORDER MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</span>
              <p className="text-2xl font-black text-gray-800 mt-2">{stats.totalOrders}</p>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</span>
              <p className="text-2xl font-black text-amber-800 mt-2">{stats.pending}</p>
            </div>

            <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Preparing</span>
              <p className="text-2xl font-black text-blue-800 mt-2">{stats.preparing}</p>
            </div>

            <div className="bg-indigo-50/80 rounded-2xl p-4 border border-indigo-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Shipped</span>
              <p className="text-2xl font-black text-indigo-800 mt-2">{stats.shipped}</p>
            </div>

            <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">In Transit</span>
              <p className="text-2xl font-black text-purple-800 mt-2">{stats.inTransit}</p>
            </div>

            <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-100 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Delivered</span>
              <p className="text-2xl font-black text-emerald-800 mt-2">{stats.delivered}</p>
            </div>

            <div className="bg-purple-900 text-white rounded-2xl p-4 col-span-2 sm:col-span-4 lg:col-span-1 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-purple-300" /> Revenue
              </span>
              <p className="text-xl font-black text-white mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          {/* Search, Filter & Sort Controls */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search Customer Name or Order ID..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl pl-10 pr-4 py-3 outline-none focus:border-purple-400 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-500">Payment:</span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="All">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
                <span className="font-semibold text-gray-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 shadow-sm">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-800 font-bold text-lg">No Orders Found</h3>
              <p className="text-gray-400 text-xs mt-1">No customer orders match your current filter or search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const customerName = order.user?.name || order.user?.username || 'Guest Customer';
                const customerEmail = order.user?.email || 'N/A';
                const orderId = order._id ? String(order._id) : order.razorpayOrderId || 'ORD-UNKNOWN';
                const formattedDate = new Date(order.createdAt || Date.now()).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                });

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                          {customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{customerName}</h3>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono">
                              @{order.user?.username || 'guest'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-400" /> {customerEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-gray-400" /> {formattedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400 font-semibold">Payment:</span>
                          <span
                            className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                              order.paymentStatus === 'Paid'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : order.paymentStatus === 'Failed'
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {order.paymentStatus || 'Pending'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400 font-semibold">Order Status:</span>
                          <select
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-purple-50 border border-purple-200 text-purple-900 font-bold text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-purple-200 transition-all"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400 font-semibold">Assign Delivery:</span>
                          <select
                            value={order.deliveryPerson?._id || order.deliveryPerson || ''}
                            onChange={(e) => assignDeliveryPerson(order._id, e.target.value || null)}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs rounded-xl px-3 py-1.5 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-200 transition-all"
                          >
                            <option value="">Unassigned</option>
                            {deliveryUsers && deliveryUsers.map((u) => (
                              <option key={u._id} value={u._id}>
                                🚚 {u.name || u.username} ({u.phone || 'No phone'})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
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
                          <span className="text-xs font-extrabold text-gray-800">
                            ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1">
                      <div className="flex items-center gap-4 text-gray-500 font-medium">
                        <span>Order ID: <strong className="font-mono text-gray-700">{orderId}</strong></span>
                        <span>Method: <strong className="text-gray-700">Razorpay Online</strong></span>
                        {order.razorpayPaymentId && (
                          <span className="hidden md:inline">Pay ID: <strong className="font-mono text-gray-700">{order.razorpayPaymentId}</strong></span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-semibold">Total Amount:</span>
                        <span className="text-lg font-black text-purple-700">₹{Number(order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: DELIVERY PERSONNEL MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                Delivery Personnel Accounts
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Create, edit, toggle active status, and assign orders to delivery personnel.
              </p>
            </div>
            <button
              onClick={() => setIsAddDeliveryModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" /> Add Delivery Personnel
            </button>
          </div>

          {/* Delivery Personnel Cards Grid */}
          {deliveryUsers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <Truck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-lg mb-1">No Delivery Personnel Registered</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                Click "Add Delivery Personnel" above to create your first delivery account.
              </p>
              <button
                onClick={() => setIsAddDeliveryModalOpen(true)}
                className="bg-purple-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                + Create Delivery Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deliveryUsers.map((u) => {
                const assignedOrdersCount = adminOrders.filter(
                  (o) => (o.deliveryPerson?._id || o.deliveryPerson) === u._id
                ).length;
                const isUserActive = u.isActive !== false;

                return (
                  <div
                    key={u._id}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.username)}&background=f3e8ff&color=9333ea&bold=true`}
                            alt={u.name}
                            className="w-12 h-12 rounded-2xl border border-purple-100 object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-gray-900 text-base">{u.name}</h3>
                            <p className="text-xs text-purple-600 font-mono font-bold">@{u.username}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            isUserActive
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-100 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {isUserActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-2 bg-gray-50 p-4 rounded-2xl text-xs border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-semibold">Email:</span>
                          <span className="font-bold text-gray-800 truncate max-w-[170px]">{u.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-semibold">Phone:</span>
                          <span className="font-bold text-gray-800">{u.phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-semibold">Vehicle:</span>
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {u.vehicleType || 'Bike'} {u.vehicleNumber ? `(${u.vehicleNumber})` : ''}
                          </span>
                        </div>
                        {u.emergencyContact && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 font-semibold">Emergency:</span>
                            <span className="font-bold text-gray-700">{u.emergencyContact}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                          <span className="text-gray-400 font-semibold">Assigned Orders:</span>
                          <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full text-xs">
                            {assignedOrdersCount} Orders
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleToggleUserActive(u)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isUserActive
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {isUserActive ? 'Deactivate' : 'Activate'}
                      </button>

                      <button
                        onClick={() => setEditingDeliveryUser({ ...u })}
                        className="p-2 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 text-gray-600 rounded-xl transition-all border border-gray-200"
                        title="Edit Personnel Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteDeliveryUser(u)}
                        className="p-2 bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-600 rounded-xl transition-all border border-gray-200"
                        title="Delete Personnel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MEAL MANAGEMENT (MANAGE CATALOG & ADD NEW MEAL) */}
      {/* ========================================================= */}
      {activeTab === 'meals' && (
        <div className="space-y-8">
          {/* Sub Tab Switcher: Manage Meals vs Add New Meal */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMealSubTab('manage')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  mealSubTab === 'manage'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:text-purple-600'
                }`}
              >
                <Utensils className="w-4 h-4" />
                Manage Catalog Meals ({meals.length})
              </button>
              <button
                onClick={() => setMealSubTab('add')}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  mealSubTab === 'add'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:text-purple-600'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Add New Meal
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: MANAGE CATALOG MEALS (EDIT & DELETE) */}
          {mealSubTab === 'manage' && (
            <div className="space-y-6">
              {/* Search & Filter Controls for Meals */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={mealSearch}
                    onChange={(e) => setMealSearch(e.target.value)}
                    placeholder="Search meal by name or ingredients..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-xs font-medium rounded-xl pl-10 pr-4 py-3 outline-none focus:border-purple-400 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
                  <Filter className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold text-gray-500">Category:</span>
                  <select
                    value={mealCategoryFilter}
                    onChange={(e) => setMealCategoryFilter(e.target.value)}
                    className="bg-transparent font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Meals Grid */}
              {filteredMeals.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200 shadow-sm">
                  <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-gray-800 font-bold text-lg">No Meals Found</h3>
                  <p className="text-gray-400 text-xs mt-1">No meals match your current search or category filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMeals.map((meal) => {
                    const mealId = meal.id || meal._id;
                    const titleStr = meal.title || meal.name;
                    const createdDateStr = meal.createdAt
                      ? new Date(meal.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })
                      : 'Catalog Item';

                    return (
                      <div
                        key={mealId}
                        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                      >
                        {/* Meal Image & Badge Header */}
                        <div>
                          <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                            <img
                              src={meal.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop'}
                              alt={titleStr}
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                            />
                            <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 font-extrabold text-xs px-3 py-1 rounded-full shadow-sm">
                              {meal.category || 'Meal'}
                            </span>
                            <span className="absolute top-3 right-3 bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-sm">
                              ₹{Number(meal.price || 9.99).toFixed(2)}
                            </span>
                          </div>

                          {/* Meal Info Body */}
                          <div className="p-5 space-y-2">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{titleStr}</h3>
                            <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                              {meal.description || 'Nutritious chef-prepared meal balanced for peak wellness.'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-2 border-t border-gray-100">
                              <span>🔥 {meal.calories || 350} kcal</span>
                              <span>⏱️ {meal.time || '15 min'}</span>
                              <span>📅 {createdDateStr}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: Edit & Delete */}
                        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between gap-3">
                          <button
                            onClick={() => handleStartEditMeal(meal)}
                            className="flex-1 py-2.5 px-4 bg-white hover:bg-purple-50 text-purple-700 font-bold border border-gray-200 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
                            Edit Meal
                          </button>
                          <button
                            onClick={() => handleDeleteMealClick(meal)}
                            className="py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-600 font-bold border border-rose-200 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: ADD NEW MEAL */}
          {mealSubTab === 'add' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
                <SectionHeader title="Add New Meal" />

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Meal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Organic Avocado Toast"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Briefly describe the ingredients, macro balance, and taste profile..."
                      className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium cursor-pointer"
                      >
                        <option value="">-- Select Category --</option>
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Price ($ / ₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="9.99"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Calories (kcal) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="350"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Prep Time</label>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="15 min"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium cursor-pointer"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Meal Image (Upload or URL)</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="cursor-pointer bg-purple-50 text-purple-600 border border-purple-200 font-bold px-4 py-2.5 rounded-xl hover:bg-purple-100 transition-colors text-sm flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Upload File
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                        <span className="text-gray-400 text-xs font-semibold">OR Enter Image URL below:</span>
                      </div>

                      <input
                        type="url"
                        value={imagePreview}
                        onChange={(e) => setImagePreview(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 outline-none focus:border-purple-400 font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-0.5"
                    >
                      <PlusCircle className="w-6 h-6" />
                      <span>Save & Publish Meal</span>
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex flex-col gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <SectionHeader title="Live Card Preview" />
                  <p className="text-gray-400 text-xs mb-4">This is how your meal will appear on the customer food menu.</p>

                  <div className="max-w-xs mx-auto">
                    <FoodCard
                      id={999}
                      title={title || 'Sample Meal Name'}
                      image={imagePreview}
                      calories={calories || 350}
                      time={time || '15 min'}
                      difficulty={difficulty}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DELIVERY ACTIVITY LOGS (ADMIN MONITORING) */}
      {/* ========================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <SectionHeader title="Delivery Activity Audit Logs" />
              <p className="text-gray-400 text-xs mt-1">Monitor all delivery personnel activity logs and delivery workflow timestamps in real time.</p>
            </div>

            <button
              onClick={() => fetchAdminDeliveryLogs({
                deliveryPerson: logDeliveryPersonFilter,
                search: logSearch,
                status: logStatusFilter,
                dateRange: logDateRangeFilter,
                startDate: logStartDate,
                endDate: logEndDate,
                page: logPage,
                limit: 10,
              })}
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-4 py-2 rounded-xl text-xs border border-purple-200 transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Clock className="w-4 h-4" /> Refresh Audit Logs
            </button>
          </div>

          {/* Admin Log Filters */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Delivery Person Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Delivery Agent</label>
                <select
                  value={logDeliveryPersonFilter}
                  onChange={(e) => { setLogDeliveryPersonFilter(e.target.value); setLogPage(1); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-purple-400"
                >
                  <option value="ALL">All Delivery Personnel</option>
                  {deliveryUsers.map((u) => (
                    <option key={u._id} value={u._id}>{u.name || u.username} ({u.vehicleType || 'Agent'})</option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Date Range</label>
                <select
                  value={logDateRangeFilter}
                  onChange={(e) => { setLogDateRangeFilter(e.target.value); setLogPage(1); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-purple-400"
                >
                  <option value="ALL">All Time</option>
                  <option value="today">Today</option>
                  <option value="last7">Last 7 Days</option>
                  <option value="last30">Last 30 Days</option>
                  <option value="custom">Custom Date Range</option>
                </select>
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Search Order / Customer</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Order ID, Customer Name, Phone..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Delivery Status Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Status</label>
                <select
                  value={logStatusFilter}
                  onChange={(e) => { setLogStatusFilter(e.target.value); setLogPage(1); }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-purple-400"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Failed Delivery">Failed Delivery</option>
                </select>
              </div>
            </div>

            {/* Custom Range Input fields */}
            {logDateRangeFilter === 'custom' && (
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Start Date</label>
                  <input
                    type="date"
                    value={logStartDate}
                    onChange={(e) => setLogStartDate(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">End Date</label>
                  <input
                    type="date"
                    value={logEndDate}
                    onChange={(e) => setLogEndDate(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Admin Logs Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {adminLogs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400 text-sm italic">No delivery activity logs found matching current filter criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-400 font-extrabold uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="py-3.5 px-4">Time</th>
                      <th className="py-3.5 px-4">Delivery Agent</th>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Action Performed</th>
                      <th className="py-3.5 px-4">Current Status</th>
                      <th className="py-3.5 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {adminLogs.map((log) => {
                      const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
                      const dateStr = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
                      const delAgentName = log.deliveryPerson?.name || log.deliveryPerson?.username || 'Agent';
                      const orderIdShort = log.order?._id
                        ? String(log.order._id).substring(String(log.order._id).length - 8).toUpperCase()
                        : 'ORD-N/A';

                      return (
                        <tr key={log._id} className="hover:bg-purple-50/50 transition-all">
                          <td className="py-3.5 px-4 font-mono">
                            <p className="font-bold text-gray-900">{timeStr}</p>
                            <p className="text-[10px] text-gray-400">{dateStr}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-purple-900">{delAgentName}</p>
                            <p className="text-[10px] text-purple-600 font-semibold">{log.deliveryPerson?.vehicleType || 'Agent'}</p>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-purple-700">
                            #{orderIdShort}
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-gray-900">{log.customerName || 'Customer'}</p>
                            <p className="text-[11px] text-gray-400">{log.customerPhone || 'N/A'}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 inline-block">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-lg">
                              {log.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => { setSelectedLogForModal(log); setIsLogModalOpen(true); }}
                              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-xl border border-purple-200 transition-all inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Log
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {adminLogsPagination?.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500">
                  Page {adminLogsPagination.page} of {adminLogsPagination.totalPages} ({adminLogsPagination.total} audit logs)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={logPage <= 1}
                    onClick={() => setLogPage((p) => Math.max(p - 1, 1))}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg font-bold disabled:opacity-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <button
                    disabled={logPage >= adminLogsPagination.totalPages}
                    onClick={() => setLogPage((p) => Math.min(p + 1, adminLogsPagination.totalPages))}
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

      {/* Delivery Detail Modal for Admin View */}
      <DeliveryDetailModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        log={selectedLogForModal}
      />

      {/* ========================================================= */}
      {/* EDIT MEAL MODAL DIALOG */}
      {/* ========================================================= */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingMeal(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-600" />
              Edit Meal Details
            </h2>

            <form onSubmit={handleSaveEditMealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Meal Name</label>
                <input
                  type="text"
                  required
                  value={editingMeal.title}
                  onChange={(e) => setEditingMeal((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={editingMeal.category}
                  onChange={(e) => setEditingMeal((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-purple-400 cursor-pointer"
                >
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editingMeal.description}
                  onChange={(e) => setEditingMeal((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price ($ / ₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingMeal.price}
                    onChange={(e) => setEditingMeal((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    required
                    value={editingMeal.calories}
                    onChange={(e) => setEditingMeal((prev) => ({ ...prev, calories: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Meal Image (Upload or URL)</label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="cursor-pointer bg-purple-50 text-purple-600 border border-purple-200 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-purple-100 transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                  </label>
                </div>
                <input
                  type="text"
                  value={editingMeal.image}
                  onChange={(e) => setEditingMeal((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMeal(null)}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD DELIVERY PERSONNEL MODAL */}
      {/* ========================================================= */}
      {isAddDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">Add New Delivery Personnel</h3>
              </div>
              <button
                onClick={() => setIsAddDeliveryModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDeliverySubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Miller"
                    value={delName}
                    onChange={(e) => setDelName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. john_driver"
                    value={delUsername}
                    onChange={(e) => setDelUsername(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@nutriapp.com"
                    value={delEmail}
                    onChange={(e) => setDelEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    value={delPhone}
                    onChange={(e) => setDelPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={delPassword}
                    onChange={(e) => setDelPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={delConfirmPassword}
                    onChange={(e) => setDelConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={delVehicleType}
                    onChange={(e) => setDelVehicleType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  >
                    <option value="Bike">Bike 🛵</option>
                    <option value="Scooter">Scooter 🛵</option>
                    <option value="Car">Car 🚗</option>
                    <option value="Bicycle">Bicycle 🚲</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    placeholder="e.g. MH-12-AB-1234"
                    value={delVehicleNumber}
                    onChange={(e) => setDelVehicleNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact Number</label>
                <input
                  type="tel"
                  placeholder="+91 9123456789"
                  value={delEmergencyContact}
                  onChange={(e) => setDelEmergencyContact(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-purple-400"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDeliveryModalOpen(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 transition-colors shadow-md"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT DELIVERY PERSONNEL MODAL */}
      {/* ========================================================= */}
      {editingDeliveryUser && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-extrabold text-gray-900">Edit Delivery Personnel</h3>
              <button
                onClick={() => setEditingDeliveryUser(null)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditDeliverySubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingDeliveryUser.name || ''}
                    onChange={(e) => setEditingDeliveryUser((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingDeliveryUser.phone || ''}
                    onChange={(e) => setEditingDeliveryUser((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={editingDeliveryUser.vehicleType || 'Bike'}
                    onChange={(e) => setEditingDeliveryUser((prev) => ({ ...prev, vehicleType: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
                  >
                    <option value="Bike">Bike 🛵</option>
                    <option value="Scooter">Scooter 🛵</option>
                    <option value="Car">Car 🚗</option>
                    <option value="Bicycle">Bicycle 🚲</option>
                    <option value="None">None</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Vehicle Number</label>
                  <input
                    type="text"
                    value={editingDeliveryUser.vehicleNumber || ''}
                    onChange={(e) => setEditingDeliveryUser((prev) => ({ ...prev, vehicleNumber: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Emergency Contact Number</label>
                <input
                  type="text"
                  value={editingDeliveryUser.emergencyContact || ''}
                  onChange={(e) => setEditingDeliveryUser((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to keep unchanged"
                  onChange={(e) => setEditingDeliveryUser((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none"
                />
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDeliveryUser(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default AdminDashboard;
