import React, { useMemo, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import SectionHeader from '../components/ui/SectionHeader';
import FoodCard from '../components/ui/FoodCard';
import useStore from '../store/useStore';
import { SearchX } from 'lucide-react';

const Categories = () => {
  const { searchQuery, meals, fetchMeals } = useStore();

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const categoriesMap = useMemo(() => {
    // Collect all foods matching search query
    const filtered = meals.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group by category
    return filtered.reduce((acc, item) => {
      const category = item.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [searchQuery, meals]);

  const categoryKeys = Object.keys(categoriesMap).sort();

  return (
    <PageLayout>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Explore our menu guided by meals and dietary types.</p>
      </div>

      {categoryKeys.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl shadow-sm border border-gray-100">
          <SearchX className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-gray-900 font-bold mb-1">No items found</h3>
          <p className="text-gray-500 text-sm">Try tweaking your search query.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {categoryKeys.map(category => (
            <div key={category}>
              <SectionHeader title={category} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoriesMap[category].map((item) => (
                  <FoodCard key={item.id} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default Categories;
