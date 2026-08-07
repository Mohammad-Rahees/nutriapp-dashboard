import React from 'react';
import { Home, Activity, LayoutGrid, ShoppingCart, X, User, Apple, Info, Mail, LogOut, ShieldCheck, Truck } from 'lucide-react';
import useStore from '../../store/useStore';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentRoute, setRoute, logout, user } = useStore();

  const menuItems = [
    ...(user?.role === 'Delivery' 
      ? [{ name: 'Delivery Dashboard', icon: Truck, route: 'delivery' }]
      : [{ name: 'Dashboard', icon: Home, route: 'dashboard' }]
    ),
    ...(user?.role === 'Admin' ? [{ name: 'Admin Dashboard', icon: ShieldCheck, route: 'admin' }] : []),
    ...(user?.role !== 'Delivery' ? [
      { name: 'Health Overview', icon: Activity, route: 'overview' },
      { name: 'Categories', icon: LayoutGrid, route: 'categories' },
      { name: 'Order Groceries', icon: ShoppingCart, route: 'order' },
    ] : []),
    { name: 'Profile Settings', icon: User, route: 'profile' },
    { name: 'About Us', icon: Info, route: 'about' },
    { name: 'Contact Us', icon: Mail, route: 'contact' },
  ];

  const handleNav = (e, route) => {
    e.preventDefault();
    if (route) setRoute(route);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-lg border-r border-gray-100 
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'}
        flex flex-col shadow-sm`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl text-gray-800 transition-opacity duration-300 
              ${!isOpen ? 'lg:hidden lg:opacity-0' : ''}`}>
              NutriApp
            </span>
          </div>
          <button 
            className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col justify-between">
          <div className="space-y-2">
            {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            
            return (
              <a
                key={item.name}
                onClick={(e) => handleNav(e, item.route)}
                className={`cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-purple-100 text-purple-600 font-semibold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-900 font-medium'
                }`}
                title={!isOpen ? item.name : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-purple-500'}`} />
                <span className={`transition-opacity duration-300 ${!isOpen ? 'lg:hidden lg:opacity-0' : ''}`}>
                  {item.name}
                </span>
              </a>
            );
          })}
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button
               onClick={() => logout()}
               className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group text-rose-500 hover:bg-rose-50 font-bold"
               title={!isOpen ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span className={`transition-opacity duration-300 ${!isOpen ? 'lg:hidden lg:opacity-0' : ''}`}>
                Logout
              </span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
