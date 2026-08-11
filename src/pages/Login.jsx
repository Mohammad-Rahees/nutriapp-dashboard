import React, { useState } from 'react';
import useStore from '../store/useStore';
import { Apple, ArrowRight, Lock, User, UserPlus } from 'lucide-react';

const Login = () => {
  const { login, signup, authError, setRoute } = useStore();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please properly enter a username and password.');
      return;
    }

    setLoading(true);
    let res;
    if (isSignUpMode) {
      res = await signup(username, password, name || username);
    } else {
      res = await login(username, password);
    }
    setLoading(false);

    if (res && !res.success) {
      setError(res.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left AD / Hero Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1400" 
            alt="Healthy gorgeous food" 
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
            Fuel your day.<br/>
            <span className="text-purple-400">The delicious way.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md leading-relaxed">
            Experience the simplest way to order premium, macro-balanced foods directly to your door. Join thousands of users prioritizing health without compromising on taste.
          </p>
        </div>
      </div>

      {/* Right Login / Sign Up Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50/50 p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-8 lg:hidden justify-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-md">
              <Apple className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl text-gray-800 tracking-tight">NutriApp</span>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight mb-2">
              {isSignUpMode ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 font-medium">
              {isSignUpMode ? 'Sign up to start your healthy meal journey.' : 'Please sign in to access your dashboard.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUpMode && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium placeholder-gray-400" 
                    placeholder="e.g. John Doe" 
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium placeholder-gray-400" 
                  placeholder="e.g. admin" 
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                {!isSignUpMode && (
                  <button 
                    type="button" 
                    onClick={() => setRoute('forgot-password')} 
                    className="flex-shrink-0 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all font-medium placeholder-gray-400" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            {(error || authError) && (
              <p className="text-rose-500 text-sm font-medium pt-1">{error || authError}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 bg-purple-600 hover:bg-opacity-90 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-md flex justify-center items-center gap-2 hover:-translate-y-0.5"
            >
              {loading ? 'Authenticating...' : (isSignUpMode ? 'Sign Up (Customer)' : 'Sign In')}
              {!loading && (isSignUpMode ? <UserPlus className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />)}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 font-medium text-sm">
              {isSignUpMode ? (
                <>
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => { setIsSignUpMode(false); setError(''); }} 
                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => { setIsSignUpMode(true); setError(''); }} 
                    className="text-purple-600 font-bold hover:text-purple-700 transition-colors"
                  >
                    Sign up for free
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
