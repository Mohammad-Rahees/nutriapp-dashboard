import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Apple, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { forgotPassword, setRoute } = useStore();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = (val) => {
    return /^\S+@\S+\.\S+$/.test(val.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);

    if (res && res.success) {
      setSuccessMessage(res.message || 'If the email exists, a reset link has been sent.');
      setEmail('');
    } else {
      setError(res?.message || 'Failed to process request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left AD / Hero Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1400" 
            alt="Healthy nutritious bowl" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent"></div>
        </div>

        <div className="relative z-10 p-12 lg:p-20 text-white">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
              <Apple className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight">NutriApp</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4 text-white">
            Reset Password.<br/>
            <span className="text-purple-400">Back on track.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed">
            Enter your registered email address and we'll send you a secure link to reset your account password.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50/50 p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-md">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-800 tracking-tight">NutriApp</span>
          </div>

          <button
            onClick={() => setRoute('login')}
            className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </button>

          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
              Forgot Password?
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Enter the email address associated with your Customer, Admin, or Delivery account.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-semibold">{successMessage}</div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-semibold">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium placeholder-gray-400" 
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-purple-600 hover:bg-opacity-90 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md flex justify-center items-center gap-2 hover:-translate-y-0.5"
            >
              {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 font-medium text-sm">
              Remember your password?{' '}
              <button 
                type="button"
                onClick={() => setRoute('login')} 
                className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
