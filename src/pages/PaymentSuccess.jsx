import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import useStore from '../store/useStore';
import { CheckCircle, ShoppingBag, ArrowRight, Calendar, ShieldCheck, Receipt } from 'lucide-react';

const PaymentSuccess = () => {
  const { latestOrder, setRoute } = useStore();

  const orderId = latestOrder?._id || latestOrder?.razorpayOrderId || 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const paymentId = latestOrder?.razorpayPaymentId || 'pay_test_' + Math.random().toString(36).substring(7);
  const totalAmount = Number(latestOrder?.totalAmount || 0).toFixed(2);
  const dateStr = new Date(latestOrder?.createdAt || Date.now()).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-purple-100 text-center relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-60"></div>

          {/* Success Badge Icon */}
          <div className="relative z-10 w-20 h-20 bg-emerald-50 border-4 border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
            Thank you for your purchase! Your payment has been verified and your order has been sent to our kitchen.
          </p>

          {/* Receipt Details Card */}
          <div className="bg-gray-50/80 rounded-2xl border border-gray-100 p-6 text-left mb-8 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <span className="text-gray-500 text-sm flex items-center gap-1.5 font-medium">
                <Receipt className="w-4 h-4 text-purple-500" /> Order ID
              </span>
              <span className="font-bold text-gray-800 text-sm font-mono">{orderId}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <span className="text-gray-500 text-sm flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Payment ID
              </span>
              <span className="font-semibold text-gray-700 text-xs font-mono bg-white px-2.5 py-1 rounded-md border border-gray-200">{paymentId}</span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
              <span className="text-gray-500 text-sm flex items-center gap-1.5 font-medium">
                <Calendar className="w-4 h-4 text-blue-500" /> Payment Date
              </span>
              <span className="font-medium text-gray-700 text-sm">{dateStr}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-800 font-bold text-base">Amount Paid</span>
              <span className="font-extrabold text-2xl text-purple-600">₹{totalAmount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setRoute('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentSuccess;
