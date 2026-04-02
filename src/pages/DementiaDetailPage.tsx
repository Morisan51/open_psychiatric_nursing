import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEMENTIA_DIRECTIONS,
  getDementiaVisibleItems,
  generateDementiaSignalPrompt,
  generateDementiaBriefPrompt,
} from '../data/dementiaAssessmentData';
import { useDementiaAssessmentContext } from '../context/DementiaAssessmentContext';

const ACCENT = 'var(--accent-orange)';
const ACCENT_RGBA = 'rgba(255,107,53,';

type Mode = 'signal' | 'brief';

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
        background: copied ? `${ACCENT_RGBA}0.12)` : `${ACCENT_RGBA}0.04)`,
        border: `1px solid ${copied ? ACCENT : `${ACCENT_RGBA}0.3)`}`,
        borderRadius: 4,
        color: copied ? ACCENT : '#bbb',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        letterSpacing: '0.12em',
        cursor: 'pointer',
        fontWeight: 700,
        transition: 'all 0.2s',
        minHeight: 58,
        boxShadow: copied ? `0 0 12px ${ACCENT_RGBA}0.2)` : 'none',
      }}
    >
      {copied ? '✓ コピーしました' : 'まるっとコピー'}
    </button>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 8,
      padding: '8px 0',
      borderBottom: '1px solid #111',
      fontSize: '0.78rem',
    }}>
      <span style={{ color: '#555' }}>{label}</span>
      <span style={{ color: color ?? '#ccc', wordBreak: 'break-all' }}>{value || '—'}</span>
    </div>
  );
}

export function DementiaDetailPage() {
  const navigate = useNavigate();
  const { state } = useDementiaAssessmentContext();
  const [mode, setMode] = useState<Mode>('signal');

  const directionDef = DEMENTIA_DIRECTIONS.find(d => d.key === state.direction);
  const visibleItems = getDementiaVisibleItems(state.direction, state.radioAnswers);

  // 回答済み件数
  let answered = 0;
  for (const item of visibleItems) {
    if (item.type === 'radio' && state.radioAnswers[item.key]) answered++;
    else if (item.type === 'checkbox' && (state.checkboxAnswers[item.key]?.length ?? 0) > 0) answered++;
    else if (item.type === 'text' && state.textAnswers[item.key]?.trim()) answered++;
  }

  const getPrompt = () => {
    const data = {
      basicInfo: state.basicInfo,
      direction: state.direction,
      directionReason: state.directionReason,
      radioAnswers: state.radioAnswers,
      checkboxAnswers: state.checkboxAnswers,
      textAnswers: state.textAnswers,
      memo: state.memo,
    };
    return mode === 'signal'
      ? generateDementiaSignalPrompt(data)
      : generateDementiaBriefPrompt(data);
  };

  if (!state.direction) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ color: '#555', fontSize: '0.85rem', marginBottom: 20 }}>
          方向性が未選択です。アセスメントに戻って入力してください。
        </div>
        <button
          onClick={() => navigate('/dementia')}
          style={{
            padding: '14px 24px',
            background: `${ACCENT_RGBA}0.08)`,
            border: `1px solid ${ACCENT}`,
            borderRadius: 4,
            color: ACCENT,
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          ← アセスメントに戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 16px 60px' }}>

      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <button
          onClick={() => navigate('/dementia')}
          style={{
            padding: '8px 14px',
            background: 'transparent',
            border: `1px solid #2a2a2a`,
            borderRadius: 4,
            color: '#666',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            cursor: 'pointer',
          }}
        >
          ← 編集に戻る
        </button>
        <div style={{ fontSize: '0.65rem', color: '#444' }}>
          {answered} / {visibleItems.length} 項目入力済み
        </div>
      </div>

      {/* 方向性サマリー */}
      <div style={{
        padding: '16px',
        background: `${ACCENT_RGBA}0.06)`,
        border: `1px solid ${ACCENT_RGBA}0.3)`,
        borderRadius: 4,
        marginBottom: 20,
      }}>
        <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.15em', marginBottom: 6 }}>
          // DIRECTION
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: directionDef ? 8 : 0,
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: directionDef?.color ?? ACCENT,
            boxShadow: `0 0 8px ${directionDef?.color ?? ACCENT}`,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e8e8e8' }}>
            {directionDef?.label}
          </span>
        </div>
        {state.directionReason && (
          <div style={{ fontSize: '0.72rem', color: '#888', marginLeft: 18, lineHeight: 1.6 }}>
            {state.directionReason}
          </div>
        )}
      </div>

      {/* 入力サマリー */}
      <div style={{
        background: '#0d1117',
        border: '1px solid #1a1a1a',
        borderRadius: 4,
        marginBottom: 24,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px',
          borderBottom: '1px solid #1a1a1a',
          fontSize: '0.6rem',
          color: '#444',
          letterSpacing: '0.15em',
        }}>
          // INPUT SUMMARY
        </div>
        <div style={{ padding: '8px 14px 12px' }}>
          <SummaryRow label="性別" value={state.basicInfo.gender} />
          <SummaryRow label="年齢" value={state.basicInfo.age} />
          <SummaryRow label="疾患名" value={state.basicInfo.diagnosis} />
          <SummaryRow label="身体合併症" value={state.basicInfo.comorbidities} />
          {visibleItems
            .filter(item => item.type !== 'text')
            .map(item => {
              let value = '—';
              if (item.type === 'radio') {
                const v = state.radioAnswers[item.key];
                value = v ? (item.options?.find(o => o.value === v)?.label ?? v) : '—';
              } else if (item.type === 'checkbox') {
                const v = state.checkboxAnswers[item.key] ?? [];
                value = v.length > 0 ? v.join(' / ') : '—';
              }
              const isAnswered = value !== '—';
              return (
                <SummaryRow
                  key={item.key}
                  label={`${item.itemLabel}`}
                  value={value}
                  color={isAnswered ? '#ccc' : '#333'}
                />
              );
            })}

          {/* テキスト項目 */}
          {visibleItems
            .filter(item => item.type === 'text')
            .map(item => {
              const v = state.textAnswers[item.key] ?? '';
              return (
                <SummaryRow
                  key={item.key}
                  label={item.itemLabel}
                  value={v || '—'}
                  color={v ? '#ccc' : '#333'}
                />
              );
            })}

          {state.memo && (
            <SummaryRow label="備考" value={state.memo} />
          )}
        </div>
      </div>

      {/* モード切替 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 8,
        marginBottom: 16,
      }}>
        {(['signal', 'brief'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '12px',
              background: mode === m ? `${ACCENT_RGBA}0.1)` : 'transparent',
              border: `1px solid ${mode === m ? ACCENT : '#2a2a2a'}`,
              borderRadius: 4,
              color: mode === m ? ACCENT : '#555',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              fontWeight: mode === m ? 700 : 400,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {m === 'signal' ? 'SIGNAL（簡潔版）' : 'BRIEF（詳細版）'}
          </button>
        ))}
      </div>

      {/* モード説明 */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid #1a1a1a',
        borderRadius: 4,
        marginBottom: 16,
        fontSize: '0.7rem',
        color: '#555',
        lineHeight: 1.6,
      }}>
        {mode === 'signal'
          ? 'SIGNAL：現場で即使える簡潔版。今の状態・見立て・今すべきこと・注意サイン・次の評価時期を出力。'
          : 'BRIEF：カンファレンス・教育用の詳細版。方向性の根拠・各領域の現状・家族への伝え方・チーム共有事項を出力。'
        }
      </div>

      {/* プロンプトプレビュー */}
      <div style={{
        background: '#060a06',
        border: '1px solid #1a1a1a',
        borderRadius: 4,
        padding: '14px',
        marginBottom: 8,
        maxHeight: 280,
        overflow: 'auto',
      }}>
        <pre style={{
          fontSize: '0.68rem',
          color: '#555',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          margin: 0,
        }}>
          {getPrompt()}
        </pre>
      </div>

      <CopyButton getText={getPrompt} />

      <div style={{
        marginTop: 16,
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.01)',
        border: '1px solid #151515',
        borderRadius: 4,
        fontSize: '0.68rem',
        color: '#333',
        lineHeight: 1.7,
      }}>
        コピー後、Claude・ChatGPT等のAIに貼り付けて実行してください。<br />
        AIは「問題点の列挙」ではなく「この人の今と、これからをどう支えるか」を軸に出力します。
      </div>
    </div>
  );
}
