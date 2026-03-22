import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'ASSESS', path: '/assess' },
  { label: 'SUMMARY', path: '/summary' },
  { label: 'EXEC', path: '/executive' },
  { label: 'HISTORY', path: '/history' },
];

const OTR_NAV_ITEMS = [
  { label: 'OTR入力', path: '/otr' },
  { label: '詳細・プロンプト', path: '/otr/detail' },
];

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isTop = location.pathname === '/';
  const isOtr = location.pathname.startsWith('/otr');

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          borderBottom: '1px solid #1e2a1e',
          background: 'rgba(10,15,10,0.97)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        {/* タイトル行 */}
        <div
          style={{
            padding: '14px 20px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <div
              style={{
                fontSize: 'clamp(1rem, 3vw, 1.4rem)',
                letterSpacing: '0.15em',
                color: 'var(--accent-green)',
                fontWeight: 700,
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              OPEN PSYCHIATRIC NURSING
            </div>
            <div
              style={{
                fontSize: '0.65rem',
                color: '#888',
                letterSpacing: '0.12em',
                marginTop: 2,
              }}
            >
              PSYCHIATRIC COMMAND CENTER
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.65rem',
              color: 'var(--status-live)',
              letterSpacing: '0.1em',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--status-live)',
                display: 'inline-block',
                boxShadow: '0 0 8px var(--status-live)',
              }}
            />
            LIVE
          </div>
        </div>

        {/* ナビタブ（タイトルの直下） */}
        {!isTop && (
          <div
            style={{
              display: 'flex',
              borderTop: '1px solid #1e2a1e',
            }}
          >
            {(isOtr ? OTR_NAV_ITEMS : NAV_ITEMS).map(({ label, path }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    background: active ? 'rgba(170,255,0,0.06)' : 'transparent',
                    border: 'none',
                    borderBottom: active
                      ? '2px solid var(--accent-green)'
                      : '2px solid transparent',
                    color: active ? 'var(--accent-green)' : '#888',
                    fontFamily: 'inherit',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    cursor: 'pointer',
                    fontWeight: active ? 700 : 400,
                    transition: 'all 0.15s',
                    minHeight: 44,
                  }}
                >
                  {label}
                </button>
              );
            })}
            {isOtr && (
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2px solid transparent',
                  color: '#555',
                  fontFamily: 'inherit',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  minHeight: 44,
                  flexShrink: 0,
                }}
              >
                ← HOME
              </button>
            )}
          </div>
        )}
      </header>

      {/* メインコンテンツ */}
      <main
        key={location.pathname}
        style={{
          flex: 1,
          overflowY: 'auto',
          animation: 'fade-up 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        }}
      >
        {children}
      </main>
    </div>
  );
}
