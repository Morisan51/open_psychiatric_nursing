import { useState, useEffect } from 'react';

export function AddToHomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (isIOS && !isStandalone && !dismissed) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem('pwa-banner-dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#111820',
      borderTop: '1px solid #aaff00',
      padding: '16px 20px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#aaff00', fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>
          ADD TO HOME SCREEN
        </div>
        <div style={{ color: '#aaa', fontSize: '0.78rem', lineHeight: 1.6 }}>
          Safariの共有ボタン →「ホーム画面に追加」でアプリとして使用できます
        </div>
      </div>
      <button
        onClick={dismiss}
        style={{
          background: 'transparent',
          border: '1px solid #444',
          color: '#888',
          borderRadius: 4,
          padding: '6px 12px',
          fontSize: '0.78rem',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
      >
        閉じる
      </button>
    </div>
  );
}
