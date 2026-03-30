import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localforage from 'localforage';
import { useAssessmentContext } from '../context/AssessmentContext';
import { SummaryTable } from '../components/summary/SummaryTable';

// カテゴリ別の最大スコアを算出
import type { EvaluationItem } from '../data/masterData';

function getCategoryMaxScore(category: string, itemsByCategory: Record<string, EvaluationItem[]>): number {
  return (itemsByCategory[category] ?? [])
    .filter(i => !i.isInfoOnly)
    .reduce((sum, item) => {
      const max = Math.max(...item.options.map(o => o.score ?? 0));
      return sum + max;
    }, 0);
}

// カテゴリ別の取得スコアを集計
function getCategoryScore(
  category: string,
  evaluations: Record<string, { category: string; score: number }>
): number {
  return Object.values(evaluations)
    .filter(e => e.category === category)
    .reduce((sum, e) => sum + e.score, 0);
}

const JUDGMENT_COLOR = {
  low: 'var(--accent-red, #ff4444)',
  mid: 'var(--accent-orange, #ff8c00)',
  high: 'var(--accent-green)',
};

export function SummaryPage() {
  const navigate = useNavigate();
  const {
    state, totalScore, answeredCount, unknownItems, reset,
    categories, categoryColors, itemsByCategory, maxScore, scoredItems, getJudgmentFn,
  } = useAssessmentContext();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [summaryNotes, setSummaryNotes] = useState<string[]>(() => {
    try {
      const s = localStorage.getItem('summary-notes');
      if (!s) return ['', '', '', '', ''];
      const parsed = JSON.parse(s);
      // 旧形式（配列）との互換性 + 24時間TTLチェック
      if (Array.isArray(parsed)) return parsed;
      const { notes, savedAt } = parsed as { notes: string[]; savedAt: number };
      const TTL_MS = 24 * 60 * 60 * 1000; // 24時間
      if (Date.now() - savedAt > TTL_MS) {
        localStorage.removeItem('summary-notes');
        return ['', '', '', '', ''];
      }
      return notes;
    } catch { return ['', '', '', '', '']; }
  });
  const updateSummaryNote = (i: number, value: string) => {
    const next = [...summaryNotes];
    next[i] = value;
    setSummaryNotes(next);
    localStorage.setItem('summary-notes', JSON.stringify({ notes: next, savedAt: Date.now() }));
  };

  const judgment = getJudgmentFn(totalScore);
  const pct = Math.round((totalScore / maxScore) * 100);

  // 未回答の採点対象項目
  const unanswered = scoredItems.filter(item => !(item.key in state.evaluations));

  const handleSave = async () => {
    setSaving(true);
    const record = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      totalScore,
      pct,
      judgment: judgment.text,
      answeredCount,
      memo: state.memo,
      evaluations: state.evaluations,
    };
    const history: typeof record[] = (await localforage.getItem('history')) ?? [];
    history.unshift(record);
    await localforage.setItem('history', history);
    setSaved(true);
    setSaving(false);
  };

  const handleReset = () => {
    if (window.confirm('アセスメントをリセットしますか？\n現在のデータは消去されます。')) {
      reset();
      navigate('/assess');
    }
  };

  const scoreColor =
    answeredCount === 0
      ? '#555'
      : JUDGMENT_COLOR[judgment.level];

  return (
    <div style={{ padding: '24px 16px 120px', maxWidth: 520, margin: '0 auto' }}>

      {/* ヘッダー */}
      <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 20 }}>
        // ASSESSMENT SUMMARY
      </div>

      {/* ① 合計スコア */}
      <div style={{
        background: '#0d1117',
        borderRadius: 6,
        borderLeft: `3px solid ${scoreColor}`,
        padding: '28px 24px 20px',
        marginBottom: 16,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'clamp(3.5rem, 18vw, 6rem)',
          fontWeight: 700,
          color: scoreColor,
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}>
          {answeredCount === 0 ? '—' : totalScore}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#555', marginTop: 4 }}>
          / {maxScore} pt
        </div>

        {/* 進捗バー */}
        {answeredCount > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              height: 6,
              background: '#1a1f1a',
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: scoreColor,
                borderRadius: 3,
                transition: 'width 0.4s ease',
                boxShadow: `0 0 8px ${scoreColor}80`,
              }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#666', marginTop: 6 }}>
              {pct}% / 回答済み {answeredCount} / {scoredItems.length} 項目
            </div>
          </div>
        )}
      </div>

      {/* ② 判定 */}
      {answeredCount > 0 && (
        <div style={{
          background: `${scoreColor}18`,
          border: `1px solid ${scoreColor}50`,
          borderRadius: 6,
          padding: '14px 16px',
          marginBottom: 20,
        }}>
          <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.15em', marginBottom: 6 }}>
            JUDGMENT
          </div>
          <div style={{ fontSize: '0.9rem', color: scoreColor, fontWeight: 700, lineHeight: 1.5 }}>
            {judgment.text}
          </div>
        </div>
      )}

      {/* ③ カテゴリ別スコア */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 12 }}>
          // CATEGORY BREAKDOWN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.filter(cat => getCategoryMaxScore(cat, itemsByCategory) > 0).map(cat => {
            const catScore = getCategoryScore(cat, state.evaluations);
            const catMax = getCategoryMaxScore(cat, itemsByCategory);
            const catPct = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
            const color = categoryColors[cat];
            const catItems = (itemsByCategory[cat] ?? []).filter(i => !i.isInfoOnly);
            const answered = catItems.filter(i => i.key in state.evaluations).length;

            return (
              <div key={cat} style={{
                background: '#0d1117',
                borderRadius: 4,
                padding: '10px 14px',
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 6,
                }}>
                  <span style={{ fontSize: '0.82rem', color, fontWeight: 600 }}>{cat}</span>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>
                    {catScore} / {catMax} pt
                    <span style={{ color: '#555', fontSize: '0.65rem', marginLeft: 6 }}>
                      ({answered}/{catItems.length})
                    </span>
                  </span>
                </div>
                <div style={{ height: 4, background: '#1a1f1a', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${catPct}%`,
                    background: color,
                    borderRadius: 2,
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ④ 要確認項目（isUnknown） */}
      {unknownItems.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
            // REQUIRES CONFIRMATION
          </div>
          <div style={{
            background: '#0d1117',
            borderLeft: '2px solid var(--accent-orange, #ff8c00)',
            borderRadius: 4,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            {unknownItems.map(e => (
              <div key={e.item} style={{
                fontSize: '0.82rem',
                color: '#ccc',
                display: 'flex',
                gap: 8,
              }}>
                <span style={{ color: 'var(--accent-orange, #ff8c00)', flexShrink: 0 }}>!</span>
                <span>{e.category} / <span style={{ color: '#aaa' }}>{e.item}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⑤ 未回答項目 */}
      {unanswered.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
            // UNANSWERED ({unanswered.length})
          </div>
          <div style={{
            background: '#0d1117',
            borderRadius: 4,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}>
            {unanswered.map(item => (
              <div key={item.key} style={{
                fontSize: '0.78rem',
                color: '#666',
                display: 'flex',
                gap: 8,
              }}>
                <span style={{ color: '#333', flexShrink: 0 }}>—</span>
                <span>{item.category} / {item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⑥ メモ */}
      {state.memo && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
            // MEMO
          </div>
          <div style={{
            background: '#0d1117',
            borderRadius: 4,
            padding: '12px 14px',
            fontSize: '0.82rem',
            color: '#aaa',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}>
            {state.memo}
          </div>
        </div>
      )}

      {/* ⑥.5 退院支援サマリーテーブル */}
      {answeredCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 12 }}>
            // DISCHARGE SUMMARY TABLE
          </div>
          <SummaryTable
            evaluations={state.evaluations}
            totalScore={totalScore}
            unknownItems={unknownItems}
          />
        </div>
      )}

      {/* 特記事項 ①〜⑤ */}
      {answeredCount > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 12 }}>
            // 特記事項（手入力）
          </div>
          <div style={{
            background: '#0d1117',
            borderRadius: 6,
            border: '1px solid #1e2a1e',
            overflow: 'hidden',
          }}>
            {summaryNotes.map((note, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '5rem 1fr',
                borderBottom: i < 4 ? '1px solid #1e2a1e' : 'none',
                minHeight: 52,
              }}>
                <div style={{
                  padding: '10px 12px',
                  fontSize: '0.75rem',
                  color: '#666',
                  borderRight: '1px solid #1e2a1e',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}>
                  特記事項{['①','②','③','④','⑤'][i]}
                </div>
                <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center' }}>
                  <textarea
                    value={note}
                    onChange={e => updateSummaryNote(i, e.target.value)}
                    placeholder={`特記事項${['①','②','③','④','⑤'][i]}を入力`}
                    rows={2}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid #2a2a2a',
                      color: note ? '#ccc' : '#444',
                      fontFamily: 'inherit',
                      fontSize: '0.82rem',
                      lineHeight: 1.6,
                      padding: '4px 0',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⑦ ボタン群 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        {/* エグゼクティブサマリーへ */}
        {answeredCount > 0 && (
          <button
            onClick={() => navigate('/executive')}
            style={{
              width: '100%',
              padding: '16px',
              background: 'rgba(170,255,0,0.06)',
              border: '1px solid var(--accent-green)',
              borderRadius: 4,
              color: 'var(--accent-green)',
              fontFamily: 'inherit',
              fontSize: '0.88rem',
              letterSpacing: '0.1em',
              cursor: 'pointer',
              fontWeight: 700,
              minHeight: 52,
              transition: 'all 0.15s',
            }}
          >
            エグゼクティブサマリーを作成 →
          </button>
        )}

        <button
          onClick={handleSave}
          disabled={saving || saved || answeredCount === 0}
          style={{
            padding: '16px',
            background: saved ? '#1a2a1a' : 'transparent',
            border: `1px solid ${saved ? 'var(--accent-green)' : answeredCount === 0 ? '#222' : 'var(--accent-green)'}`,
            borderRadius: 4,
            color: saved ? 'var(--accent-green)' : answeredCount === 0 ? '#333' : 'var(--accent-green)',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            cursor: answeredCount === 0 || saved ? 'default' : 'pointer',
            fontWeight: 700,
            minHeight: 52,
            transition: 'all 0.2s',
          }}
        >
          {saved ? '✓ 履歴に保存しました' : saving ? '保存中...' : '履歴に保存'}
        </button>

        <button
          onClick={() => navigate('/assess')}
          style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            border: '1px solid #2a2a2a',
            borderRadius: 4,
            color: '#888',
            fontFamily: 'inherit',
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            minHeight: 48,
          }}
        >
          ← アセスメントへ戻る
        </button>

        <button
          onClick={handleReset}
          style={{
            padding: '14px',
            background: 'transparent',
            border: '1px solid #1f1010',
            borderRadius: 4,
            color: '#4a2020',
            fontFamily: 'inherit',
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          リセット（新規アセスメント開始）
        </button>
      </div>
    </div>
  );
}
