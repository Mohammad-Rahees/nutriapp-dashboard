import React from 'react';
import Dashboard from './pages/Dashboard';
import HealthOverview from './pages/HealthOverview';
import Categories from './pages/Categories';
import Order from './pages/Order';
import ProfileSettings from './pages/ProfileSettings';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Login from './pages/Login';
import useStore from './store/useStore';

function App() {
  const { currentRoute, isAuthenticated, user } = useStore();

  if (!isAuthenticated) return <Login />;

  // Prevent non-admin users from viewing admin pages
  const isAdminRoute = currentRoute === 'admin';
  const isAuthorizedAdmin = user?.role === 'Admin';

  return (
    <>
      {isAdminRoute && isAuthorizedAdmin ? (
        <AdminDashboard />
      ) : (
        currentRoute === 'admin' && <Dashboard />
      )}
      {currentRoute === 'dashboard' && <Dashboard />}
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
