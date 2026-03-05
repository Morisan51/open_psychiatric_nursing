import { useNavigate } from 'react-router-dom';
import {
  CATEGORIES,
  CATEGORY_COLORS,
  ITEMS_BY_CATEGORY,
  MAX_SCORE,
} from '../data/masterData';
import type { CategoryName } from '../data/masterData';
import { useAssessmentContext } from '../context/AssessmentContext';
import { EvaluationItemCard } from '../components/assessment/EvaluationItemCard';

export function AssessmentPage() {
  const navigate = useNavigate();
  const {
    state,
    setMemo,
    selectOption,
    reset,
    totalScore,
    answeredCount,
    scoredItemCount,
    isComplete,
  } = useAssessmentContext();

  const progress = Math.round((answeredCount / scoredItemCount) * 100);

  return (
    <div>

      {/* 全体進捗バー（sticky） */}
      <div
        style={{
          padding: '10px 16px',
          background: '#0a0f0a',
          borderBottom: '1px solid #1e2a1e',
          position: 'sticky',
          top: 100,
          zIndex: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#aaa',
            marginBottom: 6,
          }}
        >
          <span>{answeredCount} / {scoredItemCount} 項目</span>
          <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.9rem' }}>
            {totalScore}
            <span style={{ fontSize: '0.65rem', color: '#777', fontWeight: 400 }}> / {MAX_SCORE} pt</span>
          </span>
        </div>
        <div style={{ height: 2, background: '#1e2a1e', borderRadius: 1, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--accent-green)',
              boxShadow: '0 0 6px var(--accent-green)',
              transition: 'width 0.3s',
            }}
          />
        </div>
      </div>

      {/* メモ欄 */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e2a1e' }}>
        <label
          style={{
            display: 'block',
            fontSize: '0.7rem',
            color: '#888',
            letterSpacing: '0.1em',
            marginBottom: 8,
          }}
        >
          // MEMO（個人情報不可 — 「Aさん」「3号室」など）
        </label>
        <input
          type="text"
          value={state.memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="任意のメモ"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: '#0d1117',
            border: '1px solid #2a3a2a',
            borderRadius: 2,
            color: '#ddd',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            outline: 'none',
            minHeight: 44,
          }}
        />
      </div>

      {/* 全カテゴリを縦スクロール */}
      {CATEGORIES.map((category: CategoryName) => {
        const color = CATEGORY_COLORS[category];
        const items = ITEMS_BY_CATEGORY[category] ?? [];

        return (
          <section key={category} id={`cat-${category}`}>

            {/* カテゴリヘッダー */}
            <div
              style={{
                padding: '20px 16px 10px',
                borderBottom: `1px solid ${color}30`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 20,
                  background: color,
                  boxShadow: `0 0 8px ${color}`,
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color,
                    letterSpacing: '0.1em',
                  }}
                >
                  {category}
                </div>
                <div style={{ fontSize: '0.65rem', color: '#777', marginTop: 2 }}>
                  {items.filter(i => !i.isInfoOnly).length} 項目
                  {items.filter(i => !i.isInfoOnly && i.key in state.evaluations).length > 0 && (
                    <span style={{ color: 'var(--accent-green)', marginLeft: 6 }}>
                      ✓ {items.filter(i => !i.isInfoOnly && i.key in state.evaluations).length} 完了
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 項目カード */}
            <div style={{ padding: '12px 16px' }}>
              {items.map(item => (
                <EvaluationItemCard
                  key={item.key}
                  item={item}
                  entry={state.evaluations[item.key]}
                  onSelect={selectOption}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* サマリーへ進むボタン */}
      <div style={{ padding: '16px', paddingBottom: 8 }}>
        {isComplete ? (
          <button
            onClick={() => navigate('/summary')}
            style={{
              width: '100%',
              padding: '18px',
              background: 'rgba(170,255,0,0.1)',
              border: '1px solid var(--accent-green)',
              borderRadius: 4,
              color: 'var(--accent-green)',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              letterSpacing: '0.15em',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(170,255,0,0.2)',
              minHeight: 56,
            }}
          >
            サマリーを見る →
          </button>
        ) : (
          <div
            style={{
              padding: '14px',
              background: '#0d1117',
              border: '1px solid #2a2a2a',
              borderRadius: 4,
              textAlign: 'center',
              fontSize: '0.75rem',
              color: '#666',
            }}
          >
            残り {scoredItemCount - answeredCount} 項目を評価するとサマリーが表示されます
          </div>
        )}
      </div>

      {/* クリアボタン */}
      <div style={{ padding: '8px 16px 32px' }}>
        <div style={{ fontSize: '0.6rem', color: '#333', letterSpacing: '0.15em', marginBottom: 8, textAlign: 'center' }}>
          // RESET
        </div>
        <button
          onClick={() => {
            if (window.confirm('アセスメントの内容をすべてクリアしますか？')) {
              reset();
            }
          }}
          style={{
            width: '100%',
            padding: '14px',
            background: 'rgba(255,60,60,0.04)',
            border: '1px solid rgba(255,60,60,0.25)',
            borderRadius: 4,
            color: '#cc4444',
            fontFamily: 'inherit',
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            transition: 'all 0.15s',
            minHeight: 48,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,60,60,0.1)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,60,60,0.5)';
            (e.currentTarget as HTMLElement).style.color = '#ff5555';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,60,60,0.04)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,60,60,0.25)';
            (e.currentTarget as HTMLElement).style.color = '#cc4444';
          }}
        >
          アセスメントをクリア
        </button>
      </div>
    </div>
  );
}
