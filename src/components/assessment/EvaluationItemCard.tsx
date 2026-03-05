import { useState } from 'react';
import { CATEGORY_COLORS } from '../../data/masterData';
import type { EvaluationItem, EvaluationOption } from '../../data/masterData';
import type { EvaluationEntry } from '../../hooks/useAssessment';

interface EvaluationItemCardProps {
  item: EvaluationItem;
  entry: EvaluationEntry | undefined;
  onSelect: (itemKey: string, value: string) => void;
}

interface TooltipProps {
  opt: EvaluationOption;
  color: string;
}

function getCompactCols(count: number): number {
  if (count % 3 === 0) return 3;
  return 4;
}

function OptionTooltip({ opt, color }: TooltipProps) {
  if (!opt.criteria && !opt.comment) return null;
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: 0,
        width: 280,
        background: '#111820',
        border: `1px solid ${color}`,
        borderRadius: 4,
        padding: '12px 14px',
        zIndex: 200,
        pointerEvents: 'none',
        boxShadow: `0 0 16px rgba(0,0,0,0.8), 0 0 8px ${color}30`,
      }}
    >
      {opt.comment && (
        <div style={{ fontSize: '0.88rem', color: '#ddd', lineHeight: 1.6, marginBottom: opt.criteria ? 8 : 0 }}>
          {opt.comment}
        </div>
      )}
      {opt.criteria && (
        <div style={{
          fontSize: '0.78rem', color: '#aaa', lineHeight: 1.6,
          borderTop: opt.comment ? '1px solid #222' : 'none',
          paddingTop: opt.comment ? 8 : 0,
        }}>
          {opt.criteria}
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: -5, left: 20,
        transform: 'rotate(45deg)', width: 8, height: 8,
        background: '#111820',
        borderRight: `1px solid ${color}`, borderBottom: `1px solid ${color}`,
      }} />
    </div>
  );
}

export function EvaluationItemCard({ item, entry, onSelect }: EvaluationItemCardProps) {
  const color = CATEGORY_COLORS[item.category];
  const selectedValue = entry?.selectedValue;
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  const compact = item.options.length > 5;
  const cols = compact ? getCompactCols(item.options.length) : null;

  const gridStyle = compact
    ? {
        display: 'grid' as const,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 8,
      }
    : {
        display: 'flex' as const,
        flexWrap: 'wrap' as const,
        gap: 12,
      };

  return (
    <div style={{
      background: '#0d1117',
      borderRadius: 4,
      borderLeft: `2px solid ${color}`,
      padding: '16px',
      marginBottom: 12,
    }}>
      {/* 項目名 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: '0.65rem', color: '#555', letterSpacing: '0.1em', marginBottom: 4 }}>
          {item.category} /
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 8 }}>
          {item.item}
          {item.isInfoOnly && (
            <span style={{ fontSize: '0.55rem', color: '#555', border: '1px solid #333', padding: '1px 5px', borderRadius: 2 }}>
              情報項目
            </span>
          )}
        </div>
      </div>

      {/* 選択ボタン */}
      <div style={gridStyle}>
        {item.options.map((opt: EvaluationOption) => {
          const selected = selectedValue === opt.value;
          const hovered = hoveredValue === opt.value;
          const isUnknown = opt.isUnknown;
          const btnColor = isUnknown ? 'var(--status-warning)' : color;
          const valueFontSize = compact
            ? '0.78rem'
            : opt.value.length > 6
            ? '0.72rem'
            : opt.value.length > 4
            ? '0.82rem'
            : '0.95rem';

          return (
            <div
              key={opt.value}
              style={{ position: 'relative', ...(compact ? {} : { flexShrink: 0 }) }}
              onMouseEnter={() => setHoveredValue(opt.value)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              {hovered && <OptionTooltip opt={opt} color={btnColor} />}

              <button
                onClick={() => onSelect(item.key, opt.value)}
                style={{
                  width: '100%',
                  padding: compact ? '8px 6px' : '12px 16px',
                  borderRadius: 4,
                  border: `1px solid ${selected ? btnColor : hovered ? '#666' : '#444'}`,
                  background: selected
                    ? isUnknown ? 'rgba(255,107,53,0.15)' : `${color}20`
                    : hovered ? '#1a1f1a' : '#111618',
                  color: selected ? btnColor : hovered ? '#eee' : '#ccc',
                  fontFamily: 'inherit',
                  fontSize: valueFontSize,
                  cursor: 'pointer',
                  minHeight: compact ? 40 : 52,
                  transition: 'all 0.15s',
                  boxShadow: selected
                    ? `0 0 10px ${isUnknown ? 'rgba(255,107,53,0.35)' : `${color}50`}`
                    : 'none',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  boxSizing: 'border-box',
                }}
              >
                <span style={{ fontWeight: 600 }}>{opt.value}</span>
                {!item.isInfoOnly && opt.score !== null && (
                  <span style={{ fontSize: '0.72rem', color: selected ? btnColor : '#888', fontWeight: 700 }}>
                    {opt.score} pt
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 選択後コメント */}
      {entry && (
        <div style={{
          marginTop: 12, padding: '8px 12px',
          background: 'rgba(0,0,0,0.3)', borderRadius: 2,
          borderLeft: `2px solid ${entry.isUnknown ? 'var(--status-warning)' : color}`,
          fontSize: '0.72rem', color: '#aaa', lineHeight: 1.6,
        }}>
          {entry.isUnknown && <span style={{ color: 'var(--status-warning)', marginRight: 6 }}>⚠</span>}
          {entry.comment}
        </div>
      )}
    </div>
  );
}
