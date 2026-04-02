import { useNavigate } from 'react-router-dom';
import {
  DEMENTIA_DIRECTIONS,
  DEMENTIA_SECTIONS,
  getDementiaVisibleItems,
  type DementiaDirectionKey,
  type DementiaItem,
} from '../data/dementiaAssessmentData';
import { useDementiaAssessmentContext } from '../context/DementiaAssessmentContext';

const ACCENT = 'var(--accent-orange)';
const ACCENT_RGBA = 'rgba(255,107,53,';

// ===== Section grouping =====

const COMMON_SECTIONS = ['A', 'B', 'C'] as const;
const BRANCH_SECTION: Record<DementiaDirectionKey, string> = {
  facility: 'D1',
  watch: 'D2',
  endoflife: 'D3',
  unknown: 'D4',
};

// ===== Sub-components =====

function RadioItem({
  item,
  selected,
  onSelect,
}: {
  item: DementiaItem;
  selected: string | undefined;
  onSelect: (key: string, value: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '0.72rem', color: ACCENT, fontWeight: 700, marginBottom: 2 }}>
        {item.itemLabel}
      </div>
      <div style={{ fontSize: '0.88rem', color: '#e8e8e8', marginBottom: item.hint ? 4 : 8 }}>
        {item.item}
      </div>
      {item.hint && (
        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 8 }}>
          {item.hint}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {item.options?.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(item.key, opt.value)}
              style={{
                padding: '10px 14px',
                background: isSelected ? `${ACCENT_RGBA}0.12)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? ACCENT : '#2a2a2a'}`,
                borderRadius: 4,
                color: isSelected ? ACCENT : '#888',
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
                lineHeight: 1.5,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxItem({
  item,
  selected,
  onToggle,
}: {
  item: DementiaItem;
  selected: string[];
  onToggle: (key: string, value: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '0.72rem', color: ACCENT, fontWeight: 700, marginBottom: 2 }}>
        {item.itemLabel}
      </div>
      <div style={{ fontSize: '0.88rem', color: '#e8e8e8', marginBottom: item.hint ? 4 : 8 }}>
        {item.item}
      </div>
      {item.hint && (
        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 8 }}>
          {item.hint}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {item.options?.map(opt => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => onToggle(item.key, opt.value)}
              style={{
                padding: '10px 14px',
                background: isSelected ? `${ACCENT_RGBA}0.12)` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? ACCENT : '#2a2a2a'}`,
                borderRadius: 4,
                color: isSelected ? ACCENT : '#888',
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
                lineHeight: 1.5,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span style={{
                width: 14, height: 14, flexShrink: 0,
                border: `1px solid ${isSelected ? ACCENT : '#444'}`,
                borderRadius: 2,
                background: isSelected ? ACCENT : 'transparent',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', color: '#000',
              }}>
                {isSelected && '✓'}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextItem({
  item,
  value,
  onChange,
}: {
  item: DementiaItem;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: '0.72rem', color: ACCENT, fontWeight: 700, marginBottom: 2 }}>
        {item.itemLabel}
      </div>
      <div style={{ fontSize: '0.88rem', color: '#e8e8e8', marginBottom: item.hint ? 4 : 8 }}>
        {item.item}
      </div>
      {item.hint && (
        <div style={{ fontSize: '0.65rem', color: '#555', marginBottom: 8 }}>
          {item.hint}
        </div>
      )}
      <textarea
        value={value}
        onChange={e => onChange(item.key, e.target.value)}
        placeholder={item.placeholder}
        rows={3}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.02)',
          border: `1px solid ${value ? ACCENT : '#2a2a2a'}`,
          borderRadius: 4,
          color: '#e8e8e8',
          fontFamily: 'inherit',
          fontSize: '0.78rem',
          padding: '10px 12px',
          resize: 'vertical',
          lineHeight: 1.6,
          outline: 'none',
        }}
      />
    </div>
  );
}

function ItemRenderer({ item }: { item: DementiaItem }) {
  const { state, setRadio, toggleCheckbox, setText } = useDementiaAssessmentContext();

  if (item.type === 'radio') {
    return (
      <RadioItem
        item={item}
        selected={state.radioAnswers[item.key]}
        onSelect={setRadio}
      />
    );
  }
  if (item.type === 'checkbox') {
    return (
      <CheckboxItem
        item={item}
        selected={state.checkboxAnswers[item.key] ?? []}
        onToggle={toggleCheckbox}
      />
    );
  }
  if (item.type === 'text') {
    return (
      <TextItem
        item={item}
        value={state.textAnswers[item.key] ?? ''}
        onChange={setText}
      />
    );
  }
  return null;
}

function SectionBlock({ sectionKey }: { sectionKey: string }) {
  const { state } = useDementiaAssessmentContext();
  const secDef = DEMENTIA_SECTIONS[sectionKey];
  const visibleItems = getDementiaVisibleItems(state.direction, state.radioAnswers);
  const items = visibleItems.filter(i => i.section === sectionKey);

  if (items.length === 0) return null;

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        padding: '10px 16px',
        background: `${ACCENT_RGBA}0.06)`,
        borderLeft: `2px solid ${ACCENT}`,
        marginBottom: 16,
      }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: ACCENT }}>
          {secDef.label}
        </div>
        {secDef.sublabel && (
          <div style={{ fontSize: '0.6rem', color: '#555', marginTop: 2 }}>
            {secDef.sublabel}
          </div>
        )}
      </div>
      <div style={{ padding: '0 16px' }}>
        {items.map(item => (
          <ItemRenderer key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

// ===== Progress calculation =====

function useProgress() {
  const { state } = useDementiaAssessmentContext();
  const visibleItems = getDementiaVisibleItems(state.direction, state.radioAnswers);

  let answered = 0;
  const total = visibleItems.length;

  for (const item of visibleItems) {
    if (item.type === 'radio' && state.radioAnswers[item.key]) answered++;
    else if (item.type === 'checkbox' && (state.checkboxAnswers[item.key]?.length ?? 0) > 0) answered++;
    else if (item.type === 'text' && state.textAnswers[item.key]?.trim()) answered++;
  }

  return { answered, total, pct: total > 0 ? Math.round((answered / total) * 100) : 0 };
}

// ===== Main Page =====

export function DementiaPage() {
  const navigate = useNavigate();
  const { state, setDirection, setDirectionReason, setMemo, reset } = useDementiaAssessmentContext();
  const { answered, total, pct } = useProgress();

  const handleReset = () => {
    if (window.confirm('入力内容をすべてリセットします。よろしいですか？')) {
      reset();
    }
  };

  return (
    <div>
      {/* 進捗バー（sticky） */}
      <div style={{
        padding: '10px 16px',
        background: '#0a0f0a',
        borderBottom: '1px solid #1a1a1a',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#aaa',
          marginBottom: 6,
        }}>
          <span>{answered} / {total} 項目</span>
          <span style={{ color: ACCENT, fontWeight: 700, fontSize: '0.9rem' }}>
            認知症アセスメント
          </span>
        </div>
        <div style={{ height: 2, background: '#1a1a1a', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: ACCENT,
            boxShadow: `0 0 6px ${ACCENT}`,
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* ガイド */}
      <div style={{
        margin: '12px 16px',
        padding: '12px 14px',
        background: `${ACCENT_RGBA}0.08)`,
        border: `1px solid ${ACCENT_RGBA}0.4)`,
        borderRadius: 4,
      }}>
        <div style={{ fontSize: '0.75rem', color: ACCENT, fontWeight: 700, marginBottom: 4 }}>
          使い方
        </div>
        <div style={{ fontSize: '0.72rem', color: '#cc8860', lineHeight: 1.7 }}>
          まず「方向性の判断」を選択してください。選択後、共通評価（A〜C）と分岐別評価（D）、ケアの視点（E）が表示されます。<br />
          この人は人生の先輩です。改善・回復を前提とせず、今の状態を正直に記録してください。
        </div>
      </div>

      {/* ① 方向性の判断 */}
      <div style={{ padding: '0 16px', marginBottom: 32 }}>
        <div style={{
          padding: '10px 16px',
          background: `${ACCENT_RGBA}0.06)`,
          borderLeft: `2px solid ${ACCENT}`,
          marginBottom: 16,
        }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: ACCENT }}>
            方向性の判断
          </div>
          <div style={{ fontSize: '0.6rem', color: '#555', marginTop: 2 }}>
            アセスメント全体の起点となる分岐を選択する
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {DEMENTIA_DIRECTIONS.map(dir => {
            const isSelected = state.direction === dir.key;
            return (
              <button
                key={dir.key}
                onClick={() => setDirection(dir.key as DementiaDirectionKey)}
                style={{
                  padding: '14px 16px',
                  background: isSelected ? `${ACCENT_RGBA}0.1)` : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isSelected ? ACCENT : '#2a2a2a'}`,
                  borderRadius: 4,
                  color: isSelected ? '#e8e8e8' : '#666',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: isSelected ? dir.color : '#2a2a2a',
                  boxShadow: isSelected ? `0 0 8px ${dir.color}` : 'none',
                  transition: 'all 0.15s',
                }} />
                <div>
                  <div style={{ fontWeight: isSelected ? 700 : 400 }}>{dir.label}</div>
                  <div style={{ fontSize: '0.62rem', color: isSelected ? '#aaa' : '#444', marginTop: 2 }}>
                    {dir.sublabel}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: '0.72rem', color: '#666', marginBottom: 6 }}>
            判断根拠（なぜこの方向性を選んだか）
          </div>
          <textarea
            value={state.directionReason}
            onChange={e => setDirectionReason(e.target.value)}
            placeholder="例）BPSDが安定しており、介護度5の認定あり。家族がサ高住への移行に合意している。"
            rows={2}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.02)',
              border: `1px solid ${state.directionReason ? ACCENT : '#2a2a2a'}`,
              borderRadius: 4,
              color: '#e8e8e8',
              fontFamily: 'inherit',
              fontSize: '0.78rem',
              padding: '10px 12px',
              resize: 'vertical',
              lineHeight: 1.6,
              outline: 'none',
            }}
          />
        </div>

        {!state.direction && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid #222',
            borderRadius: 4,
            fontSize: '0.72rem',
            color: '#444',
            marginTop: 8,
          }}>
            ↑ 方向性を選択すると、評価項目が表示されます
          </div>
        )}
      </div>

      {/* ② 共通評価（A・B・C） */}
      {state.direction && (
        <>
          {COMMON_SECTIONS.map(sec => (
            <SectionBlock key={sec} sectionKey={sec} />
          ))}

          {/* ③ 分岐別評価（D） */}
          <SectionBlock sectionKey={BRANCH_SECTION[state.direction]} />

          {/* ④ ケアの視点（E） */}
          <SectionBlock sectionKey="E" />

          {/* 備考 */}
          <div style={{ padding: '0 16px', marginBottom: 32 }}>
            <div style={{
              fontSize: '0.72rem', color: '#555', marginBottom: 6,
              letterSpacing: '0.08em',
            }}>
              // 備考・追記事項
            </div>
            <textarea
              value={state.memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="カンファレンスメモ、特記事項、次回確認事項など"
              rows={3}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                color: '#e8e8e8',
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                padding: '10px 12px',
                resize: 'vertical',
                lineHeight: 1.6,
                outline: 'none',
              }}
            />
          </div>

          {/* アクションボタン */}
          <div style={{ padding: '0 16px 40px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => navigate('/dementia-detail')}
              style={{
                width: '100%',
                padding: '18px',
                background: `${ACCENT_RGBA}0.1)`,
                border: `1px solid ${ACCENT}`,
                borderRadius: 4,
                color: ACCENT,
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                boxShadow: `0 0 16px ${ACCENT_RGBA}0.15)`,
              }}
            >
              AI出力を生成する →
            </button>
            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: 4,
                color: '#444',
                fontFamily: 'inherit',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              リセット
            </button>
          </div>
        </>
      )}
    </div>
  );
}
