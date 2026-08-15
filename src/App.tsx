import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { StoreLayout } from './components/layout/StoreLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminGate } from './components/admin/AdminGate';
import { Home } from './pages/Home';
import { Collections } from './pages/Collections';
import { CategoryPage } from './pages/CategoryPage';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { Account } from './pages/Account';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CustomRequest } from './pages/CustomRequest';
import { TrackOrder } from './pages/TrackOrder';
import { NotFound } from './pages/NotFound';
import { Dashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminOrderDetail } from './pages/admin/AdminOrderDetail';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminCustomRequests } from './pages/admin/AdminCustomRequests';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Routes>
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/account" element={<Account />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/custom-request" element={<CustomRequest />} />
                <Route path="/track" element={<TrackOrder />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/admin"
                element={
                <AdminGate>
                    <AdminLayout />
                  </AdminGate>
                }>
                
                <Route index element={<Dashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetail />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="custom-requests" element={<AdminCustomRequests />} />
              </Route>
            </Routes>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>);

}