import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'ASSESS', path: '/assess', icon: '⊕' },
  { label: 'SUMMARY', path: '/summary', icon: '◈' },
  { label: 'HISTORY', path: '/history', icon: '◎' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        background: 'rgba(10,15,10,0.95)',
        borderTop: '1px solid #1a2a1a',
        backdropFilter: 'blur(10px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        zIndex: 100,
      }}
    >
      {NAV_ITEMS.map(({ label, path, icon }) => {
        const active = location.pathname.startsWith(path);
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              padding: '12px 8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              color: active ? 'var(--accent-green)' : '#888',
              fontFamily: 'inherit',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              minHeight: 44,
              transition: 'color 0.15s',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
