import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { registerUser, clearError } from '../store/slices/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [success, setSuccess] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    dispatch(clearError());
    gsap.fromTo(formRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
    );
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser(form));
    if (!result.error) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div style={styles.page}>
      <div ref={formRef} style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join DevOps Shop</p>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.successMsg}>Account created! Redirecting...</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          {['email', 'username', 'password'].map((field) => (
            <div key={field} style={styles.fieldGroup}>
              <label style={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                required style={styles.input}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                onFocus={(e) => gsap.to(e.target, { boxShadow: '0 0 0 2px #00d4ff', duration: 0.2 })}
                onBlur={(e) => gsap.to(e.target, { boxShadow: 'none', duration: 0.2 })}
              />
            </div>
          ))}
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating...' : 'Create Account →'}
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 65px)', padding: '2rem' },
  card: { background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '420px' },
  title: { fontSize: '1.8rem', fontWeight: '700', color: '#e2f4ff', marginBottom: '0.5rem' },
  subtitle: { color: '#8ba8c4', marginBottom: '1.5rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' },
  error: { background: 'rgba(255,71,87,0.1)', border: '1px solid #ff4757', color: '#ff4757', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  successMsg: { background: 'rgba(0,255,136,0.1)', border: '1px solid #00ff88', color: '#00ff88', padding: '10px', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.2rem' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#8ba8c4' },
  input: { padding: '12px', background: '#112240', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e2f4ff', fontSize: '1rem', outline: 'none' },
  btn: { background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', marginTop: '0.5rem' },
  footer: { textAlign: 'center', marginTop: '1.5rem', color: '#8ba8c4', fontSize: '0.9rem' },
  link: { color: '#00d4ff' },
};
