import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Spinner from './components/Spinner';

const Products    = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart        = React.lazy(() => import('./pages/Cart'));
const Checkout    = React.lazy(() => import('./pages/Checkout'));
const Orders      = React.lazy(() => import('./pages/Orders'));
const Login       = React.lazy(() => import('./pages/Login'));
const Register    = React.lazy(() => import('./pages/Register'));

function PrivateRoute({ children }) {
  const { token } = useSelector((s) => s.auth);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <React.Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart"     element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders"   element={<PrivateRoute><Orders /></PrivateRoute>} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
