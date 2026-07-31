import React from 'react';
import { Search, Bell, Menu, Sun, Moon, Apple } from 'lucide-react';
import useStore from '../../store/useStore';

const Navbar = ({ toggleSidebar }) => {
  const { searchQuery, setSearchQuery, theme, toggleTheme, user } = useStore();
  const displayName = user?.name || user?.username || 'Guest User';
  const roleLabel = (user?.role || 'CUSTOMER').toUpperCase();
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f3e8ff&color=9333ea&bold=true`;

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm h-16 transition-all duration-300">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Apple className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-800 hidden lg:block tracking-tight">NutriApp</span>
          </div>

          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center max-w-md w-full bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all duration-300 cursor-text">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search food by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Search className="w-5 h-5" />
          </button>

          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:bg-gray-100 hover:text-purple-600 rounded-xl transition-all duration-300"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-purple-600 rounded-xl transition-all duration-300">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-500 rounded-full border border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-100 mx-1"></div>

          <button className="flex items-center gap-3 px-2 py-1.5 hover:bg-gray-50 rounded-xl transition-all duration-300">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800">{displayName}</span>
              <span className={`text-[10px] font-extrabold tracking-wide px-2 py-0.5 rounded-full ${
                user?.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {roleLabel}
              </span>
            </div>
            <img
              src={avatarUrl}
              alt="User profile"
              className="w-9 h-9 rounded-xl border border-gray-100 shadow-sm"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
