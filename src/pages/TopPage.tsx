import { useNavigate } from 'react-router-dom';
import { MAX_SCORE } from '../data/masterData';

export function TopPage() {
  const navigate = useNavigate();

  return (
    <div style={{ overflowX: 'hidden' }}>

      {/* ===== ヒーローセクション ===== */}
      <section
        style={{
          minHeight: 'calc(100dvh - 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '32px 20px 80px',
          background: 'linear-gradient(135deg, #0a1a0a 0%, #1a0a2e 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景グロー */}
        <div style={{
          position: 'absolute', top: '15%', right: '-5%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(170,255,0,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '-5%',
          width: '30vw', height: '30vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ターミナルコマンド */}
        <div style={{
          fontSize: 'clamp(0.7rem, 1.8vw, 1rem)',
          color: 'var(--accent-green)',
          letterSpacing: '0.05em',
          marginBottom: '3vh',
          opacity: 0.8,
        }}>
          $ open-psychiatric-nursing --start
        </div>

        {/* ===== メインタイトル（画面幅いっぱい） ===== */}
        <div style={{ lineHeight: 0.88, marginBottom: '4vh' }}>
          <div style={{
            fontSize: 'clamp(4.5rem, 22vw, 16rem)',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
          }}>
            OPEN
          </div>
          <div style={{
            fontSize: 'clamp(2.2rem, 11vw, 8rem)',
            fontWeight: 700,
            color: '#cccccc',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            marginTop: '0.05em',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.15em',
          }}>
            PSYCHIATRIC
            <span style={{
              width: 'clamp(0.5rem, 2vw, 1.2rem)',
              height: 'clamp(0.5rem, 2vw, 1.2rem)',
              borderRadius: '50%',
              background: '#ff2d6b',
              display: 'inline-block',
              flexShrink: 0,
              marginBottom: '0.12em',
              boxShadow: '0 0 14px rgba(255,45,107,0.7)',
            }} />
          </div>
          <div style={{
            fontSize: 'clamp(4rem, 20vw, 14rem)',
            fontWeight: 700,
            color: 'var(--accent-green)',
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            textShadow: '0 0 60px rgba(170,255,0,0.4)',
            marginTop: '0.05em',
          }}>
            NURSING
          </div>
        </div>

        {/* サブテキスト */}
        <p style={{
          fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          color: '#aaa',
          lineHeight: 1.8,
          marginBottom: '5vh',
          maxWidth: 500,
        }}>
          Psychiatric Discharge Support Tool<br />
          <span style={{ color: 'var(--accent-green)', fontWeight: 700, letterSpacing: '0.05em' }}>
            AIエージェント時代の退院支援インフラ
          </span>
          <br />
          <span style={{ color: '#666' }}>全22項目 / 最大{MAX_SCORE}点 / 完全ローカル動作</span>
        </p>

        {/* アクションボタン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 440 }}>
          <button
            onClick={() => navigate('/assess')}
            style={{
              padding: '20px 28px',
              background: 'rgba(170,255,0,0.08)',
              border: '1px solid var(--accent-green)',
              borderRadius: 4,
              color: 'var(--accent-green)',
              fontFamily: 'inherit',
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: 700,
              letterSpacing: '0.12em',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 64,
              boxShadow: '0 0 20px rgba(170,255,0,0.12)',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(170,255,0,0.14)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(170,255,0,0.25)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(170,255,0,0.08)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(170,255,0,0.12)';
            }}
          >
            <div>
              <div>新規アセスメント開始</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(170,255,0,0.5)', marginTop: 3, fontWeight: 400 }}>
                NEW ASSESSMENT
              </div>
            </div>
            <span style={{ fontSize: '1.4rem' }}>→</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            style={{
              padding: '16px 28px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#999',
              fontFamily: 'inherit',
              fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              minHeight: 52,
              textTransform: 'uppercase',
            }}
          >
            <span>履歴を見る</span>
            <span>→</span>
          </button>
        </div>

        {/* スクロール促進 */}
        <div style={{
          position: 'absolute', bottom: 20, left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.6rem', color: '#444',
          letterSpacing: '0.15em',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        }}>
          <span>SCROLL</span>
          <span style={{ fontSize: '0.9rem' }}>↓</span>
        </div>
      </section>

      {/* ===== システム情報セクション ===== */}
      <section style={{ padding: '48px 20px', background: '#0a0f0a' }}>
        <div style={{
          fontSize: '0.7rem', color: 'var(--accent-cyan)',
          letterSpacing: '0.2em', marginBottom: 24,
        }}>
          // SYSTEM OVERVIEW
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, maxWidth: 600 }}>
          {[
            ['評価カテゴリ', '9'],
            ['採点対象項目', '22'],
            ['最大合計点', `${MAX_SCORE} pt`],
            ['判定レベル', '3段階'],
            ['データ保存', 'ローカル端末'],
            ['外部通信', 'なし'],
          ].map(([label, value]) => (
            <div key={label} style={{ padding: '14px 16px', background: '#0d1117', borderBottom: '1px solid #111' }}>
              <div style={{ fontSize: '0.62rem', color: '#666', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: '1rem', color: '#ddd', fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 32, padding: '20px', background: '#0d1117',
          borderRadius: 4, borderLeft: '2px solid var(--accent-orange)', maxWidth: 600,
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-orange)', letterSpacing: '0.15em', marginBottom: 16 }}>
            // JUDGMENT CRITERIA
          </div>
          {[
            { range: '0 〜 22 pt', label: '集中支援フェーズ', color: 'var(--accent-red)' },
            { range: '23 〜 44 pt', label: '支援継続が必要', color: 'var(--accent-orange)' },
            { range: '45 〜 66 pt', label: '退院調整可能', color: 'var(--accent-green)' },
          ].map(({ range, label, color }) => (
            <div key={range} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #1a1a1a',
            }}>
              <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: 600 }}>{range}</span>
              <span style={{ fontSize: '0.85rem', color }}>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
