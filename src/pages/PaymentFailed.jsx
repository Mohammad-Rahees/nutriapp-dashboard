import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import useStore from '../store/useStore';
import { XCircle, ShoppingBag, RotateCcw, AlertTriangle } from 'lucide-react';

const PaymentFailed = () => {
  const { setRoute, paymentError } = useStore();

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-rose-100 text-center relative overflow-hidden">
          {/* Background decorative glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-60"></div>

          {/* Failed Badge Icon */}
          <div className="relative z-10 w-20 h-20 bg-rose-50 border-4 border-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <XCircle className="w-10 h-10 text-rose-500 animate-pulse" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Failed or Cancelled</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto mb-6">
            No payment was completed. Your transaction was either cancelled or could not be verified by the payment gateway.
          </p>

          {paymentError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-8 text-left flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-rose-900 text-sm">Reason:</h4>
                <p className="text-rose-700 text-xs mt-0.5">{paymentError}</p>
              </div>
            </div>
          )}

          <div className="bg-amber-50/70 rounded-2xl border border-amber-200/70 p-4 text-amber-800 text-sm font-medium mb-8">
            💡 Don't worry! Your cart items have been saved safely in your cart. You can try checking out again whenever you're ready.
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setRoute('order')}
              className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md hover:shadow-rose-100 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Return to Cart
            </button>
            <button
              onClick={() => setRoute('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentFailed;
