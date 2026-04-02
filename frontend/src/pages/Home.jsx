import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const devopsIcons = [
  { icon: '🐳', label: 'Docker',     x: '10%', y: '20%', anim: 'float'  },
  { icon: '☸️', label: 'Kubernetes', x: '85%', y: '15%', anim: 'rotate' },
  { icon: '🐧', label: 'Linux',      x: '75%', y: '70%', anim: 'wobble' },
  { icon: '⚙️', label: 'Jenkins',    x: '15%', y: '75%', anim: 'spin'   },
  { icon: '🐍', label: 'Python',     x: '88%', y: '45%', anim: 'float'  },
  { icon: '⚛️', label: 'React',      x: '5%',  y: '50%', anim: 'rotate' },
];

export default function Home() {
  const heroRef    = useRef(null);
  const titleRef   = useRef(null);
  const subRef     = useRef(null);
  const ctaRef     = useRef(null);
  const iconsRef   = useRef([]);
  const particlesRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Hero fades in
    tl.fromTo(heroRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    // 2. Title types itself out
    .fromTo(titleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.1 }
    )
    .to(titleRef.current, {
      duration: 2,
      text: 'The DevOps Shop',
      ease: 'none',
    })
    // 3. Subtitle slides up
    .fromTo(subRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.3'
    )
    // 4. CTA button pops in
    .fromTo(ctaRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.2'
    )
    // 5. Icons fly in from edges
    .fromTo(iconsRef.current,
      { scale: 0, opacity: 0, rotation: -180 },
      {
        scale: 1, opacity: 1, rotation: 0,
        duration: 0.6, stagger: 0.1,
        ease: 'back.out(1.7)'
      },
      '-=0.3'
    );

    // Continuous icon animations
    iconsRef.current.forEach((el, i) => {
      if (!el) return;
      const anim = devopsIcons[i].anim;

      if (anim === 'float') {
        gsap.to(el, {
          y: -20, duration: 2 + i * 0.3,
          repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
      } else if (anim === 'rotate') {
        gsap.to(el, {
          rotation: 360, duration: 8 + i,
          repeat: -1, ease: 'none'
        });
      } else if (anim === 'wobble') {
        gsap.to(el, {
          x: 15, duration: 1.5 + i * 0.2,
          repeat: -1, yoyo: true, ease: 'sine.inOut'
        });
      } else if (anim === 'spin') {
        gsap.to(el, {
          rotation: 360, duration: 4,
          repeat: -1, ease: 'none'
        });
      }
    });

    // CTA pulse glow
    gsap.to(ctaRef.current, {
      boxShadow: '0 0 30px #00d4ff, 0 0 60px #0066ff',
      duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
      delay: 2
    });

  }, []);

  return (
    <div ref={heroRef} style={styles.hero}>

      {/* Floating DevOps Icons */}
      {devopsIcons.map((item, i) => (
        <div
          key={item.label}
          ref={(el) => (iconsRef.current[i] = el)}
          style={{ ...styles.floatingIcon, left: item.x, top: item.y }}
        >
          <span style={styles.iconEmoji}>{item.icon}</span>
          <span style={styles.iconLabel}>{item.label}</span>
        </div>
      ))}

      {/* Grid overlay */}
      <div style={styles.grid} />

      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.badge}>
          <span style={styles.badgeDot} />
          Full Stack DevOps Platform
        </div>

        <h1 ref={titleRef} style={styles.title}>&nbsp;</h1>

        <p ref={subRef} style={styles.subtitle}>
          Built with FastAPI · React · PostgreSQL · Redis · Docker · Kubernetes · Jenkins
        </p>

        <Link ref={ctaRef} to="/products" style={styles.cta}>
          Browse Products →
        </Link>

        {/* Tech stack pills */}
        <div style={styles.pills}>
          {['Python', 'React', 'PostgreSQL', 'Redis', 'Docker', 'K8s', 'Jenkins'].map((t) => (
            <span key={t} style={styles.pill}>{t}</span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gridMove {
          from { transform: perspective(500px) rotateX(30deg) translateY(0); }
          to   { transform: perspective(500px) rotateX(30deg) translateY(40px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  hero: {
    minHeight: 'calc(100vh - 65px)',
    background: 'radial-gradient(ellipse at 20% 50%, #0d2137 0%, #020817 60%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    animation: 'gridMove 4s linear infinite',
    pointerEvents: 'none',
  },
  floatingIcon: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    pointerEvents: 'none',
    zIndex: 1,
  },
  iconEmoji: {
    fontSize: '2.5rem',
    filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))',
    display: 'block',
  },
  iconLabel: {
    fontSize: '0.65rem',
    color: '#8ba8c4',
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '1px',
  },
  content: {
    textAlign: 'center',
    zIndex: 2,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(0,212,255,0.1)',
    border: '1px solid rgba(0,212,255,0.3)',
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    color: '#00d4ff',
    fontFamily: 'JetBrains Mono, monospace',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#00ff88',
    boxShadow: '0 0 8px #00ff88',
    animation: 'blink 1.5s ease-in-out infinite',
    display: 'inline-block',
  },
  title: {
    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #e2f4ff 0%, #00d4ff 50%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.1,
    minHeight: '1.2em',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#8ba8c4',
    maxWidth: '600px',
    lineHeight: 1.8,
    fontFamily: 'JetBrains Mono, monospace',
  },
  cta: {
    background: 'linear-gradient(135deg, #0066ff, #00d4ff)',
    color: '#020817',
    padding: '14px 36px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 0 20px rgba(0,212,255,0.3)',
    transition: 'transform 0.2s',
    display: 'inline-block',
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '0.5rem',
  },
  pill: {
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.3)',
    color: '#3b82f6',
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.78rem',
    fontFamily: 'JetBrains Mono, monospace',
  },
};
