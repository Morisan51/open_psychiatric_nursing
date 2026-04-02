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
            AIエージェント時代の関係性をコンパイルするインフラ
          </span>
          <br />
          <span style={{ color: '#aaa', fontSize: '0.85em', fontStyle: 'italic' }}>
            AIが「記録する医療従事者」になれば、人は「関わる医療従事者」に戻れる
          </span>
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
                  <div style={{ fontSize: '0.65rem', color: 'rgba(170,255,0,0.85)', marginTop: 2, fontWeight: 400 }}>
                    最小の問いで、最大の臨床を引き出す
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
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,255,255,0.85)', marginTop: 2, fontWeight: 400 }}>
                    看護と制度の間に落ちているものを拾う
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
                  borderBottom: '1px solid rgba(170,255,0,0.15)',
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
                  <div style={{ fontSize: '0.65rem', color: 'rgba(191,95,255,0.85)', marginTop: 2, fontWeight: 400 }}>
                    長期入院を「退院できない入院生活」から解放する
                  </div>
                </div>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/dementia')}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(170,255,0,0.15)',
                  color: 'var(--accent-orange)',
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
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,107,53,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div>
                  <div>DEMENTIA ASSESSMENT</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,107,53,0.85)', marginTop: 2, fontWeight: 400 }}>
                    この人の今と、これからをどう支えるか
                  </div>
                </div>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/otr')}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(170,255,0,0.15)',
                  color: '#00e5cc',
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
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,204,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div>
                  <div>OTR ASSESSMENT</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(0,229,204,0.85)', marginTop: 2, fontWeight: 400 }}>
                    リカバリーを、見える構造に変える
                  </div>
                </div>
                <span>→</span>
              </button>
              <button
                onClick={() => navigate('/detailed')}
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
                  <div>DETAILED DISCHARGE ASSESSMENT</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(191,95,255,0.85)', marginTop: 2, fontWeight: 400 }}>
                    精神科臨床戦略コンサルティング
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
      <section style={{ background: '#0a0f0a' }}>

        {/* ── Stats Bar ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid #151515', borderBottom: '1px solid #151515',
        }}>
          {[
            { value: '5', label: 'アセスメント種別' },
            { value: '80+', label: '総評価項目数' },
            { value: '2', label: 'AIプロンプトモード' },
            { value: '0', label: '外部通信' },
          ].map(({ value, label }) => (
            <div key={label} style={{
              padding: '20px 12px', borderRight: '1px solid #151515', textAlign: 'center',
            }}>
              <div style={{ fontSize: 'clamp(1.6rem, 6vw, 2.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.5rem', color: '#333', marginTop: 6, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Active Modules ── */}
        <div style={{ padding: '40px 20px 0' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--accent-green)', letterSpacing: '0.25em', marginBottom: 16 }}>
            // ACTIVE MODULES
          </div>

          {/* NURSING — メインカード */}
          <div style={{
            borderLeft: '2px solid var(--accent-green)', background: '#0d1117',
            padding: '24px 20px', marginBottom: 1,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.12em' }}>NURSING ASSESSMENT</div>
              <div style={{ fontSize: '0.5rem', color: 'var(--accent-green)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block', boxShadow: '0 0 6px var(--accent-green)' }} />
                LIVE
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#444', marginBottom: 20 }}>看護師用退院支援アセスメント</div>
            <div style={{ fontSize: 'clamp(2.2rem, 9vw, 3.5rem)', fontWeight: 700, color: 'var(--accent-green)', lineHeight: 1, marginBottom: 24, textShadow: '0 0 40px rgba(170,255,0,0.25)' }}>
              {MAX_SCORE}<span style={{ fontSize: '0.9rem', color: '#333', marginLeft: 8, fontWeight: 400 }}>PT MAX</span>
            </div>
            {[
              { label: 'CATEGORIES', value: 9, max: 9, pct: 100 },
              { label: 'ITEMS', value: 22, max: 22, pct: 100 },
              { label: 'JUDGMENT LEVELS', value: 3, max: 3, pct: 100 },
            ].map(({ label, value, pct }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: '0.55rem', color: '#444', letterSpacing: '0.12em' }}>{label}</span>
                  <span style={{ fontSize: '0.7rem', color: '#888', fontWeight: 600 }}>{value}</span>
                </div>
                <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-green)', boxShadow: '0 0 6px rgba(170,255,0,0.4)', borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>

          {/* PSW + LONG-TERM */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 1 }}>
            <div style={{ borderLeft: '2px solid var(--accent-cyan)', background: '#0d1117', padding: '20px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>PSW</div>
                <div style={{ fontSize: '0.48rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block' }} />LIVE
                </div>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#333', marginBottom: 16 }}>精神保健福祉士用</div>
              <div style={{ fontSize: 'clamp(1.8rem, 7vw, 2.8rem)', fontWeight: 700, color: 'var(--accent-cyan)', lineHeight: 1, marginBottom: 16, textShadow: '0 0 30px rgba(0,255,255,0.2)' }}>
                {PSW_MAX_SCORE}<span style={{ fontSize: '0.7rem', color: '#333', marginLeft: 6, fontWeight: 400 }}>PT</span>
              </div>
              {[
                { label: 'ITEMS', value: 20, pct: 91 },
                { label: 'AI MODES', value: 2, pct: 100 },
              ].map(({ label, value, pct }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.5rem', color: '#333', letterSpacing: '0.1em' }}>{label}</span>
                    <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{value}</span>
                  </div>
                  <div style={{ height: 2, background: '#1a1a1a' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-cyan)', boxShadow: '0 0 5px rgba(0,255,255,0.3)' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderLeft: '2px solid var(--accent-purple)', background: '#0d1117', padding: '20px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.1em' }}>LONG-TERM</div>
                <div style={{ fontSize: '0.48rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }} />LIVE
                </div>
              </div>
              <div style={{ fontSize: '0.55rem', color: '#333', marginBottom: 16 }}>長期療養アセスメント</div>
              <div style={{ fontSize: 'clamp(1.8rem, 7vw, 2.8rem)', fontWeight: 700, color: 'var(--accent-purple)', lineHeight: 1, marginBottom: 16, textShadow: '0 0 30px rgba(191,95,255,0.2)' }}>
                {LONG_TERM_MAX_SCORE}<span style={{ fontSize: '0.7rem', color: '#333', marginLeft: 6, fontWeight: 400 }}>PT</span>
              </div>
              {[
                { label: 'SPECIALTY', value: '慢性期', pct: 85 },
                { label: 'AI MODES', value: 2, pct: 100 },
              ].map(({ label, value, pct }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.5rem', color: '#333', letterSpacing: '0.1em' }}>{label}</span>
                    <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{value}</span>
                  </div>
                  <div style={{ height: 2, background: '#1a1a1a' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent-purple)', boxShadow: '0 0 5px rgba(191,95,255,0.3)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OTR */}
          <div style={{ borderLeft: '2px solid #00e5cc', background: '#0d1117', padding: '20px', marginBottom: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00e5cc', letterSpacing: '0.12em' }}>OTR ASSESSMENT</div>
              <div style={{ fontSize: '0.5rem', color: '#00e5cc', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#00e5cc', display: 'inline-block', boxShadow: '0 0 6px #00e5cc' }} />
                LIVE
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#444', marginBottom: 16 }}>作業療法士用 — SIGNAL / BRIEF 両対応</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0 32px', alignItems: 'center' }}>
              <div style={{ fontSize: 'clamp(2rem, 8vw, 3rem)', fontWeight: 700, color: '#00e5cc', textShadow: '0 0 30px rgba(0,229,204,0.25)' }}>
                18<span style={{ fontSize: '0.8rem', color: '#333', marginLeft: 6, fontWeight: 400 }}>ITEMS</span>
              </div>
              <div>
                {[
                  { label: 'SCALE', value: '4 → 0', pct: 100 },
                  { label: 'AI MODES', value: 'SIGNAL / BRIEF', pct: 100 },
                ].map(({ label, value, pct }) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.55rem', color: '#444', letterSpacing: '0.1em' }}>{label}</span>
                      <span style={{ fontSize: '0.65rem', color: '#666', fontWeight: 600 }}>{value}</span>
                    </div>
                    <div style={{ height: 2, background: '#1a1a1a' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#00e5cc', boxShadow: '0 0 5px rgba(0,229,204,0.3)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Judgment Criteria — Terminal style ── */}
        <div style={{ margin: '32px 20px 0' }}>
          <div style={{ border: '1px solid #151515', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              padding: '8px 14px', borderBottom: '1px solid #151515',
              display: 'flex', alignItems: 'center', gap: 6, background: '#0d1117',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <span style={{ fontSize: '0.55rem', color: '#333', marginLeft: 8, letterSpacing: '0.1em' }}>judgment-criteria — nursing assessment</span>
            </div>
            <div style={{ background: '#0d1117', padding: '20px' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--accent-orange)', letterSpacing: '0.2em', marginBottom: 16 }}>// JUDGMENT CRITERIA</div>
              {[
                { range: '0 〜 22 pt', label: '集中支援フェーズ', color: 'var(--accent-red)', pct: 33 },
                { range: '23 〜 44 pt', label: '支援継続が必要', color: 'var(--accent-orange)', pct: 67 },
                { range: `45 〜 ${MAX_SCORE} pt`, label: '退院調整可能', color: 'var(--accent-green)', pct: 100 },
              ].map(({ range, label, color, pct }) => (
                <div key={range} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 600 }}>{range}</span>
                    <span style={{ fontSize: '0.75rem', color, fontWeight: 700 }}>{label}</span>
                  </div>
                  <div style={{ height: 2, background: '#151515', borderRadius: 1 }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 1 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── System Specs ── */}
        <div style={{ margin: '1px 20px 48px' }}>
          <div style={{ border: '1px solid #151515', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              padding: '8px 14px', borderBottom: '1px solid #151515',
              display: 'flex', alignItems: 'center', gap: 6, background: '#0d1117',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
              <span style={{ fontSize: '0.55rem', color: '#333', marginLeft: 8, letterSpacing: '0.1em' }}>system-specs — infrastructure</span>
            </div>
            <div style={{ background: '#0d1117' }}>
              {[
                { key: 'DATA_STORAGE', value: 'localforage // ローカル端末のみ', color: 'var(--accent-green)' },
                { key: 'EXTERNAL_COMM', value: 'none // オフライン完全動作', color: 'var(--accent-cyan)' },
                { key: 'PWA_SUPPORT', value: 'enabled // ホーム画面追加可', color: 'var(--accent-purple)' },
                { key: 'AI_PROMPT_GEN', value: 'SIGNAL + BRIEF // 全種別対応', color: '#00e5cc' },
              ].map(({ key, value, color }) => (
                <div key={key} style={{
                  padding: '14px 20px', borderBottom: '1px solid #0f0f0f',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: '0.6rem', color: '#333', letterSpacing: '0.1em', flexShrink: 0 }}>{key}</span>
                  <span style={{ fontSize: '0.65rem', color, textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
