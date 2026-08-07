import React from 'react';
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
import useStore from './store/useStore';

function App() {
  const { currentRoute, isAuthenticated, user } = useStore();

  if (!isAuthenticated) return <Login />;

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
    </>
  );
}

export default App;
