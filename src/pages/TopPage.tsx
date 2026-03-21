import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAX_SCORE } from '../data/masterData';
import { PSW_MAX_SCORE } from '../data/pswMasterData';
import { LONG_TERM_MAX_SCORE } from '../data/longTermMasterData';
import { useAssessmentContext } from '../context/AssessmentContext';

export function TopPage() {
  const navigate = useNavigate();
  const { setAssessmentType } = useAssessmentContext();
  const [showTypeSelect, setShowTypeSelect] = useState(false);

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
        {/* 背景グロー（静的） */}
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

        {/* ===== ウネウネ動くグローオーブ ===== */}
        {([
          { top: '5%',  right: '15%', size: 80,  color: 'rgba(170,255,0,0.85)',   glow: 60,  cssBlur: 20, anim: 'orb-float-1', dur: '9s',  delay: '0s'    },
          { top: '18%', right: '2%',  size: 55,  color: 'rgba(0,255,255,0.75)',   glow: 45,  cssBlur: 15, anim: 'orb-float-2', dur: '11s', delay: '-2s'   },
          { top: '30%', right: '22%', size: 65,  color: 'rgba(255,45,107,0.8)',   glow: 55,  cssBlur: 18, anim: 'orb-float-3', dur: '13s', delay: '-4s'   },
          { top: '50%', right: '5%',  size: 45,  color: 'rgba(170,255,0,0.65)',   glow: 38,  cssBlur: 13, anim: 'orb-float-4', dur: '10s', delay: '-1.5s' },
          { top: '60%', right: '28%', size: 90,  color: 'rgba(255,107,53,0.75)',  glow: 75,  cssBlur: 24, anim: 'orb-float-1', dur: '15s', delay: '-6s'   },
          { top: '70%', right: '0%',  size: 60,  color: 'rgba(0,229,204,0.7)',    glow: 50,  cssBlur: 16, anim: 'orb-float-2', dur: '12s', delay: '-3s'   },
          { top: '20%', right: '40%', size: 40,  color: 'rgba(0,255,255,0.6)',    glow: 33,  cssBlur: 11, anim: 'orb-float-3', dur: '14s', delay: '-5s'   },
          { top: '55%', right: '45%', size: 100, color: 'rgba(255,45,107,0.65)',  glow: 85,  cssBlur: 28, anim: 'orb-float-4', dur: '17s', delay: '-7s'   },
          { top: '80%', right: '20%', size: 50,  color: 'rgba(170,255,0,0.7)',    glow: 43,  cssBlur: 14, anim: 'orb-float-1', dur: '10s', delay: '-2.5s' },
          { top: '10%', right: '55%', size: 35,  color: 'rgba(255,107,53,0.6)',   glow: 29,  cssBlur: 10, anim: 'orb-float-3', dur: '12s', delay: '-8s'   },
          { top: '42%', right: '58%', size: 70,  color: 'rgba(191,95,255,0.72)',  glow: 60,  cssBlur: 19, anim: 'orb-float-2', dur: '16s', delay: '-1s'   },
          { top: '75%', right: '50%', size: 48,  color: 'rgba(0,255,255,0.55)',   glow: 40,  cssBlur: 13, anim: 'orb-float-4', dur: '11s', delay: '-4.5s' },
        ] as { top: string; right: string; size: number; color: string; glow: number; cssBlur: number; anim: string; dur: string; delay: string }[]).map((orb, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: orb.top,
              right: orb.right,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: orb.color,
              boxShadow: `0 0 ${orb.glow}px ${orb.color}, 0 0 ${orb.glow * 2}px ${orb.color}`,
              filter: `blur(${orb.cssBlur}px)`,
              animation: `${orb.anim} ${orb.dur} ease-in-out infinite ${orb.delay}, orb-pulse ${orb.dur} ease-in-out infinite ${orb.delay}`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}

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
          {!showTypeSelect ? (
            <button
              onClick={() => setShowTypeSelect(true)}
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
            >
              <div>
                <div>新規アセスメント開始</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(170,255,0,0.5)', marginTop: 3, fontWeight: 400 }}>
                  NEW ASSESSMENT
                </div>
              </div>
              <span style={{ fontSize: '1.4rem' }}>↓</span>
            </button>
          ) : (
            <div style={{
              border: '1px solid var(--accent-green)',
              borderRadius: 4,
              overflow: 'hidden',
              animation: 'scale-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
            }}>
              <div style={{
                padding: '10px 16px',
                fontSize: '0.6rem',
                color: 'rgba(170,255,0,0.6)',
                letterSpacing: '0.15em',
                background: 'rgba(170,255,0,0.04)',
                borderBottom: '1px solid rgba(170,255,0,0.15)',
              }}>
                // SELECT ASSESSMENT TYPE
              </div>
              <button
                onClick={() => { setAssessmentType('nurse'); navigate('/assess'); }}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(170,255,0,0.15)',
                  color: 'var(--accent-green)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(170,255,0,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div>
                  <div>NURSING ASSESSMENT</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(170,255,0,0.4)', marginTop: 2, fontWeight: 400 }}>
                    22 ITEMS · MAX {MAX_SCORE} PT
                  </div>
                </div>
                <span>→</span>
              </button>
              <button
                onClick={() => { setAssessmentType('psw'); navigate('/assess'); }}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(170,255,0,0.15)',
                  color: 'var(--accent-cyan)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div>
                  <div>PSW ASSESSMENT</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,255,0.4)', marginTop: 2, fontWeight: 400 }}>
                    20 ITEMS · MAX {PSW_MAX_SCORE} PT
                  </div>
                </div>
                <span>→</span>
              </button>
              <button
                onClick={() => { setAssessmentType('long_term'); navigate('/assess'); }}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-purple)',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(191,95,255,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div>
                  <div>LONG-TERM CARE ASSESSMENT</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(191,95,255,0.4)', marginTop: 2, fontWeight: 400 }}>
                    長期療養アセスメント · MAX {LONG_TERM_MAX_SCORE} PT
                  </div>
                </div>
                <span>→</span>
              </button>
            </div>
          )}

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
