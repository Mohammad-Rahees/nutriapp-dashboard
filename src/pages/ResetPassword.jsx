import React, { useState, useEffect } from 'react';
import useStore from '../store/useStore';
import { Apple, Lock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const ResetPassword = () => {
  const { resetPassword, resetToken, setRoute } = useStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Extract token from URL hash or search params if not set in state
  const getTokenFromUrl = () => {
    if (resetToken) return resetToken;

    // Check hash format #reset-password/:token
    const hash = window.location.hash || '';
    if (hash.includes('reset-password/')) {
      const parts = hash.split('reset-password/');
      return parts[1] ? parts[1].split('?')[0].split('/')[0] : '';
    }

    // Check query params ?token=:token
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('token') || searchParams.get('resetToken') || '';
  };

  const currentToken = getTokenFromUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!currentToken) {
      setError('Missing password reset token. Please request a new reset link.');
      return;
    }

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(currentToken, password);
    setLoading(false);

    if (res && res.success) {
      setSuccessMessage(res.message || 'Password reset successfully. Please login.');
      setPassword('');
      setConfirmPassword('');
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        setRoute('login');
      }, 3000);
    } else {
      setError(res?.message || 'Failed to reset password. Link may be expired or invalid.');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left AD / Hero Panel */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1400" 
            alt="Healthy fresh food" 
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
            Set New Password.<br/>
            <span className="text-purple-400">Secure & Simple.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed">
            Choose a strong password with at least 8 characters to secure your NutriApp account.
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

          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-500 font-medium text-sm">
              Please enter and confirm your new password below.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col gap-3 text-emerald-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm font-bold">{successMessage}</div>
              </div>
              <button
                onClick={() => setRoute('login')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-1"
              >
                Go to Sign In <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-semibold">{error}</div>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    autoFocus
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium placeholder-gray-400" 
                    placeholder="At least 8 characters" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium placeholder-gray-400" 
                    placeholder="Re-enter new password" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-4 bg-purple-600 hover:bg-opacity-90 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md flex justify-center items-center gap-2 hover:-translate-y-0.5"
              >
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-500 font-medium text-sm">
              Back to{' '}
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

export default ResetPassword;
