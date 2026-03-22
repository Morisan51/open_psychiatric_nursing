import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  OTR_CATEGORIES,
  OTR_SCORE_LABELS,
  calcOtrTotals,
  calcOtrCategoryTotals,
  type OtrBasicInfo,
  type OtrScores,
} from '../data/otrMasterData';

const SCORES = [4, 3, 2, 1, 0] as const;

const EMPTY_BASIC_INFO: OtrBasicInfo = {
  age: '',
  gender: '',
  mainDiagnosis: '',
  chiefComplaint: '',
  adlStatus: '',
};

function loadFromStorage(): { basicInfo: OtrBasicInfo; scores: OtrScores } {
  try {
    const saved = localStorage.getItem('otr-current');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { basicInfo: EMPTY_BASIC_INFO, scores: {} };
}

export function OTRPage() {
  const navigate = useNavigate();

  const stored = loadFromStorage();
  const [basicInfo, setBasicInfo] = useState<OtrBasicInfo>(stored.basicInfo);
  const [scores, setScores] = useState<OtrScores>(stored.scores);

  useEffect(() => {
    localStorage.setItem('otr-current', JSON.stringify({ basicInfo, scores }));
  }, [basicInfo, scores]);

  const { total, maxPossible, unknownCount } = calcOtrTotals(scores);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const handleScore = (itemKey: string, score: number) => {
    setScores(prev => ({ ...prev, [itemKey]: score }));
  };

  const handleReset = () => {
    setBasicInfo(EMPTY_BASIC_INFO);
    setScores({});
    localStorage.removeItem('otr-current');
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: '#0d1117',
    border: '1px solid #1e2a1e',
    borderRadius: 4,
    color: '#ddd',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#aaa',
    letterSpacing: '0.06em',
    marginBottom: 6,
    display: 'block',
    fontWeight: 600,
  };

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: 640, margin: '0 auto' }}>

      <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 20 }}>
        // OTR ASSESSMENT
      </div>

      {/* ===== 基本情報 ===== */}
      <div style={{
        background: '#0d1117',
        border: '1px solid #1e2a1e',
        borderRadius: 4,
        padding: '16px',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', letterSpacing: '0.15em', marginBottom: 14 }}>
          // BASIC INFO
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>年齢</label>
            <input
              type="number"
              min={0}
              max={120}
              placeholder="例: 45"
              value={basicInfo.age}
              onChange={e => setBasicInfo(p => ({ ...p, age: e.target.value }))}
              style={fieldStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>性別</label>
            <select
              value={basicInfo.gender}
              onChange={e => setBasicInfo(p => ({ ...p, gender: e.target.value as OtrBasicInfo['gender'] }))}
              style={{ ...fieldStyle, appearance: 'none' }}
            >
              <option value="">選択してください</option>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="その他">その他</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>主疾患</label>
          <input
            type="text"
            placeholder="例: 統合失調症"
            value={basicInfo.mainDiagnosis}
            onChange={e => setBasicInfo(p => ({ ...p, mainDiagnosis: e.target.value }))}
            style={fieldStyle}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>主訴</label>
          <textarea
            placeholder="患者の訴え・困りごとを入力"
            value={basicInfo.chiefComplaint}
            onChange={e => setBasicInfo(p => ({ ...p, chiefComplaint: e.target.value }))}
            style={{ ...fieldStyle, minHeight: 72, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={labelStyle}>現在の生活状況（ADL）</label>
          <textarea
            placeholder="ADL・生活状況を入力"
            value={basicInfo.adlStatus}
            onChange={e => setBasicInfo(p => ({ ...p, adlStatus: e.target.value }))}
            style={{ ...fieldStyle, minHeight: 72, resize: 'vertical' }}
          />
        </div>

        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(170,255,0,0.04)',
          border: '1px solid rgba(170,255,0,0.2)',
          borderLeft: '3px solid var(--accent-green)',
          borderRadius: 4,
          fontSize: '0.82rem',
          color: '#aaa',
          lineHeight: 1.7,
        }}>
          主訴とADLを具体的に入力すると、より個別性の高い分析が得られます
        </div>
      </div>

      {/* ===== カテゴリ別スコア ===== */}
      {OTR_CATEGORIES.map(cat => {
        const { catTotal, catMax, catUnknown } = calcOtrCategoryTotals(cat, scores);
        return (
          <div key={cat.key} style={{ marginBottom: 24 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: `1px solid ${cat.color}33`,
            }}>
              <div style={{ fontSize: '0.72rem', color: cat.color, letterSpacing: '0.12em', fontWeight: 700 }}>
                {cat.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#555' }}>
                {catMax > 0 ? `${catTotal} / ${catMax} pt` : '–'}
                {catUnknown > 0 && <span style={{ color: '#444', marginLeft: 8 }}>不明 {catUnknown}項目</span>}
              </div>
            </div>

            {cat.items.map(item => {
              const selected = scores[item.key];
              return (
                <div key={item.key} style={{
                  marginBottom: 10,
                  background: '#0d1117',
                  borderRadius: 4,
                  borderLeft: `2px solid ${cat.color}`,
                  padding: '16px',
                }}>
                  <div style={{
                    fontSize: '1rem',
                    color: cat.color,
                    fontWeight: 600,
                    marginBottom: 14,
                  }}>
                    {item.label}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {SCORES.map(score => {
                      const isSelected = selected === score;
                      const isUnknown = score === 0;
                      const btnColor = isUnknown ? 'var(--status-warning, #ff6b35)' : cat.color;
                      const hoverKey = `${item.key}-${score}`;
                      const isHovered = hoveredKey === hoverKey;
                      return (
                        <button
                          key={score}
                          onClick={() => handleScore(item.key, score)}
                          onMouseEnter={() => setHoveredKey(hoverKey)}
                          onMouseLeave={() => setHoveredKey(null)}
                          style={{
                            padding: '12px 16px',
                            background: isSelected
                              ? (isUnknown ? 'rgba(255,107,53,0.15)' : `${cat.color}20`)
                              : isHovered ? '#1a1f1a' : '#111618',
                            border: `1px solid ${isSelected ? btnColor : isHovered ? '#666' : '#444'}`,
                            borderRadius: 4,
                            color: isSelected ? btnColor : isHovered ? '#eee' : '#ccc',
                            fontFamily: 'inherit',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 700 : 400,
                            transition: 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.03em',
                            minHeight: 52,
                            boxShadow: isSelected
                              ? `0 0 10px ${isUnknown ? 'rgba(255,107,53,0.35)' : `${cat.color}50`}`
                              : 'none',
                          }}
                        >
                          {isUnknown ? '不明' : `${score}：${OTR_SCORE_LABELS[score]}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* ===== 合計スコア ===== */}
      <div style={{
        padding: '20px',
        background: '#0d1117',
        borderRadius: 4,
        border: '1px solid #1e2a1e',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 12 }}>
          // TOTAL SCORE
        </div>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: 4 }}>合計点</div>
            <div style={{ fontSize: '1.6rem', color: 'var(--accent-green)', fontWeight: 700, lineHeight: 1 }}>
              {total}
              <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 400, marginLeft: 6 }}>
                / {maxPossible} pt
              </span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#666', marginBottom: 4 }}>不明・評価不能</div>
            <div style={{ fontSize: '1.6rem', color: '#777', fontWeight: 700, lineHeight: 1 }}>
              {unknownCount}
              <span style={{ fontSize: '0.85rem', color: '#555', fontWeight: 400, marginLeft: 6 }}>項目</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== アクションボタン ===== */}
      <button
        onClick={() => navigate('/otr/detail')}
        style={{
          width: '100%',
          padding: '18px 20px',
          background: 'rgba(170,255,0,0.08)',
          border: '1px solid var(--accent-green)',
          borderRadius: 4,
          color: 'var(--accent-green)',
          fontFamily: 'inherit',
          fontSize: '0.9rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
          boxShadow: '0 0 16px rgba(170,255,0,0.1)',
          transition: 'all 0.2s',
        }}
      >
        <div>
          <div>AIプロンプトを生成</div>
          <div style={{ fontSize: '0.62rem', color: 'rgba(170,255,0,0.5)', marginTop: 3, fontWeight: 400 }}>
            SIGNAL / BRIEF
          </div>
        </div>
        <span style={{ fontSize: '1.2rem' }}>→</span>
      </button>

      <button
        onClick={handleReset}
        style={{
          width: '100%',
          padding: '14px 20px',
          background: 'transparent',
          border: '1px solid #222',
          borderRadius: 4,
          color: '#555',
          fontFamily: 'inherit',
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        リセット
      </button>
    </div>
  );
}
