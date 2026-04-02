import React from 'react';

export default function Spinner() {
  return (
    <div style={styles.container}>
      <div style={styles.ring}></div>
      <p style={styles.text}>Loading...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5rem',
    gap: '1rem',
  },
  ring: {
    width: '48px',
    height: '48px',
    border: '3px solid #1e3a5f',
    borderTop: '3px solid #00d4ff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    color: '#8ba8c4',
    fontSize: '0.9rem',
    fontFamily: 'JetBrains Mono, monospace',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
};
