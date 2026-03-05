import { CATEGORIES, CATEGORY_COLORS, MASTER_DATA } from '../../data/masterData';
import type { CategoryName } from '../../data/masterData';

interface CategoryTabsProps {
  activeCategory: CategoryName;
  onSelect: (cat: CategoryName) => void;
  evaluations: Record<string, unknown>;
}

function getCategoryProgress(category: string, evaluations: Record<string, unknown>) {
  const items = MASTER_DATA.filter(i => i.category === category && !i.isInfoOnly);
  if (items.length === 0) return { done: 0, total: 0 };
  const done = items.filter(i => i.key in evaluations).length;
  return { done, total: items.length };
}

export function CategoryTabs({ activeCategory, onSelect, evaluations }: CategoryTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        overflowX: 'auto',
        gap: 4,
        padding: '8px 16px',
        borderBottom: '1px solid #1a2a1a',
        scrollbarWidth: 'none',
      }}
    >
      {CATEGORIES.map(cat => {
        const active = cat === activeCategory;
        const color = CATEGORY_COLORS[cat];
        const { done, total } = getCategoryProgress(cat, evaluations);
        const completed = total > 0 && done === total;

        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            style={{
              flexShrink: 0,
              padding: '6px 12px',
              borderRadius: 2,
              border: `1px solid ${active ? color : '#2a2a2a'}`,
              background: active ? `${color}15` : 'transparent',
              color: active ? color : completed ? '#444' : '#555',
              fontFamily: 'inherit',
              fontSize: '0.65rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              minHeight: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              transition: 'all 0.15s',
              boxShadow: active ? `0 0 8px ${color}30` : 'none',
            }}
          >
            <span>{cat}</span>
            {total > 0 && (
              <span
                style={{
                  fontSize: '0.55rem',
                  color: completed ? 'var(--accent-green)' : active ? color : '#444',
                }}
              >
                {completed ? '✓' : `${done}/${total}`}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
