import React, { useState, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SectionHeader from '../components/ui/SectionHeader';
import FoodCard from '../components/ui/FoodCard';
import { dashboardFoodItems } from '../data/mockData';
import useStore from '../store/useStore';
import { SearchX, Filter } from 'lucide-react';

const Dashboard = () => {
  const { searchQuery } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCommonFilter, setActiveCommonFilter] = useState('All');

  const categories = ['All', ...new Set(dashboardFoodItems.map(i => i.category || 'Other'))];
  const commonFilters = ['All', 'Under 300 kcal', 'Easy Prep', 'Fast (< 20m)'];

  const filteredItems = useMemo(() => {
    return dashboardFoodItems.filter(item => {
      // 1. Search Query
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // 2. Category Match
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;

      // 3. Common Filter Match
      if (activeCommonFilter === 'Under 300 kcal' && item.calories >= 300) return false;
      if (activeCommonFilter === 'Easy Prep' && item.difficulty !== 'Easy') return false;
      if (activeCommonFilter === 'Fast (< 20m)') {
         const timeNum = parseInt(item.time) || 99;
         if (timeNum >= 20) return false;
      }

      return true;
    });
  }, [searchQuery, activeCategory, activeCommonFilter]);

  return (
    <PageLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Food Menu</h1>
        <p className="text-gray-500 text-sm mt-1">Browse, filter and add items to your cart.</p>
        
        {/* Filters Container */}
        <div className="mt-6 flex flex-col gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'bg-purple-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Common Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <span className="flex items-center text-xs font-bold text-gray-400 mr-2 tracking-wider">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              QUICK FILTERS
            </span>
            {commonFilters.map(filterOption => (
              <button
                key={filterOption}
                onClick={() => setActiveCommonFilter(filterOption)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  activeCommonFilter === filterOption 
                    ? 'bg-gray-800 text-white shadow-sm hover:-translate-y-0.5 hover:shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent hover:border-gray-300'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 lg:mt-8">
        <SectionHeader title={searchQuery ? `Search Results for "${searchQuery}"` : "All Items"} />
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm border border-gray-100">
            <SearchX className="w-12 h-12 text-gray-300 mb-4" />
            <h3 className="text-gray-900 font-bold mb-1">No items found</h3>
            <p className="text-gray-500 text-sm">We couldn't find any food matching your filters.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setActiveCommonFilter('All'); }}
              className="mt-4 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-semibold hover:bg-purple-100 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Dashboard;
