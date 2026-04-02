import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { fetchCart, removeFromCart } from '../store/slices/cartSlice';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((s) => s.cart);
  const itemsRef = useRef([]);
  const totalRef = useRef(null);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      gsap.fromTo(itemsRef.current,
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [items]);

  const handleRemove = (productId, el) => {
    gsap.to(el, {
      x: 100, opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: () => dispatch(removeFromCart(productId))
    });
  };

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>🛒</span>
        <p style={styles.emptyText}>Your cart is empty</p>
        <button onClick={() => navigate('/products')} style={styles.shopBtn}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Your Cart</h2>
      <div style={styles.layout}>
        <div style={styles.items}>
          {items.map((item, i) => (
            <div
              key={item.product_id}
              ref={(el) => (itemsRef.current[i] = el)}
              style={styles.item}
            >
              <div style={styles.itemIcon}>📦</div>
              <div style={styles.itemInfo}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemMeta}>
                  {item.qty} × ${item.price.toFixed(2)}
                </p>
              </div>
              <div style={styles.itemRight}>
                <p style={styles.itemTotal}>${(item.qty * item.price).toFixed(2)}</p>
                <button
                  onClick={(e) => handleRemove(item.product_id, e.currentTarget.closest('[data-item]') || itemsRef.current[i])}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Items ({items.reduce((s, i) => s + i.qty, 0)})</span>
            <span ref={totalRef}>${total.toFixed(2)}</span>
          </div>
          <hr style={styles.hr} />
          <div style={{ ...styles.summaryRow, fontWeight: '700', color: '#00d4ff' }}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} style={styles.checkoutBtn}>
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#e2f4ff', marginBottom: '2rem' },
  layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' },
  items: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  item: { display: 'flex', alignItems: 'center', gap: '1rem', background: '#0d1b2a', padding: '1.2rem', borderRadius: '12px', border: '1px solid #1e3a5f' },
  itemIcon: { fontSize: '2rem' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '600', color: '#e2f4ff', marginBottom: '4px' },
  itemMeta: { color: '#8ba8c4', fontSize: '0.85rem', fontFamily: 'JetBrains Mono, monospace' },
  itemRight: { textAlign: 'right' },
  itemTotal: { fontWeight: '700', color: '#00d4ff', fontSize: '1.1rem', marginBottom: '4px' },
  removeBtn: { background: 'none', border: 'none', color: '#ff4757', fontSize: '0.8rem', cursor: 'pointer' },
  summary: { background: '#0d1b2a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1e3a5f', height: 'fit-content' },
  summaryTitle: { color: '#e2f4ff', marginBottom: '1rem', fontWeight: '600' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#8ba8c4' },
  hr: { border: 'none', borderTop: '1px solid #1e3a5f', margin: '1rem 0' },
  checkoutBtn: { width: '100%', background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#020817', border: 'none', padding: '13px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', marginTop: '1rem', cursor: 'pointer' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' },
  emptyIcon: { fontSize: '4rem' },
  emptyText: { color: '#8ba8c4', fontSize: '1.2rem' },
  shopBtn: { background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#020817', border: 'none', padding: '12px 28px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' },
};
