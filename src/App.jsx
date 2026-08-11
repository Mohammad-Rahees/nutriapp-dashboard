import React, { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import HealthOverview from './pages/HealthOverview';
import Categories from './pages/Categories';
import Order from './pages/Order';
import ProfileSettings from './pages/ProfileSettings';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import useStore from './store/useStore';

function App() {
  const { currentRoute, isAuthenticated, user, setResetToken, setRoute } = useStore();

  // Detect password reset token from URL on mount
  useEffect(() => {
    const hash = window.location.hash || '';
    const searchParams = new URLSearchParams(window.location.search);
    let token = '';

    if (hash.includes('reset-password/')) {
      const parts = hash.split('reset-password/');
      token = parts[1] ? parts[1].split('?')[0].split('/')[0] : '';
    } else if (searchParams.get('token') || searchParams.get('resetToken')) {
      token = searchParams.get('token') || searchParams.get('resetToken');
    }

    if (token) {
      setResetToken(token);
      setRoute('reset-password');
    }
  }, [setResetToken, setRoute]);

  if (!isAuthenticated) {
    if (currentRoute === 'forgot-password') return <ForgotPassword />;
    if (currentRoute === 'reset-password') return <ResetPassword />;
    return <Login />;
  }

  // Role based route guards
  const isAdminRoute = currentRoute === 'admin';
  const isAuthorizedAdmin = user?.role === 'Admin';

  const isDeliveryRoute = currentRoute === 'delivery';
  const isAuthorizedDelivery = user?.role === 'Delivery';

  return (
    <>
      {isAdminRoute && isAuthorizedAdmin && <AdminDashboard />}
      {isAdminRoute && !isAuthorizedAdmin && <Dashboard />}

      {isDeliveryRoute && isAuthorizedDelivery && <DeliveryDashboard />}
      {isDeliveryRoute && !isAuthorizedDelivery && <Dashboard />}

      {currentRoute === 'dashboard' && (user?.role === 'Delivery' ? <DeliveryDashboard /> : <Dashboard />)}
      {currentRoute === 'overview' && <HealthOverview />}
      {currentRoute === 'categories' && <Categories />}
      {currentRoute === 'order' && <Order />}
      {currentRoute === 'payment-success' && <PaymentSuccess />}
      {currentRoute === 'payment-failed' && <PaymentFailed />}
      {currentRoute === 'profile' && <ProfileSettings />}
      {currentRoute === 'about' && <AboutUs />}
      {currentRoute === 'contact' && <ContactUs />}
      {currentRoute === 'forgot-password' && <ForgotPassword />}
      {currentRoute === 'reset-password' && <ResetPassword />}
    </>
  );
}

export default App;
