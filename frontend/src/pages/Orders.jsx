import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import API from '../utils/api';

const statusColors = {
  pending:   { bg: 'rgba(251,191,36,0.1)',  border: '#fbbf24', color: '#fbbf24' },
  confirmed: { bg: 'rgba(59,130,246,0.1)',  border: '#3b82f6', color: '#3b82f6' },
  shipped:   { bg: 'rgba(124,58,237,0.1)',  border: '#7c3aed', color: '#7c3aed' },
  delivered: { bg: 'rgba(0,255,136,0.1)',   border: '#00ff88', color: '#00ff88' },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardsRef = useRef([]);

  useEffect(() => {
    API.get('/orders/').then(({ data }) => {
      setOrders(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      gsap.fromTo(cardsRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [orders]);

  if (loading) return <p style={{ padding: '2rem', color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace' }}>Loading orders...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Orders</h2>
      {orders.length === 0 ? (
        <p style={styles.empty}>No orders yet.</p>
      ) : (
        <div style={styles.list}>
          {orders.map((order, i) => {
            const sc = statusColors[order.status] || statusColors.pending;
            return (
              <div key={order.id} ref={(el) => (cardsRef.current[i] = el)} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.orderId}>Order #{order.id}</span>
                  <span style={{ ...styles.status, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div style={styles.items}>
                  {order.items.map((item, j) => (
                    <p key={j} style={styles.item}>
                      {item.name} × {item.qty}
                      <span style={{ color: '#00d4ff', marginLeft: '8px' }}>
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </p>
                  ))}
                </div>
                <div style={styles.cardFooter}>
                  <span style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</span>
                  <span style={styles.total}>Total: ${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#e2f4ff', marginBottom: '2rem' },
  empty: { color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#0d1b2a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e3a5f' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  orderId: { fontWeight: '700', color: '#e2f4ff', fontFamily: 'JetBrains Mono, monospace' },
  status: { padding: '4px 12px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' },
  items: { borderTop: '1px solid #1e3a5f', paddingTop: '0.75rem', marginBottom: '0.75rem' },
  item: { color: '#8ba8c4', fontSize: '0.9rem', marginBottom: '4px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #1e3a5f', paddingTop: '0.75rem' },
  date: { color: '#8ba8c4', fontSize: '0.8rem', fontFamily: 'JetBrains Mono, monospace' },
  total: { fontWeight: '700', color: '#00d4ff' },
};
