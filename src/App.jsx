import React from 'react';
import Dashboard from './pages/Dashboard';
import HealthOverview from './pages/HealthOverview';
import Categories from './pages/Categories';
import Order from './pages/Order';
import ProfileSettings from './pages/ProfileSettings';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import useStore from './store/useStore';

function App() {
  const { currentRoute, isAuthenticated } = useStore();

  if (!isAuthenticated) return <Login />;

  return (
    <>
      {currentRoute === 'dashboard' && <Dashboard />}
      {currentRoute === 'overview' && <HealthOverview />}
      {currentRoute === 'categories' && <Categories />}
      {currentRoute === 'order' && <Order />}
      {currentRoute === 'profile' && <ProfileSettings />}
      {currentRoute === 'about' && <AboutUs />}
      {currentRoute === 'contact' && <ContactUs />}
    </>
  );
}

export default App;
