import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { logout } from '../store/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  useEffect(() => {
    // Slide navbar down on mount
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );
    // Spin logo once
    gsap.fromTo(logoRef.current,
      { rotation: -180, opacity: 0 },
      { rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.3 }
    );
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav ref={navRef} style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span ref={logoRef} style={styles.logo}>⚙️</span>
        <span style={styles.brandText}>DevOps<span style={styles.brandAccent}>Shop</span></span>
      </Link>

      <div style={styles.links}>
        <Link to="/products" style={styles.link}>Products</Link>

        {user ? (
          <>
            <Link to="/cart" style={styles.link}>
              Cart
              {cartCount > 0 && (
                <span style={styles.badge}>{cartCount}</span>
              )}
            </Link>
            <Link to="/orders" style={styles.link}>Orders</Link>
            <span style={styles.username}>@{user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    height: '65px',
    background: 'rgba(2, 8, 23, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #1e3a5f',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    fontSize: '1.5rem',
    display: 'inline-block',
  },
  brandText: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#e2f4ff',
    letterSpacing: '1px',
  },
  brandAccent: {
    color: '#00d4ff',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  link: {
    color: '#8ba8c4',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'color 0.2s',
    position: 'relative',
  },
  badge: {
    background: '#00d4ff',
    color: '#020817',
    borderRadius: '50%',
    padding: '2px 7px',
    fontSize: '0.7rem',
    fontWeight: '700',
    marginLeft: '5px',
  },
  username: {
    color: '#00ff88',
    fontSize: '0.9rem',
    fontWeight: '600',
    fontFamily: 'JetBrains Mono, monospace',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #ff4757',
    color: '#ff4757',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  registerBtn: {
    background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
    color: '#020817',
    padding: '7px 18px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.85rem',
  },
};
