import { useState } from 'react';
import localforage from 'localforage';
import {
  OTR_CATEGORIES,
  OTR_SCORE_LABELS,
  calcOtrTotals,
  calcOtrCategoryTotals,
  generateOtrSignalPrompt,
  generateOtrBriefPrompt,
  type OtrBasicInfo,
  type OtrScores,
  type OtrAssessment,
} from '../data/otrMasterData';

type Mode = 'signal' | 'brief';

function loadFromStorage(): { basicInfo: OtrBasicInfo; scores: OtrScores } | null {
  try {
    const saved = localStorage.getItem('otr-current');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = getText();
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        width: '100%',
        padding: '18px',
        marginTop: 12,
        background: copied ? 'rgba(170,255,0,0.12)' : 'rgba(170,255,0,0.04)',
        border: `1px solid ${copied ? 'var(--accent-green)' : 'rgba(170,255,0,0.3)'}`,
        borderRadius: 4,
        color: copied ? 'var(--accent-green)' : '#bbb',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        letterSpacing: '0.12em',
        cursor: 'pointer',
        fontWeight: 700,
        transition: 'all 0.2s',
        minHeight: 58,
        boxShadow: copied ? '0 0 12px rgba(170,255,0,0.2)' : 'none',
      }}
    >
      {copied ? '✓ コピーしました' : 'まるっとコピー'}
    </button>
  );
}

const SCORE_COLORS: Record<number, string> = {
  4: 'var(--accent-green)',
  3: 'var(--accent-cyan)',
  2: 'var(--accent-yellow)',
  1: 'var(--accent-red, #ff4444)',
  0: '#666',
};

export function OTRDetailPage() {
  const data = loadFromStorage();
  const [mode, setMode] = useState<Mode>('signal');
  const [saved, setSaved] = useState(false);

  if (!data) {
    return (
      <div style={{ padding: '40px 16px', textAlign: 'center', color: '#555', fontSize: '0.9rem' }}>
        <div style={{ marginBottom: 8 }}>データが見つかりません。</div>
        <div style={{ fontSize: '0.75rem', color: '#444' }}>OTR入力画面でアセスメントを入力してください。</div>
      </div>
    );
  }

  const { basicInfo, scores } = data;
  const { total, unknownCount } = calcOtrTotals(scores);
  const answeredCount = Object.keys(scores).length;

  const handleSave = async () => {
    const id = `otr-${Date.now()}`;
    const record: OtrAssessment = {
      id,
      savedAt: Date.now(),
      basicInfo,
      scores,
    };
    const history = (await localforage.getItem<OtrAssessment[]>('otrAssessments')) ?? [];
    await localforage.setItem('otrAssessments', [...history, record]);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 8px',
    background: active ? 'rgba(170,255,0,0.06)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent-green)' : '2px solid transparent',
    color: active ? 'var(--accent-green)' : '#555',
    fontFamily: 'inherit',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    transition: 'all 0.15s',
    textAlign: 'left' as const,
    lineHeight: 1.4,
  });

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: 640, margin: '0 auto' }}>

      <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 16 }}>
        // OTR DETAIL
      </div>

      {/* ===== 基本情報サマリー ===== */}
      <div style={{
        background: '#0d1117',
        border: '1px solid #1e2a1e',
        borderRadius: 4,
        padding: '14px 16px',
        marginBottom: 16,
      }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
          // PATIENT INFO
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#555', marginBottom: 2 }}>年齢 / 性別</div>
            <div style={{ fontSize: '0.9rem', color: '#ccc', fontWeight: 600 }}>
              {basicInfo.age ? `${basicInfo.age}歳` : 'N/A'} / {basicInfo.gender || 'N/A'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#555', marginBottom: 2 }}>主疾患</div>
            <div style={{ fontSize: '0.9rem', color: '#ccc', fontWeight: 600 }}>
              {basicInfo.mainDiagnosis || 'N/A'}
            </div>
          </div>
        </div>
        {basicInfo.chiefComplaint && (
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: '0.62rem', color: '#555', marginBottom: 2 }}>主訴</div>
            <div style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: 1.6 }}>{basicInfo.chiefComplaint}</div>
          </div>
        )}
        {Array.isArray(basicInfo.adlStatus)
          ? basicInfo.adlStatus.some(s => s.trim()) && (
            <div>
              <div style={{ fontSize: '0.62rem', color: '#555', marginBottom: 4 }}>ADL・生活状況</div>
              {basicInfo.adlStatus.map((s, i) => s.trim() ? (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontSize: '0.7rem', color: '#555', flexShrink: 0, marginTop: 2 }}>
                    {['①','②','③','④','⑤'][i]}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: 1.6 }}>{s}</span>
                </div>
              ) : null)}
            </div>
          )
          : (basicInfo.adlStatus as unknown as string) && (
            <div>
              <div style={{ fontSize: '0.62rem', color: '#555', marginBottom: 2 }}>ADL・生活状況</div>
              <div style={{ fontSize: '0.82rem', color: '#aaa', lineHeight: 1.6 }}>{basicInfo.adlStatus as unknown as string}</div>
            </div>
          )
        }
      </div>

      {/* ===== スコアサマリー ===== */}
      <div style={{
        background: '#0d1117',
        border: '1px solid #1e2a1e',
        borderRadius: 4,
        padding: '16px',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 16 }}>
          // SCORE SUMMARY
        </div>

        {/* 総得点バー */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-green)', fontWeight: 700, letterSpacing: '0.08em' }}>
              TOTAL SCORE
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: '1.6rem', color: 'var(--accent-green)', fontWeight: 700, lineHeight: 1 }}>{total}</span>
              <span style={{ fontSize: '0.78rem', color: '#555' }}>/ 72 pt</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-green)', opacity: 0.7, marginLeft: 4 }}>
                {Math.round((total / 72) * 100)}%
              </span>
            </div>
          </div>
          <div style={{ height: 12, background: '#111', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(total / 72) * 100}%`,
              background: 'linear-gradient(90deg, var(--accent-green), rgba(170,255,0,0.6))',
              borderRadius: 6,
              transition: 'width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              boxShadow: '0 0 8px rgba(170,255,0,0.4)',
            }} />
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            <span style={{ fontSize: '0.65rem', color: '#555' }}>
              不明・評価不能 <span style={{ color: '#777', fontWeight: 700 }}>{unknownCount}</span> 項目
            </span>
            <span style={{ fontSize: '0.65rem', color: '#555' }}>
              評価済み <span style={{ color: '#777', fontWeight: 700 }}>{answeredCount}</span> / 18 項目
            </span>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 16 }}>
          {/* カテゴリ別バー */}
          {OTR_CATEGORIES.map(cat => {
            const { catTotal, catUnknown } = calcOtrCategoryTotals(cat, scores);
            const catAbsMax = cat.items.length * 4;
            const pct = catAbsMax > 0 ? (catTotal / catAbsMax) * 100 : 0;
            return (
              <div key={cat.key} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                  <div style={{ fontSize: '0.78rem', color: cat.color, fontWeight: 700 }}>
                    {cat.label}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: '1rem', color: cat.color, fontWeight: 700 }}>{catTotal}</span>
                    <span style={{ fontSize: '0.72rem', color: '#555' }}>/ {catAbsMax} pt</span>
                    {catUnknown > 0 && (
                      <span style={{ fontSize: '0.62rem', color: '#444', marginLeft: 4 }}>不明{catUnknown}</span>
                    )}
                  </div>
                </div>
                <div style={{ height: 8, background: '#111', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: cat.color,
                    borderRadius: 4,
                    transition: 'width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    opacity: 0.85,
                  }} />
                </div>
                {/* 項目別スコア */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                  {cat.items.map(item => {
                    const s = scores[item.key];
                    const isUndefined = s === undefined;
                    return (
                      <div key={item.key} style={{
                        padding: '3px 8px',
                        background: '#0a0f0a',
                        border: `1px solid ${isUndefined ? '#1a1a1a' : (s === 0 ? '#333' : `${cat.color}44`)}`,
                        borderRadius: 3,
                        fontSize: '0.68rem',
                        display: 'flex',
                        gap: 4,
                        alignItems: 'center',
                      }}>
                        <span style={{ color: '#666' }}>{item.label}</span>
                        <span style={{ color: isUndefined ? '#333' : (s === 0 ? '#555' : cat.color), fontWeight: 700 }}>
                          {isUndefined ? '–' : (s === 0 ? '不明' : `${s}pt`)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* SCORE LEGEND */}
        <div style={{ marginTop: 6, padding: '10px 0', borderTop: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em', marginBottom: 6 }}>SCORE LEGEND</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {[4, 3, 2, 1, 0].map(s => (
              <div key={s} style={{ fontSize: '0.65rem', color: SCORE_COLORS[s] }}>
                {s}：{OTR_SCORE_LABELS[s]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== SIGNAL / BRIEF モード切替 ===== */}
      <div style={{
        display: 'flex',
        background: '#0d1117',
        borderRadius: 6,
        border: '1px solid #1e2a1e',
        marginBottom: 20,
        overflow: 'hidden',
      }}>
        <button style={tabStyle(mode === 'signal')} onClick={() => setMode('signal')}>
          <div style={{ fontWeight: 700 }}>SIGNAL</div>
          <div style={{ fontSize: '0.6rem', color: mode === 'signal' ? '#888' : '#444', marginTop: 2 }}>
            圧縮・即時・現場判断用
          </div>
        </button>
        <div style={{ width: 1, background: '#1e2a1e' }} />
        <button style={tabStyle(mode === 'brief')} onClick={() => setMode('brief')}>
          <div style={{ fontWeight: 700 }}>BRIEF</div>
          <div style={{ fontSize: '0.6rem', color: mode === 'brief' ? '#888' : '#444', marginTop: 2 }}>
            詳細・カンファレンス・計画立案用
          </div>
        </button>
      </div>

      {/* ===== AIプロンプト表示 ===== */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
          // AI PROMPT（データ埋め込み済み）
        </div>
        <div style={{
          background: '#070d07',
          border: '1px solid #1e2a1e',
          borderRadius: 4,
          padding: '14px 16px',
          fontSize: '0.82rem',
          color: '#bbb',
          lineHeight: 1.9,
          whiteSpace: 'pre-wrap',
          fontFamily: 'inherit',
          letterSpacing: '0.02em',
        }}>
          {mode === 'signal'
            ? generateOtrSignalPrompt(basicInfo, scores)
            : generateOtrBriefPrompt(basicInfo, scores)}
        </div>
      </div>

      <CopyButton
        getText={() => mode === 'signal'
          ? generateOtrSignalPrompt(basicInfo, scores)
          : generateOtrBriefPrompt(basicInfo, scores)}
      />

      {/* ===== 保存ボタン ===== */}
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '14px 20px',
          marginTop: 10,
          background: saved ? 'rgba(170,255,0,0.06)' : 'transparent',
          border: `1px solid ${saved ? 'var(--accent-green)' : '#333'}`,
          borderRadius: 4,
          color: saved ? 'var(--accent-green)' : '#777',
          fontFamily: 'inherit',
          fontSize: '0.82rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          fontWeight: saved ? 700 : 400,
          transition: 'all 0.2s',
        }}
      >
        {saved ? '✓ 履歴に保存しました' : '履歴に保存する'}
      </button>

      {/* ===== AI使用のヒント ===== */}
      <div style={{
        marginTop: 12,
        padding: '14px 16px',
        background: 'rgba(170,255,0,0.05)',
        border: '1px solid rgba(170,255,0,0.25)',
        borderLeft: '3px solid var(--accent-green)',
        borderRadius: 4,
        fontSize: '0.85rem',
        color: '#ccc',
        lineHeight: 1.9,
        fontWeight: 500,
      }}>
        コピーした内容をAIに貼り付けてください。<br />
        <br />
        <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>【精度を上げる4つのコツ】</span><br />
        1. 上位モデルを使う（Claude Opus / GPT-4o / Gemini Pro）<br />
        <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ フリープランでもモデル切替で精度が大きく変わります</span><br />
        2. GPTは「深く考える」モードで実行する<br />
        <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ o1 / o3 / Deep Research などの推論モードを活用</span><br />
        3. 出力後「もっと具体的に」と追加で指示する<br />
        <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ 1回で完璧を求めず、対話で精度を上げるのがAI活用の基本</span><br />
        4. メモアプリに入れて保存する<br />
        <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ 出力結果をそのまま記録・共有・引継ぎに活用</span><br />
        <br />
        <span style={{ color: 'var(--status-warning)', fontWeight: 700 }}>【出力は必ず叩き台として扱ってください】</span><br />
        <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
          AIの出力には事実誤認・制度の変更・患者固有の事情の見落としが含まれる可能性があります。
        </span>
      </div>
    </div>
  );
}
