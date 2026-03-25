import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: false,
  cartItems: [],
  selectedRecipe: null,
  likedRecipes: [],
  currentRoute: 'dashboard',
  searchQuery: '',
  theme: 'light',

  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  
  login: (username, password) => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, currentRoute: 'dashboard' }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setRoute: (route) => set({ currentRoute: route }),

  addToCart: (item) => set((state) => {
    const existing = state.cartItems.find(i => i.id === item.id);
    if (existing) {
      return {
        cartItems: state.cartItems.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      };
    }
    return { cartItems: [...state.cartItems, { ...item, quantity: 1, price: item.price || 9.99, unit: item.unit || "meal" }] };
  }),

  removeFromCart: (itemId, completely = false) => set((state) => {
    if (completely) {
      return { cartItems: state.cartItems.filter(i => i.id !== itemId) };
    }
    
    const existing = state.cartItems.find(i => i.id === itemId);
    if (!existing) return state;

    if (existing.quantity <= 1) {
      return { cartItems: state.cartItems.filter(i => i.id !== itemId) };
    }

    return {
      cartItems: state.cartItems.map(i => 
        i.id === itemId && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    };
  }),

  clearCart: () => set({ cartItems: [] }),

  toggleLike: (recipeId) => set((state) => ({
    likedRecipes: state.likedRecipes.includes(recipeId)
      ? state.likedRecipes.filter(id => id !== recipeId)
      : [...state.likedRecipes, recipeId]
  })),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe })
}));

export default useStore;
