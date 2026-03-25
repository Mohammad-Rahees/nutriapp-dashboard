import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import StatCard from '../components/dashboard/StatCard';
import UpcomingMeals from '../components/dashboard/UpcomingMeals';
import { upcomingMealsData } from '../data/mockData';

const HealthOverview = () => {
  return (
    <PageLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Health Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Track your daily nutrition and activity levels.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Calories Today"
          primaryValue="1,840"
          secondaryValue="/ 2,200"
          secondaryColorClass="text-green-500"
        />
        <StatCard 
          title="Water Intake"
          primaryValue="4"
          secondaryValue="/ 8"
          secondaryUnit="glasses"
          secondaryColorClass="text-blue-500"
        />
        <StatCard 
          title="Active Orders"
          primaryValue="2"
          secondaryValue="groceries"
          secondaryColorClass="text-purple-500"
        />
      </div>

      <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px] hover:shadow-md hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Activity Chart</h2>
          <div className="h-full min-h-[300px] w-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-400 text-sm">Chart Placeholder</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[400px] hover:shadow-md hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Meals</h2>
          <UpcomingMeals meals={upcomingMealsData} />
        </div>
      </div>
    </PageLayout>
  );
};

export default HealthOverview;
