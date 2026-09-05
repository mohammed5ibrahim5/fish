import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { ToastProvider } from '@/components/Toast';

// Storefront Components & Pages
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AICaptainChat from '@/components/AICaptainChat';

import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import AccountPage from '@/pages/AccountPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';

// New Advanced Feature Pages
import ComboBuilderPage from '@/pages/ComboBuilderPage';
import FishGuidePage from '@/pages/FishGuidePage';
import TripsPage from '@/pages/TripsPage';
import CommunityPage from '@/pages/CommunityPage';

// Admin Components & Pages
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminProducts from '@/pages/admin/AdminProducts';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminUsers from '@/pages/admin/AdminUsers';

// Storefront Public Layout
function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-ocean-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <AICaptainChat />
    </div>
  );
}

// Protected Admin Route Guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-ocean-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route element={<StorefrontLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/combo-builder" element={<ComboBuilderPage />} />
                    <Route path="/fish-guide" element={<FishGuidePage />} />
                    <Route path="/trips" element={<TripsPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/account" element={<AccountPage />} />
                  </Route>

                  {/* Protected Admin Routes */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminLayout />
                      </AdminRoute>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
