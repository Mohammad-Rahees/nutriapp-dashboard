import React from 'react';
import { Clock, CheckCircle2, PackageCheck, Truck, MapPin } from 'lucide-react';

const DeliveryTracker = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Delivery Status</h2>
      
      <div className="flex items-center gap-4 mb-8 bg-purple-50/50 p-4 rounded-xl border border-purple-50 hover:border-purple-100 transition-colors">
        <div className="w-12 h-12 bg-white shadow-sm text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-purple-500 font-medium">Estimated Arrival</p>
          <p className="text-xl font-bold text-purple-900">4:30 PM - 4:45 PM</p>
        </div>
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:via-gray-200 before:to-gray-200 pl-2 md:pl-0">
        
        {/* Step 1 */}
        <div className="relative flex items-center gap-4 text-gray-800 md:justify-center">
          <div className="hidden md:block w-32 text-right">
            <h4 className="font-semibold text-sm">Order Confirmed</h4>
            <p className="text-xs text-gray-500 mt-0.5">3:45 PM</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center border-4 border-white shadow-sm shrink-0 z-10 transition-transform hover:scale-110 cursor-pointer">
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <div className="md:hidden">
            <h4 className="font-semibold text-sm">Order Confirmed</h4>
            <p className="text-xs text-gray-500 mt-0.5">3:45 PM</p>
          </div>
          <div className="hidden md:block w-32"></div>
        </div>

        {/* Step 2 */}
        <div className="relative flex items-center gap-4 text-gray-800 md:justify-center">
          <div className="hidden md:block w-32 text-right">
            <h4 className="font-semibold text-sm">Packed & Ready</h4>
            <p className="text-xs text-gray-500 mt-0.5">4:05 PM</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center border-4 border-white shadow-sm shrink-0 z-10 transition-transform hover:scale-110 cursor-pointer">
            <PackageCheck className="w-3 h-3" />
          </div>
          <div className="md:hidden">
            <h4 className="font-semibold text-sm">Packed & Ready</h4>
            <p className="text-xs text-gray-500 mt-0.5">4:05 PM</p>
          </div>
          <div className="hidden md:block w-32"></div>
        </div>

        {/* Step 3 */}
        <div className="relative flex items-center gap-4 text-gray-800 md:justify-center">
          <div className="hidden md:block w-32 text-right">
            <h4 className="font-semibold text-sm text-purple-600">On the way</h4>
            <p className="text-xs text-gray-500 mt-0.5">Courier nearby</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-50 border-2 border-purple-500 text-purple-600 flex items-center justify-center ring-4 ring-white shadow-sm shrink-0 z-10 relative transition-transform hover:scale-110 cursor-pointer">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-20"></span>
            <Truck className="w-3 h-3" />
          </div>
          <div className="md:hidden">
            <h4 className="font-semibold text-sm text-purple-600">On the way</h4>
            <p className="text-xs text-gray-500 mt-0.5">Courier nearby</p>
          </div>
          <div className="hidden md:block w-32"></div>
        </div>

        {/* Step 4 */}
        <div className="relative flex items-center gap-4 text-gray-400 md:justify-center">
          <div className="hidden md:block w-32 text-right">
            <h4 className="font-semibold text-sm">Delivered</h4>
            <p className="text-xs mt-0.5">Pending</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center ring-4 ring-white shrink-0 z-10 transition-transform hover:scale-110 cursor-pointer">
            <MapPin className="w-3 h-3 text-gray-300" />
          </div>
          <div className="md:hidden">
            <h4 className="font-semibold text-sm">Delivered</h4>
            <p className="text-xs mt-0.5">Pending</p>
          </div>
          <div className="hidden md:block w-32"></div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryTracker;
