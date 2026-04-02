import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { clearCart } from '../store/slices/cartSlice';
import API from '../utils/api';

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((s) => s.cart);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );
  }, []);

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/orders/', {
        items: items.map((i) => ({ product_id: i.product_id, qty: i.qty, price: i.price })),
        shipping_address: address,
      });
      dispatch(clearCart());
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.detail || 'Order failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Checkout</h2>
      <div ref={formRef} style={styles.layout}>
        <form onSubmit={handleOrder} style={styles.form}>
          <h3 style={styles.sectionTitle}>Shipping Address</h3>
          {error && <div style={styles.error}>{error}</div>}
          <textarea
            required rows={4} style={styles.textarea}
            placeholder="Enter your full shipping address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" disabled={loading || items.length === 0} style={styles.btn}>
            {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </form>

        <div style={styles.summary}>
          <h3 style={styles.sectionTitle}>Order Summary</h3>
          {items.map((item) => (
            <div key={item.product_id} style={styles.row}>
              <span>{item.name} × {item.qty}</span>
              <span style={{ color: '#00d4ff' }}>${(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
          <hr style={styles.hr} />
          <div style={{ ...styles.row, fontWeight: '700', color: '#00d4ff' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#e2f4ff', marginBottom: '2rem' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  sectionTitle: { color: '#e2f4ff', fontWeight: '600', marginBottom: '0.5rem' },
  error: { background: 'rgba(255,71,87,0.1)', border: '1px solid #ff4757', color: '#ff4757', padding: '10px', borderRadius: '8px', fontSize: '0.9rem' },
  textarea: { padding: '12px', background: '#0d1b2a', border: '1px solid #1e3a5f', borderRadius: '8px', color: '#e2f4ff', fontSize: '1rem', resize: 'vertical', outline: 'none' },
  btn: { background: 'linear-gradient(135deg, #00ff88, #00d4ff)', color: '#020817', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' },
  summary: { background: '#0d1b2a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1e3a5f', height: 'fit-content' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#8ba8c4', fontSize: '0.9rem' },
  hr: { border: 'none', borderTop: '1px solid #1e3a5f', margin: '1rem 0' },
};
