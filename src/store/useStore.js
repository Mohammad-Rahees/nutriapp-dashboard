import { create } from 'zustand';

const BASE_URL = 'http://localhost:5000/api';

const useStore = create((set, get) => ({
  isAuthenticated: false,
  user: null, // { _id, username, name, email, role: 'Admin' | 'Customer', token }
  meals: [],
  categories: [],
  cartItems: [],
  orders: [],
  adminOrders: [],
  customerOrders: [],
  latestOrder: null,
  paymentError: '',
  selectedRecipe: null,
  likedRecipes: [],
  currentRoute: 'dashboard',
  searchQuery: '',
  theme: 'light',
  authError: '',

  // Fetch catalog meals from MongoDB
  fetchMeals: async () => {
    try {
      const res = await fetch(`${BASE_URL}/foods`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted = data.map((item) => ({
            ...item,
            id: item._id ? item._id.toString() : item.id,
            title: item.title || item.name,
            name: item.name || item.title,
            description: item.description || '',
            category: item.category || 'Other',
            image: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
            calories: Number(item.calories) || 0,
            time: item.time || '15 min',
            difficulty: item.difficulty || 'Easy',
            price: Number(item.price) || 9.99,
          }));
          set({ meals: formatted });
        }
      }
    } catch (err) {
      console.warn('Could not fetch meals from MongoDB API:', err);
    }
  },

  // Fetch categories from MongoDB
  fetchCategories: async () => {
    try {
      const res = await fetch(`${BASE_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          set({ categories: data });
        }
      }
    } catch (err) {
      console.warn('Could not fetch categories from MongoDB API:', err);
    }
  },

  // Fetch user cart from MongoDB
  fetchCart: async () => {
    const user = get().user;
    const userId = user?._id || user?.id;
    try {
      const res = await fetch(`${BASE_URL}/cart?userId=${userId || ''}`);
      if (res.ok) {
        const cart = await res.json();
        if (cart && Array.isArray(cart.items)) {
          set({ cartItems: cart.items });
        }
      }
    } catch (err) {
      console.warn('Could not fetch cart from MongoDB API:', err);
    }
  },

  // Sync current cart items to MongoDB
  syncCartToBackend: async (newCartItems) => {
    const user = get().user;
    const userId = user?._id || user?.id;
    try {
      await fetch(`${BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, items: newCartItems }),
      });
    } catch (err) {
      console.warn('Could not sync cart to MongoDB:', err);
    }
  },

  // Fetch all orders for Admin Dashboard from MongoDB
  fetchAdminOrders: async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          set({ adminOrders: data, orders: data });
        }
      }
    } catch (err) {
      console.warn('Could not fetch admin orders from MongoDB:', err);
    }
  },

  // Fetch logged in customer's own orders from MongoDB
  fetchCustomerOrders: async () => {
    const user = get().user;
    const userId = user?._id || user?.id;
    if (!userId) return;
    try {
      const res = await fetch(`${BASE_URL}/orders?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          set({ customerOrders: data });
        }
      }
    } catch (err) {
      console.warn('Could not fetch customer orders from MongoDB:', err);
    }
  },

  // Admin update order status in MongoDB
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          adminOrders: state.adminOrders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          ),
          customerOrders: state.customerOrders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          ),
        }));
        return { success: true, order: updated };
      }
    } catch (err) {
      console.warn('Could not update order status in MongoDB:', err);
    }
    return { success: false };
  },

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  
  // Real MongoDB Authentication Login
  login: async (username, password) => {
    set({ authError: '' });
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const data = await res.json();

      if (res.ok && data) {
        const role = data.role && data.role.toLowerCase() === 'admin' ? 'Admin' : 'Customer';
        const userObj = {
          _id: data._id,
          id: data._id,
          username: data.username || username.trim(),
          name: data.name || username.trim(),
          email: data.email,
          role: role,
          token: data.token,
        };

        set({
          isAuthenticated: true,
          user: userObj,
          currentRoute: role === 'Admin' ? 'admin' : 'dashboard',
          authError: '',
        });

        get().fetchMeals();
        get().fetchCategories();
        get().fetchCart();
        return { success: true };
      } else {
        const errorMsg = data.message || 'Invalid username or password';
        set({ authError: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMsg = 'Backend server unreachable. Please check backend status.';
      set({ authError: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  // Real MongoDB Authentication Register / Signup
  signup: async (username, password, name) => {
    set({ authError: '' });
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_');
    const cleanName = name?.trim() || username.trim();
    const email = `${cleanUsername}@nutriapp.com`;

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: cleanUsername,
          name: cleanName,
          email,
          password: password.trim(),
          role: 'Customer',
        }),
      });

      const data = await res.json();

      if (res.ok && data) {
        const userObj = {
          _id: data._id,
          id: data._id,
          username: data.username || cleanUsername,
          name: data.name || cleanName,
          email: data.email,
          role: 'Customer',
          token: data.token,
        };

        set({
          isAuthenticated: true,
          user: userObj,
          currentRoute: 'dashboard',
          authError: '',
        });

        get().fetchMeals();
        get().fetchCategories();
        get().fetchCart();
        return { success: true };
      } else {
        const errorMsg = data.message || 'Sign up failed';
        set({ authError: errorMsg });
        return { success: false, message: errorMsg };
      }
    } catch (err) {
      const errorMsg = 'Backend server unreachable. Please check backend status.';
      set({ authError: errorMsg });
      return { success: false, message: errorMsg };
    }
  },

  logout: () => set({ isAuthenticated: false, user: null, cartItems: [], currentRoute: 'dashboard', authError: '' }),

  // Update customer profile in MongoDB Users collection
  updateUserProfile: async (profileData) => {
    const user = get().user;
    const userId = user?._id || user?.id;

    const payload = {
      userId,
      ...profileData,
    };

    try {
      const res = await fetch(`${BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: user?.token ? `Bearer ${user.token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedUserPayload = await res.json();
        set((state) => ({
          user: {
            ...state.user,
            ...updatedUserPayload,
          },
        }));
        return { success: true, user: updatedUserPayload };
      } else {
        const errData = await res.json();
        return { success: false, message: errData.message || 'Failed to update profile' };
      }
    } catch (err) {
      console.warn('API error updating profile in backend DB:', err);
      return { success: false, message: err.message };
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setRoute: (route) => set((state) => {
    if (route === 'admin' && state.user?.role !== 'Admin') {
      return { currentRoute: 'dashboard' };
    }
    return { currentRoute: route };
  }),

  // Add meal to MongoDB `foods` collection
  addMeal: async (mealData) => {
    const payload = {
      title: mealData.title,
      name: mealData.title,
      description: mealData.description || '',
      category: mealData.category || 'Other',
      image: mealData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop',
      calories: Number(mealData.calories) || 0,
      price: Number(mealData.price) || 9.99,
      time: mealData.time || '15 min',
      difficulty: mealData.difficulty || 'Easy',
      protein: Number(mealData.protein) || 0,
      carbs: Number(mealData.carbs) || 0,
      fat: Number(mealData.fat) || 0,
    };

    let createdMeal = null;

    try {
      const res = await fetch(`${BASE_URL}/foods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        createdMeal = {
          ...data,
          id: data._id ? data._id.toString() : data.id,
          title: data.title || data.name,
          name: data.name || data.title,
        };
      }
    } catch (err) {
      console.warn('API error saving meal to backend DB:', err);
    }

    if (!createdMeal) {
      createdMeal = {
        id: Date.now().toString(),
        ...payload,
      };
    }

    set((state) => ({
      meals: [createdMeal, ...state.meals.filter((m) => String(m.id) !== String(createdMeal.id))],
    }));
  },

  // Update meal in MongoDB `foods` collection
  updateMeal: async (id, updatedFields) => {
    try {
      const res = await fetch(`${BASE_URL}/foods/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        const updated = await res.json();
        const formatted = {
          ...updated,
          id: updated._id ? updated._id.toString() : updated.id,
          title: updated.title || updated.name,
          name: updated.name || updated.title,
        };

        set((state) => ({
          meals: state.meals.map((m) =>
            String(m.id || m._id) === String(id) ? formatted : m
          ),
        }));
        return { success: true, meal: formatted };
      }
    } catch (err) {
      console.warn('API error updating meal in backend DB:', err);
    }
    return { success: false };
  },

  // Delete meal from MongoDB `foods` collection
  deleteMeal: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/foods/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        set((state) => ({
          meals: state.meals.filter((m) => String(m.id || m._id) !== String(id)),
        }));
        return { success: true };
      }
    } catch (err) {
      console.warn('API error deleting meal from backend DB:', err);
    }
    return { success: false };
  },

  // Place Order in MongoDB `orders` collection
  placeOrder: async () => {
    const { cartItems, user } = get();
    if (!cartItems || cartItems.length === 0) return false;

    const formattedItems = cartItems.map((item) => ({
      id: String(item.id || item._id || Date.now()),
      title: item.title || item.name || 'Meal Item',
      name: item.name || item.title || 'Meal Item',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.image || '',
    }));

    const totalAmount = formattedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const payload = {
      userId: user?._id || user?.id,
      orderItems: formattedItems,
      totalAmount,
    };

    try {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const savedOrder = await res.json();
        console.log('✅ Order placed and saved in MongoDB:', savedOrder);
        get().clearCart();
        return true;
      }
    } catch (err) {
      console.warn('Could not save order to MongoDB:', err);
    }
    get().clearCart();
    return true;
  },

  // Start Razorpay Standard Web Checkout
  startRazorpayCheckout: async () => {
    const { cartItems, user } = get();
    if (!cartItems || cartItems.length === 0) {
      set({ paymentError: "Your cart is empty. Add items before checking out.", currentRoute: "payment-failed" });
      return;
    }

    set({ paymentError: '' });

    try {
      // Step 1: Call /api/create-order on backend
      const res = await fetch(`${BASE_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id || user?.id,
          sessionId: user?._id || user?.id || 'guest',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.order_id) {
        set({
          paymentError: data.message || "Failed to create Razorpay Order on server.",
          currentRoute: "payment-failed",
        });
        return;
      }

      const razorpayKey = data.key || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TJwGz8Ynnf8h0j";

      // Step 2: Open Razorpay Standard Checkout Popup
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "NutriApp",
        description: "Healthy Meal Order Purchase",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            // Step 3: Send payment details to backend for HMAC verification & order creation
            const verifyRes = await fetch(`${BASE_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user?._id || user?.id,
                sessionId: user?._id || user?.id || 'guest',
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              set({
                latestOrder: verifyData.order,
                cartItems: [],
                currentRoute: "payment-success",
              });
            } else {
              set({
                paymentError: verifyData.message || "Payment signature verification failed. Transaction rejected.",
                currentRoute: "payment-failed",
              });
            }
          } catch (err) {
            set({
              paymentError: "Payment verification error: " + err.message,
              currentRoute: "payment-failed",
            });
          }
        },
        modal: {
          ondismiss: function () {
            set({
              paymentError: "Payment process was cancelled or closed by user.",
              currentRoute: "payment-failed",
            });
          },
        },
        prefill: {
          name: user?.name || "Customer User",
          email: user?.email || "customer@nutriapp.com",
        },
        theme: {
          color: "#9333ea",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          set({
            paymentError: response.error?.description || "Payment failed at gateway.",
            currentRoute: "payment-failed",
          });
        });
        rzp.open();
      } else {
        set({
          paymentError: "Razorpay SDK script failed to load. Check network connection.",
          currentRoute: "payment-failed",
        });
      }
    } catch (err) {
      set({
        paymentError: "Checkout error: " + err.message,
        currentRoute: "payment-failed",
      });
    }
  },

  // Retry Razorpay Payment for existing Pending Order
  retryRazorpayCheckout: async (order) => {
    const { user } = get();
    if (!order || !order._id) return;

    set({ paymentError: '' });

    try {
      // Step 1: Call /api/retry-payment
      const res = await fetch(`${BASE_URL}/retry-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order._id }),
      });

      const data = await res.json();

      if (!res.ok || !data.order_id) {
        set({
          paymentError: data.message || "Failed to create Razorpay Order for retry.",
          currentRoute: "payment-failed",
        });
        return;
      }

      const razorpayKey = data.key || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TJwGz8Ynnf8h0j";

      // Step 2: Configure Razorpay Standard Checkout Popup
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "NutriApp",
        description: "Complete Order Payment",
        order_id: data.order_id,
        handler: async function (response) {
          try {
            // Step 3: Verify Retry Signature & Update Existing Order to "Paid"
            const verifyRes = await fetch(`${BASE_URL}/verify-retry-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              set((state) => ({
                latestOrder: verifyData.order,
                adminOrders: state.adminOrders.map((o) =>
                  o._id === order._id ? { ...o, paymentStatus: 'Paid', razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id } : o
                ),
                customerOrders: state.customerOrders.map((o) =>
                  o._id === order._id ? { ...o, paymentStatus: 'Paid', razorpayOrderId: response.razorpay_order_id, razorpayPaymentId: response.razorpay_payment_id } : o
                ),
                currentRoute: "payment-success",
              }));
            } else {
              set({
                paymentError: verifyData.message || "Payment signature verification failed.",
                currentRoute: "payment-failed",
              });
            }
          } catch (err) {
            set({
              paymentError: "Payment verification error: " + err.message,
              currentRoute: "payment-failed",
            });
          }
        },
        modal: {
          ondismiss: function () {
            set({
              paymentError: "Payment process was cancelled or closed by user.",
              currentRoute: "payment-failed",
            });
          },
        },
        prefill: {
          name: user?.name || "Customer User",
          email: user?.email || "customer@nutriapp.com",
        },
        theme: {
          color: "#9333ea",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          set({
            paymentError: response.error?.description || "Payment failed at gateway.",
            currentRoute: "payment-failed",
          });
        });
        rzp.open();
      } else {
        set({
          paymentError: "Razorpay SDK script failed to load.",
          currentRoute: "payment-failed",
        });
      }
    } catch (err) {
      set({
        paymentError: "Checkout error: " + err.message,
        currentRoute: "payment-failed",
      });
    }
  },

  addToCart: (item) => {
    const itemId = item.id || item._id;
    const itemTitle = item.name || item.title || 'Meal Item';
    const itemPrice = Number(item.price || 9.99);
    const itemImage = item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80&auto=format&fit=crop';
    const currentCart = get().cartItems;
    const existing = currentCart.find(i => String(i.id) === String(itemId));
    let updatedItems = [];

    if (existing) {
      updatedItems = currentCart.map(i => 
        String(i.id) === String(itemId) ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [...currentCart, {
        ...item,
        id: itemId,
        name: itemTitle,
        title: itemTitle,
        price: itemPrice,
        image: itemImage,
        quantity: 1,
        unit: item.unit || "meal"
      }];
    }

    set({ cartItems: updatedItems });
    get().syncCartToBackend(updatedItems);
  },

  removeFromCart: (itemId, completely = false) => {
    const currentCart = get().cartItems;
    let updatedItems = [];

    if (completely) {
      updatedItems = currentCart.filter(i => String(i.id) !== String(itemId));
    } else {
      const existing = currentCart.find(i => String(i.id) === String(itemId));
      if (!existing) return;

      if (existing.quantity <= 1) {
        updatedItems = currentCart.filter(i => String(i.id) !== String(itemId));
      } else {
        updatedItems = currentCart.map(i => 
          String(i.id) === String(itemId) ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
    }

    set({ cartItems: updatedItems });
    get().syncCartToBackend(updatedItems);
  },

  clearCart: () => {
    set({ cartItems: [] });
    get().syncCartToBackend([]);
  },

  toggleLike: (recipeId) => set((state) => ({
    likedRecipes: state.likedRecipes.includes(recipeId)
      ? state.likedRecipes.filter(id => String(id) !== String(recipeId))
      : [...state.likedRecipes, recipeId]
  })),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe })
}));

// Automatically fetch meals and categories from MongoDB on load
setTimeout(() => {
  useStore.getState().fetchMeals();
  useStore.getState().fetchCategories();
}, 0);

export default useStore;
