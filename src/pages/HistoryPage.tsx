import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { CATEGORY_COLORS, CATEGORIES, ITEMS_BY_CATEGORY } from '../data/masterData';
import { PSW_CATEGORY_COLORS, PSW_CATEGORIES, PSW_ITEMS_BY_CATEGORY } from '../data/pswMasterData';

// 看護師・PSW両方のカラーをマージ（履歴の混在表示に対応）
const ALL_CATEGORY_COLORS = { ...CATEGORY_COLORS, ...PSW_CATEGORY_COLORS };
const ALL_CATEGORIES = [...CATEGORIES, ...PSW_CATEGORIES];
const ALL_ITEMS_BY_CATEGORY = { ...ITEMS_BY_CATEGORY, ...PSW_ITEMS_BY_CATEGORY };
import type { EvaluationEntry } from '../hooks/useAssessment';

interface HistoryRecord {
  id: number;
  savedAt: string;
  totalScore: number;
  pct: number;
  judgment: string;
  answeredCount: number;
  memo: string;
  evaluations: Record<string, EvaluationEntry>;
}

const JUDGMENT_COLOR = (text: string) => {
  if (text.includes('集中支援')) return 'var(--accent-red, #ff4444)';
  if (text.includes('継続')) return 'var(--accent-orange, #ff8c00)';
  return 'var(--accent-green)';
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}  ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getCategoryScore(category: string, evaluations: Record<string, EvaluationEntry>): number {
  return Object.values(evaluations)
    .filter(e => e.category === category)
    .reduce((s, e) => s + e.score, 0);
}

function getCategoryMax(category: string): number {
  return (ALL_ITEMS_BY_CATEGORY[category] ?? [])
    .filter(i => !i.isInfoOnly)
    .reduce((s, i) => s + Math.max(...i.options.map(o => o.score ?? 0)), 0);
}

function RecordDetail({ record, onDelete }: { record: HistoryRecord; onDelete: () => void }) {
  const color = JUDGMENT_COLOR(record.judgment);
  const age = record.evaluations['age']?.selectedValue ?? '—';
  const gender = record.evaluations['gender']?.selectedValue ?? '—';
  const mainDisease = record.evaluations['mainDisease']?.selectedValue ?? '—';

  return (
    <div style={{
      background: '#070d07',
      border: `1px solid ${color}30`,
      borderTop: `2px solid ${color}`,
      borderRadius: '0 0 6px 6px',
      padding: '16px',
    }}>
      {/* 基本情報 */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 16,
        flexWrap: 'wrap',
      }}>
        {[age, gender, mainDisease].map((v, i) => (
          <span key={i} style={{
            fontSize: '0.78rem',
            color: '#aaa',
            background: '#111618',
            border: '1px solid #2a2a2a',
            borderRadius: 3,
            padding: '4px 10px',
          }}>{v}</span>
        ))}
      </div>

      {/* 判定 */}
      <div style={{
        fontSize: '0.82rem',
        color,
        fontWeight: 700,
        marginBottom: 14,
        lineHeight: 1.5,
      }}>
        {record.judgment}
      </div>

      {/* カテゴリ別スコア */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.15em', marginBottom: 8 }}>
          CATEGORY SCORES
        </div>
        {ALL_CATEGORIES.filter(cat => getCategoryMax(cat) > 0 && Object.values(record.evaluations).some(e => e.category === cat)).map(cat => {
          const got = getCategoryScore(cat, record.evaluations);
          const max = getCategoryMax(cat);
          const pct = max > 0 ? Math.round((got / max) * 100) : 0;
          const catColor = ALL_CATEGORY_COLORS[cat];
          return (
            <div key={cat} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: '0.72rem', color: catColor }}>{cat}</span>
                <span style={{ fontSize: '0.68rem', color: '#666' }}>{got}/{max}pt</span>
              </div>
              <div style={{ height: 3, background: '#1a1f1a', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: catColor, borderRadius: 2 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* メモ */}
      {record.memo && (
        <div style={{
          padding: '10px 12px',
          background: '#0d1117',
          borderLeft: '2px solid #2a2a2a',
          borderRadius: 2,
          fontSize: '0.78rem',
          color: '#888',
          lineHeight: 1.7,
          whiteSpace: 'pre-wrap',
          marginBottom: 16,
        }}>
          {record.memo}
        </div>
      )}

      {/* 削除ボタン */}
      <button
        onClick={onDelete}
        style={{
          width: '100%',
          padding: '10px',
          background: 'transparent',
          border: '1px solid #2a1010',
          borderRadius: 4,
          color: '#4a2020',
          fontFamily: 'inherit',
          fontSize: '0.75rem',
          cursor: 'pointer',
          letterSpacing: '0.05em',
        }}
      >
        この記録を削除
      </button>
    </div>
  );
}

export function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    localforage.getItem<HistoryRecord[]>('history').then(data => {
      setRecords(data ?? []);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('この記録を削除しますか？')) return;
    const next = records.filter(r => r.id !== id);
    await localforage.setItem('history', next);
    setRecords(next);
    if (expandedId === id) setExpandedId(null);
  };

  const handleClearAll = async () => {
    if (!window.confirm('すべての履歴を削除しますか？')) return;
    await localforage.setItem('history', []);
    setRecords([]);
    setExpandedId(null);
  };

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: 600, margin: '0 auto' }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
      }}>
        <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em' }}>
          // ASSESSMENT HISTORY
        </div>
        {records.length > 0 && (
          <button
            onClick={handleClearAll}
            style={{
              background: 'transparent',
              border: '1px solid #2a1010',
              borderRadius: 3,
              color: '#4a2020',
              fontFamily: 'inherit',
              fontSize: '0.65rem',
              padding: '4px 10px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            全削除
          </button>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', color: '#444', fontSize: '0.8rem', padding: 40 }}>
          読み込み中...
        </div>
      )}

      {!loading && records.length === 0 && (
        <div style={{
          background: '#0d1117',
          borderRadius: 6,
          padding: '40px 24px',
          textAlign: 'center',
          color: '#444',
          fontSize: '0.82rem',
          border: '1px solid #1a2a1a',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.3 }}>◎</div>
          <div>保存された履歴はありません</div>
          <div style={{ fontSize: '0.68rem', marginTop: 6, color: '#333' }}>
            サマリー画面から「履歴に保存」で記録できます
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {records.map((record, idx) => {
          const color = JUDGMENT_COLOR(record.judgment);
          const isExpanded = expandedId === record.id;

          return (
            <div key={record.id}>
              {/* リスト行 */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : record.id)}
                style={{
                  width: '100%',
                  background: isExpanded ? '#0d1117' : '#0a0f0a',
                  border: `1px solid ${isExpanded ? color + '50' : '#1e2a1e'}`,
                  borderBottom: isExpanded ? 'none' : undefined,
                  borderRadius: isExpanded ? '6px 6px 0 0' : 6,
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {/* 順番 */}
                <span style={{ fontSize: '0.6rem', color: '#444', flexShrink: 0, width: 20 }}>
                  #{idx + 1}
                </span>

                {/* スコア */}
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color,
                  lineHeight: 1,
                  flexShrink: 0,
                  width: 44,
                }}>
                  {record.totalScore}
                </span>

                {/* 中央情報 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.68rem', color: '#555', marginBottom: 3 }}>
                    {formatDate(record.savedAt)}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#888',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {record.judgment}
                  </div>
                </div>

                {/* 右端 */}
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: '#555' }}>
                    {record.answeredCount}/22
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    color: '#444',
                    marginTop: 2,
                    transform: isExpanded ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                  }}>
                    ▼
                  </div>
                </div>
              </button>

              {/* 削除ボタン（各行） */}
              <button
                onClick={e => { e.stopPropagation(); handleDelete(record.id); }}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'transparent',
                  border: '1px solid #2a1010',
                  borderTop: 'none',
                  borderRadius: isExpanded ? 0 : '0 0 6px 6px',
                  color: '#5a2525',
                  fontFamily: 'inherit',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#ff4444'; (e.target as HTMLElement).style.background = 'rgba(255,40,40,0.05)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#5a2525'; (e.target as HTMLElement).style.background = 'transparent'; }}
              >
                削除
              </button>

              {/* 詳細 */}
              {isExpanded && (
                <RecordDetail
                  record={record}
                  onDelete={() => handleDelete(record.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
