import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { fetchProducts } from '../store/slices/productSlice';
import Spinner from '../components/Spinner';

export default function Products() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.products);
  const cardsRef = useRef([]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (items.length > 0) {
      gsap.fromTo(cardsRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, [items]);

  if (loading) return <Spinner />;
  if (error) return <p style={{ padding: '2rem', color: '#ff4757' }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>All Products</h2>
        <p style={styles.subtitle}>{items.length} items available</p>
      </div>

      {items.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyText}>No products yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {items.map((p, i) => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              ref={(el) => (cardsRef.current[i] = el)}
              style={styles.card}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { y: -8, duration: 0.3, ease: 'power2.out' });
                gsap.to(e.currentTarget, { boxShadow: '0 20px 40px rgba(0,212,255,0.2), 0 0 0 1px #00d4ff', duration: 0.3 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { y: 0, duration: 0.3, ease: 'power2.out' });
                gsap.to(e.currentTarget, { boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px #1e3a5f', duration: 0.3 });
              }}
            >
              <div style={styles.imgBox}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={styles.img} />
                  : <span style={styles.placeholder}>📦</span>}
              </div>
              <div style={styles.info}>
                <span style={styles.category}>{p.category || 'General'}</span>
                <h3 style={styles.name}>{p.name}</h3>
                <div style={styles.footer}>
                  <span style={styles.price}>${p.price.toFixed(2)}</span>
                  <span style={p.stock > 0 ? styles.inStock : styles.outStock}>
                    {p.stock > 0 ? `${p.stock} left` : 'Out of stock'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  title: { fontSize: '2rem', fontWeight: '700', color: '#e2f4ff', marginBottom: '0.5rem' },
  subtitle: { color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' },
  card: {
    background: '#0d1b2a', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px #1e3a5f',
    display: 'block', transition: 'none', cursor: 'pointer',
  },
  imgBox: { height: '180px', background: '#112240', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { fontSize: '3rem' },
  info: { padding: '1.2rem' },
  category: { fontSize: '0.72rem', color: '#00d4ff', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' },
  name: { fontSize: '1rem', color: '#e2f4ff', margin: '0.5rem 0', fontWeight: '600' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' },
  price: { fontSize: '1.3rem', fontWeight: '700', color: '#00d4ff' },
  inStock: { fontSize: '0.75rem', color: '#00ff88', fontFamily: 'JetBrains Mono, monospace' },
  outStock: { fontSize: '0.75rem', color: '#ff4757', fontFamily: 'JetBrains Mono, monospace' },
  empty: { textAlign: 'center', padding: '5rem' },
  emptyText: { color: '#8ba8c4', fontSize: '1.1rem' },
};
