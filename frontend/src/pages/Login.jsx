import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { loginUser, clearError } from '../store/slices/authSlice';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const formRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (token) navigate('/products');
    dispatch(clearError());
    gsap.fromTo(formRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
    gsap.fromTo(titleRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (error && formRef.current) {
      gsap.fromTo(formRef.current,
        { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)', repeat: 3 }
      );
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div style={styles.page}>
      <div style={styles.bg} />
      <h2 ref={titleRef} style={styles.title}>Welcome Back</h2>
      <div ref={formRef} style={styles.card}>
        <p style={styles.subtitle}>Sign in to DevOps Shop</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" required style={styles.input}
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={(e) => gsap.to(e.target, { boxShadow: '0 0 0 2px #00d4ff', duration: 0.2 })}
              onBlur={(e) => gsap.to(e.target, { boxShadow: 'none', duration: 0.2 })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" required style={styles.input}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={(e) => gsap.to(e.target, { boxShadow: '0 0 0 2px #00d4ff', duration: 0.2 })}
              onBlur={(e) => gsap.to(e.target, { boxShadow: 'none', duration: 0.2 })}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <p style={styles.footer}>
          No account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: '2rem', position: 'relative' },
  bg: { position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, #0d2137 0%, #020817 70%)', zIndex: -1 },
  title: { fontSize: '2rem', fontWeight: '700', color: '#e2f4ff', marginBottom: '1.5rem', textAlign: 'center' },
  card: { background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  subtitle: { color: '#8ba8c4', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' },
  error: { background: 'rgba(255,71,87,0.1)', border: '1px solid #ff4757', color: '#ff4757', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#8ba8c4' },
  input: { padding: '12px', background: '#112240', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e2f4ff', fontSize: '1rem', outline: 'none' },
  btn: { background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#020817', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#8ba8c4', fontSize: '0.9rem' },
  link: { color: '#00d4ff' },
};
