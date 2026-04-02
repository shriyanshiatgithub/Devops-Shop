import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import Spinner from '../components/Spinner';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: product, loading } = useSelector((s) => s.products);
  const { token } = useSelector((s) => s.auth);
  const imgRef = useRef(null);
  const detailRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => { dispatch(fetchProduct(id)); }, [dispatch, id]);

  useEffect(() => {
    if (product) {
      gsap.fromTo(imgRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
      gsap.fromTo(detailRef.current,
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!token) { navigate('/login'); return; }
    dispatch(addToCart({ product_id: product.id, qty: 1, price: product.price, name: product.name }));
    gsap.fromTo(btnRef.current,
      { scale: 0.95 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' }
    );
    gsap.to(btnRef.current, {
      boxShadow: '0 0 30px #00ff88', duration: 0.3,
      yoyo: true, repeat: 1
    });
  };

  if (loading || !product) return <Spinner />;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.back}>← Back</button>
      <div style={styles.grid}>
        <div ref={imgRef} style={styles.imgBox}>
          {product.image_url
            ? <img src={product.image_url} alt={product.name} style={styles.img} />
            : <span style={styles.placeholder}>📦</span>}
        </div>
        <div ref={detailRef} style={styles.details}>
          <span style={styles.category}>{product.category || 'General'}</span>
          <h1 style={styles.name}>{product.name}</h1>
          <p style={styles.price}>${product.price.toFixed(2)}</p>
          <p style={styles.desc}>{product.description || 'No description available.'}</p>
          <p style={product.stock > 0 ? styles.inStock : styles.outStock}>
            {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
          </p>
          <button
            ref={btnRef}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            style={{ ...styles.btn, opacity: product.stock === 0 ? 0.5 : 1 }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  back: { background: 'none', border: 'none', color: '#00d4ff', fontSize: '1rem', marginBottom: '1.5rem', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' },
  imgBox: { background: '#0d1b2a', borderRadius: '16px', height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1e3a5f' },
  img: { width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' },
  placeholder: { fontSize: '5rem' },
  details: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  category: { fontSize: '0.75rem', color: '#00d4ff', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' },
  name: { fontSize: '2rem', color: '#e2f4ff', fontWeight: '700' },
  price: { fontSize: '2.2rem', fontWeight: '700', color: '#00d4ff' },
  desc: { color: '#8ba8c4', lineHeight: 1.7 },
  inStock: { color: '#00ff88', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem' },
  outStock: { color: '#ff4757', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem' },
  btn: { background: 'linear-gradient(135deg, #0066ff, #00d4ff)', color: '#020817', border: 'none', padding: '14px 28px', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', width: 'fit-content' },
};
