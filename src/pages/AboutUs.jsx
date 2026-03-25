import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import { Info, Users, Leaf, ShieldCheck } from 'lucide-react';

const AboutUs = () => {
  return (
    <PageLayout>
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">About Us</h1>
        <p className="text-gray-500 text-sm mt-1">Our mission to bring healthy, fresh food right to your doorstep.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Who We Are</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          NutriApp was founded with a simple goal: make eating healthy effortless and delicious. 
          We believe that nutrition is the foundation of a great life. By sourcing the freshest 
          ingredients and crafting balanced meal plans, we empower our community to reach their 
          goals without sacrificing taste.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-purple-50 rounded-xl p-5 flex flex-col items-center text-center">
            <Leaf className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-purple-900 mb-2">Fresh Ingredients</h3>
            <p className="text-sm text-purple-700">We source locally to ensure maximum freshness.</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-blue-900 mb-2">Community First</h3>
            <p className="text-sm text-blue-700">Thousands of happy customers eating better every day.</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-5 flex flex-col items-center text-center">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-emerald-900 mb-2">Quality Verified</h3>
            <p className="text-sm text-emerald-700">Every single meal is reviewed by our dietitians.</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
export default AboutUs;
