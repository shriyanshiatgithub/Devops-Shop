import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const PIPELINE_NODES = [
  { id: 'dev',     label: 'Dev',     icon: '💻', color: '#38bdf8', desc: 'Write code in WSL2' },
  { id: 'git',     label: 'Git',     icon: '🔀', color: '#a78bfa', desc: 'Push to GitHub' },
  { id: 'jenkins', label: 'Jenkins', icon: '⚙️', color: '#f59e0b', desc: 'CI/CD pipeline' },
  { id: 'docker',  label: 'Docker',  icon: '🐳', color: '#38bdf8', desc: 'Build & push image' },
  { id: 'k8s',     label: 'K8s',     icon: '☸️', color: '#a78bfa', desc: 'Deploy to cluster' },
  { id: 'monitor', label: 'Monitor', icon: '📊', color: '#22c55e', desc: 'Prometheus + Grafana' },
  { id: 'backup',  label: 'Backup',  icon: '💾', color: '#f59e0b', desc: 'Automated backups' },
];

const TOOLS = [
  {
    id: 'jenkins', title: 'Jenkins CI/CD', icon: '⚙️', color: '#f59e0b',
    points: [
      'Automated pipeline on every git push',
      'Stages: Test → Build → Push → Deploy',
      'DockerHub integration for image registry',
      'kubectl deploy to Kubernetes',
    ],
    terminal: [
      '$ git push origin main',
      '> Jenkins pipeline triggered...',
      '> Running pytest tests... ✅',
      '> Building Docker image...',
      '> Pushing to DockerHub... ✅',
      '> Deploying to K8s... ✅',
      '> Pipeline complete in 2m 34s',
    ],
  },
  {
    id: 'docker', title: 'Docker & Compose', icon: '🐳', color: '#38bdf8',
    points: [
      'Multi-stage Dockerfiles for lean images',
      'Docker Compose for local dev stack',
      '5 services: backend, frontend, postgres, redis, jenkins',
      'Health checks on all services',
    ],
    terminal: [
      '$ docker-compose up --build',
      '> Starting ecom_postgres... ✅',
      '> Starting ecom_redis... ✅',
      '> Starting ecom_backend... ✅',
      '> Starting ecom_frontend... ✅',
      '> All services healthy',
    ],
  },
  {
    id: 'k8s', title: 'Kubernetes', icon: '☸️', color: '#a78bfa',
    points: [
      'Deployments with 2 replicas for high availability',
      'StatefulSet for PostgreSQL with PersistentVolumeClaim',
      'Ingress routing /api to backend, / to frontend',
      'ConfigMaps and Secrets management',
    ],
    terminal: [
      '$ kubectl apply -k k8s/base/',
      '> namespace/ecommerce created',
      '> deployment/backend created',
      '> deployment/frontend created',
      '> service/postgres-service created',
      '> ingress/ecom-ingress created',
    ],
  },
];

export default function Home() {
  const heroRef     = useRef(null);
  const titleRef    = useRef(null);
  const subRef      = useRef(null);
  const ctaRef      = useRef(null);
  const pipelineRef = useRef(null);
  const orbRef      = useRef(null);
  const nodeRefs    = useRef([]);
  const toolRefs    = useRef([]);
  const statusRef   = useRef(null);
  const archRef     = useRef(null);
  const ctaFinalRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(heroRef.current,
        { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .to(titleRef.current, { duration: 2.5, text: 'DevOps Shop', ease: 'none' })
      .fromTo(subRef.current,
        { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.3')
      .fromTo(ctaRef.current,
        { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.3');

    gsap.to(ctaRef.current, {
      boxShadow: '0 0 40px #38bdf8, 0 0 80px rgba(56,189,248,0.3)',
      duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3,
    });

    ScrollTrigger.create({
      trigger: pipelineRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const total = PIPELINE_NODES.length;
        const idx   = Math.min(Math.floor(self.progress * total), total - 1);
        const target = nodeRefs.current[idx];
        if (target && orbRef.current) {
          const r  = target.getBoundingClientRect();
          const cr = pipelineRef.current.getBoundingClientRect();
          gsap.to(orbRef.current, {
            x: r.left - cr.left + r.width / 2 - 12,
            y: r.top  - cr.top  + r.height / 2 - 12,
            duration: 0.3,
          });
        }
        nodeRefs.current.forEach((el, i) => {
          if (!el) return;
          const circle = el.querySelector('.nc');
          if (i <= idx) {
            gsap.to(el, { scale: 1.15, duration: 0.3 });
            circle.style.boxShadow   = `0 0 20px ${PIPELINE_NODES[i].color}`;
            circle.style.borderColor = PIPELINE_NODES[i].color;
          } else {
            gsap.to(el, { scale: 1, duration: 0.3 });
            circle.style.boxShadow   = 'none';
            circle.style.borderColor = '#1e3a5f';
          }
        });
      },
    });

    toolRefs.current.forEach((el) => {
      if (!el) return;
      gsap.fromTo(el.querySelector('.tl'),
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 70%' } });
      gsap.fromTo(el.querySelector('.tr'),
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: el, start: 'top 70%' } });
    });

    gsap.fromTo(statusRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: statusRef.current, start: 'top 75%' } });

    gsap.fromTo(archRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1,
        scrollTrigger: { trigger: archRef.current, start: 'top 70%' } });

    gsap.fromTo(ctaFinalRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: ctaFinalRef.current, start: 'top 80%' } });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div style={{ background: '#0f172a', color: '#e2f4ff', fontFamily: 'Space Grotesk, sans-serif' }}>

      {/* 1. HERO */}
      <section ref={heroRef} style={S.hero}>
        <div style={S.gridBg} />
        {[
          { icon: '🐳', x: '8%',  y: '20%' },
          { icon: '☸️', x: '88%', y: '15%' },
          { icon: '🐧', x: '80%', y: '72%' },
          { icon: '⚙️', x: '12%', y: '75%' },
          { icon: '🐍', x: '90%', y: '45%' },
          { icon: '⚛️', x: '4%',  y: '50%' },
        ].map((item, i) => (
          <div key={i} style={{ ...S.floatIcon, left: item.x, top: item.y }}>{item.icon}</div>
        ))}
        <div style={S.heroContent}>
          <div style={S.badge}>
            <span style={S.badgeDot} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>
              Full Stack DevOps Platform
            </span>
          </div>
          <h1 ref={titleRef} style={S.heroTitle}>&nbsp;</h1>
          <p ref={subRef} style={S.heroSub}>
            From Code to Production — Visually.
            FastAPI · React · PostgreSQL · Redis · Docker · Kubernetes · Jenkins
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link ref={ctaRef} to="/products" style={S.ctaPrimary}>Explore Store</Link>
            <a href="#pipeline" style={S.ctaSecondary}>View Pipeline ↓</a>
          </div>
          <div style={S.pillRow}>
            {['Python','React','PostgreSQL','Redis','Docker','K8s','Jenkins','Linux'].map((t) => (
              <span key={t} style={S.pill}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE PIPELINE */}
      <section id="pipeline" ref={pipelineRef} style={S.pipelineSec}>
        <div style={{ width: '100%', maxWidth: '1100px', textAlign: 'center' }}>
          <h2 style={S.secTitle}>
            <span style={{ color: '#38bdf8' }}>Live</span> DevOps Pipeline
          </h2>
          <p style={S.secSub}>Scroll to move the packet through the pipeline</p>
          <div style={S.track}>
            <div style={S.trackLine} />
            <div ref={orbRef} style={S.orb}>
              <div style={S.orbInner} />
            </div>
            {PIPELINE_NODES.map((node, i) => (
              <div
                key={node.id}
                ref={(el) => (nodeRefs.current[i] = el)}
                style={S.node}
                onClick={() => {
                  const el = document.getElementById(node.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="nc" style={{ ...S.nodeCircle, background: `${node.color}15` }}>
                  <span style={{ fontSize: '1.8rem' }}>{node.icon}</span>
                </div>
                <p style={S.nodeLabel}>{node.label}</p>
                <p style={S.nodeDesc}>{node.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TOOL DEEP-DIVES */}
      {TOOLS.map((tool, i) => (
        <section
          id={tool.id}
          key={tool.id}
          ref={(el) => (toolRefs.current[i] = el)}
          style={{ ...S.toolSec, background: i % 2 === 0 ? '#0f172a' : '#0a1628' }}
        >
          <div className="tl" style={S.toolLeft}>
            <div style={{ ...S.toolIcon, color: tool.color, borderColor: `${tool.color}40` }}>
              {tool.icon}
            </div>
            <h2 style={S.toolTitle}>{tool.title}</h2>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tool.points.map((p, j) => (
                <li key={j} style={S.toolPoint}>
                  <span style={{ color: tool.color, marginRight: '8px' }}>▸</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div className="tr" style={S.toolRight}>
            <div style={{ ...S.terminal, borderColor: `${tool.color}40` }}>
              <div style={S.termHead}>
                <span style={S.dot} />
                <span style={{ ...S.dot, background: '#fbbf24' }} />
                <span style={{ ...S.dot, background: '#22c55e' }} />
                <span style={{ marginLeft: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: tool.color }}>
                  {tool.id}.log
                </span>
              </div>
              <div style={S.termBody}>
                {tool.terminal.map((line, j) => (
                  <p key={j} style={{
                    margin: '4px 0',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.82rem',
                    color: line.startsWith('>') ? '#22c55e' : line.startsWith('$') ? '#38bdf8' : '#8ba8c4',
                  }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* 4. SYSTEM STATUS */}
      <section ref={statusRef} style={{ ...S.plainSec, background: '#0a1628', textAlign: 'center' }}>
        <h2 style={S.secTitle}>System <span style={{ color: '#22c55e' }}>Status</span></h2>
        <div style={S.statusGrid}>
          {[
            { name: 'Frontend',  status: 'Operational', color: '#22c55e' },
            { name: 'Backend',   status: 'Operational', color: '#22c55e' },
            { name: 'Database',  status: 'Operational', color: '#22c55e' },
            { name: 'Redis',     status: 'Operational', color: '#22c55e' },
            { name: 'Jenkins',   status: 'Running',     color: '#38bdf8' },
            { name: 'K8s',       status: 'Healthy',     color: '#a78bfa' },
          ].map((s) => (
            <div key={s.name} style={S.statusCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ ...S.statusDot, background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
                <span style={{ fontWeight: '600', color: '#e2f4ff', fontSize: '0.9rem' }}>{s.name}</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: s.color }}>{s.status}</span>
            </div>
          ))}
        </div>
        <div style={{ ...S.terminal, maxWidth: '700px', margin: '2rem auto 0', border: '1px solid #1e3a5f' }}>
          <div style={S.termHead}>
            <span style={S.dot} />
            <span style={{ ...S.dot, background: '#fbbf24' }} />
            <span style={{ ...S.dot, background: '#22c55e' }} />
            <span style={{ marginLeft: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#8ba8c4' }}>
              pipeline.log — live
            </span>
          </div>
          <div style={S.termBody}>
            {[
              { t: '10:42:01', msg: 'Git push received on branch main',          c: '#8ba8c4' },
              { t: '10:42:03', msg: 'Jenkins pipeline triggered — build #47',    c: '#38bdf8' },
              { t: '10:42:15', msg: 'pytest: 12 passed in 8.3s ✅',               c: '#22c55e' },
              { t: '10:42:28', msg: 'Docker build complete — 287MB',              c: '#38bdf8' },
              { t: '10:42:45', msg: 'Image pushed to DockerHub ✅',               c: '#22c55e' },
              { t: '10:43:02', msg: 'kubectl rollout — backend: 2/2 pods ready',  c: '#a78bfa' },
              { t: '10:43:10', msg: 'Deployment successful ✅  1m 09s total',     c: '#22c55e' },
            ].map((log, i) => (
              <p key={i} style={{ margin: '4px 0', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem' }}>
                <span style={{ color: '#1e3a5f' }}>[{log.t}]</span>{' '}
                <span style={{ color: log.c }}>{log.msg}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ARCHITECTURE */}
      <section ref={archRef} style={{ ...S.plainSec, background: '#0f172a', textAlign: 'center' }}>
        <h2 style={S.secTitle}>System <span style={{ color: '#a78bfa' }}>Architecture</span></h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ ...S.archBox, borderColor: '#38bdf8', color: '#38bdf8' }}>
              ⚛️ React Frontend
              <span style={S.archSub}>Port 3000</span>
            </div>
          </div>
          <p style={{ color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>↓ REST API</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <div style={{ ...S.archBox, borderColor: '#a78bfa', color: '#a78bfa' }}>
              🐍 FastAPI Backend
              <span style={S.archSub}>Port 8000</span>
            </div>
          </div>
          <p style={{ color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>↙ SQL &nbsp;&nbsp;&nbsp; ↘ Cache</p>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            <div style={{ ...S.archBox, borderColor: '#22c55e', color: '#22c55e' }}>
              🐘 PostgreSQL
              <span style={S.archSub}>Port 5432</span>
            </div>
            <div style={{ ...S.archBox, borderColor: '#f59e0b', color: '#f59e0b' }}>
              ⚡ Redis
              <span style={S.archSub}>Port 6379</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BACKUP */}
      <section style={{ ...S.plainSec, background: '#0a1628', textAlign: 'center' }}>
        <h2 style={S.secTitle}>Data <span style={{ color: '#f59e0b' }}>Safety</span></h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '2rem' }}>
          {['📦 Dump DB', '🗜️ Zip Archive', '☁️ SCP Transfer', '✅ Verified'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <div style={S.backupStep}>
                <span style={{ fontSize: '2rem' }}>{step.split(' ')[0]}</span>
                <span style={{ fontSize: '0.85rem', color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace' }}>
                  {step.split(' ').slice(1).join(' ')}
                </span>
              </div>
              {i < arr.length - 1 && <span style={{ fontSize: '1.5rem', color: '#f59e0b' }}>→</span>}
            </React.Fragment>
          ))}
        </div>
        <p style={{ color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.82rem', marginTop: '1.5rem' }}>
          Automated via Linux shell script · Runs on cron · Zero downtime
        </p>
      </section>

        {/* 7. ABOUT */}
        <section
          style={{
            ...S.plainSec,
            position: 'relative',
            overflow: 'hidden',
            background: '#0f172a',
            textAlign: 'center'
          }}
        >

          {/* 🌌 TECH BACKGROUND */}
          <div style={S.techBg} />

          <div style={{ ...S.gridOverlay }} />

          {/* CONTENT */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem'
            }}
          >

            {/* 🔥 INSANE AVATAR */}
            <div style={S.avatarContainer}>

              {/* aura */}
              <div style={S.avatarAura} />

              {/* SVG Avatar */}
              <div
                style={S.avatarSvg}
                onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.08 })}
                onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1 })}
              >
                <svg viewBox="0 0 100 100" width="110" height="110">
                  <rect fill="#0f172a" width="100" height="100" />
                  <g transform="translate(4, -1) rotate(-9 50 70)">
                    <path d="M95 53.33C95 29.4 74.85 10 50 10S5 29.4 5 53.33V140h90V53.33Z" fill="#38bdf8"/>
                  </g>
                </svg>
              </div>

              {/* 🔄 ORBIT ICONS */}
              {[
                { icon: '🐳', id: 'docker' },
                { icon: '☸️', id: 'k8s' },
                { icon: '⚙️', id: 'jenkins' },
                { icon: '🔀', id: 'git' },
                { icon: '☁️', id: 'cloud' },
                { icon: '📦', id: 'ci' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="orbit-icon"
                  style={{ ...S.orbitIcon, animationDelay: `${i * 0.8}s` }}
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {item.icon}
                </div>
              ))}

            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#e2f4ff' }}>
              Built by Shriyanshi
            </h2>

            <p style={{
              color: '#38bdf8',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.9rem'
            }}>
              DevOps Engineer · Kubernetes & CI/CD Enthusiast
            </p>

            <p style={{
              color: '#8ba8c4',
              maxWidth: '520px',
              lineHeight: 1.8,
              fontSize: '0.95rem'
            }}>
              This project demonstrates a complete production DevOps workflow —
              from writing code in WSL2 to deploying on Kubernetes with an automated Jenkins pipeline.
            </p>

            <a
              href="https://github.com/shriyanshiatgithub"
              target="_blank"
              rel="noreferrer"
              style={S.githubBtn}
            >
              GitHub →
            </a>

          </div>
        </section>
      {/* 8. FINAL CTA */}
      <section ref={ctaFinalRef} style={{ ...S.plainSec, background: 'radial-gradient(ellipse at 50% 0%, #0d2137 0%, #0f172a 70%)', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: '#e2f4ff', marginBottom: '1rem' }}>
          Explore the Full Project
        </h2>
        <p style={{ color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          Complete source code · Docker · K8s · Jenkins · GSAP
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/shriyanshiatgithub/Devops-Shop"
            target="_blank"
            rel="noreferrer"
            style={S.ctaPrimary}
          >
            View on GitHub →
          </a>
          <Link to="/products" style={S.ctaSecondary}>Live Demo →</Link>
        </div>
        <div style={{ marginTop: '4rem', borderTop: '1px solid #1e3a5f', paddingTop: '2rem' }}>
          <p style={{ color: '#8ba8c4', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Built with FastAPI · React · PostgreSQL · Redis · Docker · Kubernetes · Jenkins
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '1.5rem' }}>
            {['🐍','⚛️','🐘','⚡','🐳','☸️','⚙️','🐧'].map((icon, i) => (
              <span key={i}>{icon}</span>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes gridScroll {
          from { background-position: 0 0; }
          to   { background-position: 0 50px; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-15px); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }

        @keyframes floatAvatar {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulseAura {
          0%,100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const S = {
  hero: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 20% 50%, #0d2137 0%, #0f172a 60%)' },
  gridBg: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', animation: 'gridScroll 4s linear infinite', pointerEvents: 'none' },
  heroContent: { textAlign: 'center', zIndex: 2, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '800px' },
  badge: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', padding: '6px 16px', borderRadius: '20px', color: '#38bdf8' },
  badgeDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', display: 'inline-block', animation: 'blink 1.5s ease-in-out infinite' },
  heroTitle: { fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: '800', background: 'linear-gradient(135deg, #e2f4ff 0%, #38bdf8 40%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, minHeight: '1.2em' },
  heroSub: { fontSize: '1.05rem', color: '#8ba8c4', lineHeight: 1.8, fontFamily: 'JetBrains Mono, monospace', maxWidth: '600px' },
  ctaPrimary: { background: 'linear-gradient(135deg, #0066ff, #38bdf8)', color: '#0f172a', padding: '14px 36px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', display: 'inline-block', boxShadow: '0 0 20px rgba(56,189,248,0.3)' },
  ctaSecondary: { background: 'transparent', color: '#38bdf8', padding: '14px 36px', borderRadius: '8px', fontWeight: '700', fontSize: '1rem', display: 'inline-block', border: '1px solid #38bdf8' },
  pillRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' },
  pill: { background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', padding: '4px 14px', borderRadius: '20px', fontSize: '0.78rem', fontFamily: 'JetBrains Mono, monospace' },
  floatIcon: { position: 'absolute', fontSize: '2.5rem', filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.5))', animation: 'float 3s ease-in-out infinite', pointerEvents: 'none', zIndex: 1 },
  pipelineSec: { minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', overflow: 'hidden' },
  secTitle: { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '800', color: '#e2f4ff', marginBottom: '0.5rem' },
  secSub: { color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', marginBottom: '2rem' },
  track: { position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '4rem', padding: '2rem 0' },
  trackLine: { position: 'absolute', top: '4.5rem', left: '5%', right: '5%', height: '2px', background: 'linear-gradient(90deg, #38bdf8, #a78bfa, #22c55e)', opacity: 0.4 },
  orb: { position: 'absolute', top: '3.5rem', left: 0, width: '24px', height: '24px', zIndex: 10, pointerEvents: 'none' },
  orbInner: { width: '24px', height: '24px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 20px #38bdf8, 0 0 40px #38bdf8', animation: 'orbPulse 1s ease-in-out infinite' },
  node: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', width: '120px', zIndex: 2 },
  nodeCircle: { width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' },
  nodeLabel: { fontSize: '0.85rem', fontWeight: '700', color: '#e2f4ff', fontFamily: 'JetBrains Mono, monospace' },
  nodeDesc: { fontSize: '0.68rem', color: '#8ba8c4', textAlign: 'center', lineHeight: 1.4, maxWidth: '100px' },
  toolSec: { minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '5rem 4rem', gap: '4rem', flexWrap: 'wrap' },
  toolLeft: { flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  toolIcon: { fontSize: '3rem', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', border: '1px solid', background: 'rgba(255,255,255,0.03)' },
  toolTitle: { fontSize: '2rem', fontWeight: '700', color: '#e2f4ff' },
  toolPoint: { color: '#8ba8c4', fontSize: '0.95rem', lineHeight: 1.6, display: 'flex', alignItems: 'flex-start' },
  toolRight: { flex: 1, minWidth: '300px' },
  terminal: { background: '#0a0f1e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1e3a5f' },
  termHead: { display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', background: '#111827', borderBottom: '1px solid #1e3a5f' },
  dot: { width: '12px', height: '12px', borderRadius: '50%', background: '#ff4757' },
  termBody: { padding: '1.2rem' },
  plainSec: { padding: '5rem 2rem' },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', maxWidth: '900px', margin: '2rem auto' },
  statusCard: { background: '#111827', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%', animation: 'blink 2s ease-in-out infinite' },
  archBox: { background: '#111827', border: '2px solid', borderRadius: '12px', padding: '1rem 2rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '4px' },
  archSub: { fontSize: '0.75rem', color: '#8ba8c4', fontFamily: 'JetBrains Mono, monospace' },
  backupStep: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: '#111827', border: '1px solid #1e3a5f', borderRadius: '12px', padding: '1.5rem', minWidth: '120px' },
    avatarContainer: {
    position: 'relative',
    width: '220px',
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  avatarAura: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,189,248,0.25), transparent)',
    filter: 'blur(40px)',
    animation: 'pulseAura 3s infinite ease-in-out'
  },

  avatarSvg: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    overflow: 'hidden',
    zIndex: 2,
    boxShadow: '0 0 30px #38bdf8',
    animation: 'floatAvatar 4s ease-in-out infinite'
  },

  orbitIcon: {
    position: 'absolute',
    fontSize: '1.5rem',
    cursor: 'pointer',
    animation: 'orbit 10s linear infinite',
    transition: 'all 0.3s ease'
  },

  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    zIndex: 0
  },

  githubBtn: {
    background: '#111827',
    border: '1px solid #38bdf8',
    color: '#38bdf8',
    padding: '12px 28px',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
};
