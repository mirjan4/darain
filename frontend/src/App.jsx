import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';

// Default Theme Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import AboutUs from './pages/AboutUs';

// Modern Theme Pages
import ModernLayout from './themes/modern/ModernLayout';
import ModernHome from './themes/modern/ModernHome';
import ModernCollections from './themes/modern/ModernCollections';

// Dynamic Theme Pages
import DynamicLayout from './themes/dynamic/DynamicLayout';
import DynamicHome from './themes/dynamic/DynamicHome';
import DynamicCollections from './themes/dynamic/DynamicCollections';
import DynamicContact from './themes/dynamic/DynamicContact';

// Admin Pages
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import AdminProducts from './admin/AdminProducts';
import ProductForm from './admin/ProductForm';
import AdminEnquiries from './admin/AdminEnquiries';
import AdminSettings from './admin/AdminSettings';
import ScrollToTop from './components/ScrollToTop';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" />;
};

// Theme Router - dynamically swaps out the UI based on Admin settings
const ThemeRouter = () => {
    const { theme, brand_name } = useSettings();
    const activeTheme = theme || 'default';
    const isModern = activeTheme === 'modern';
    const isDynamic = activeTheme === 'dynamic';

    console.log(`[Darain Theme] Active: ${activeTheme}`);

    React.useEffect(() => {
        if (brand_name) document.title = brand_name;
    }, [brand_name]);

    // Theme components Mapping
    const ActiveLayout = isDynamic ? DynamicLayout : (isModern ? ModernLayout : Layout);
    const ActiveHome = isDynamic ? DynamicHome : (isModern ? ModernHome : Home);
    
    // Note: If you want to create Modern product pages, add them here.
    // For now, they fallback to the default content pages wrapped in the modern layout!
    const ActiveCollections = isDynamic ? DynamicCollections : (isModern ? ModernCollections : Collections); 
    const ActiveContact = isDynamic ? DynamicContact : Home; // Fallback to Home if default contact doesn't exist
    const ActiveProductDetails = ProductDetails;
    const ActiveAboutUs = AboutUs;

    return (
        <Routes>
            {/* Public Themed Routes */}
            <Route path="/" element={<ActiveLayout><ActiveHome /></ActiveLayout>} />
            <Route path="/collections" element={<ActiveLayout><ActiveCollections /></ActiveLayout>} />
            <Route path="/collections/:category" element={<ActiveLayout><ActiveCollections /></ActiveLayout>} />
            <Route path="/product/:id" element={<ActiveLayout><ActiveProductDetails /></ActiveLayout>} />
            <Route path="/about" element={<ActiveLayout><ActiveAboutUs /></ActiveLayout>} />
            <Route path="/contact" element={<ActiveLayout><ActiveContact /></ActiveLayout>} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes (Same regardless of store theme) */}
            <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
            <Route path="/admin/products" element={<ProtectedRoute><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/add-product" element={<ProtectedRoute><AdminLayout><ProductForm /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/edit-product/:id" element={<ProtectedRoute><AdminLayout><ProductForm /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/enquiries" element={<ProtectedRoute><AdminLayout><AdminEnquiries /></AdminLayout></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
        </Routes>
    );
};

function App() {
  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-in-out',
      offset: 100,
    });
  }, []);

  return (
    <SettingsProvider>
        <Router>
            <Toaster position="top-right" />
            <ThemeRouter />
            <ScrollToTop />
        </Router>
    </SettingsProvider>
  );
}

export default App;
