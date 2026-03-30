import { useNavigate } from 'react-router-dom';
import { DETAILED_CATEGORIES, DETAILED_ITEMS, getItemsForBranch } from '../data/detailedAssessmentData';
import { useDetailedAssessment } from '../hooks/useDetailedAssessment';

export function DetailedAssessmentPage() {
  const navigate = useNavigate();
  const {
    state,
    selectBranch,
    selectOption,
    setComment,
    setMemo,
    reset,
    answeredCount,
    unknownCount,
  } = useDetailedAssessment(DETAILED_ITEMS);

  const totalItems = DETAILED_ITEMS.length;
  const progress = Math.round((answeredCount / totalItems) * 100);

  return (
    <div>
      {/* 進捗バー（sticky） */}
      <div style={{
        padding: '10px 16px',
        background: '#0a0f0a',
        borderBottom: '1px solid #1e2a1e',
        position: 'sticky',
        top: 100,
        zIndex: 40,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#aaa',
          marginBottom: 6,
        }}>
          <span>{answeredCount} / {totalItems} 項目</span>
          <span style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.9rem' }}>
            詳細アセスメント
            {unknownCount > 0 && (
              <span style={{ fontSize: '0.65rem', color: '#ff6b6b', marginLeft: 8 }}>
                不明 {unknownCount} 項目
              </span>
            )}
          </span>
        </div>
        <div style={{ height: 2, background: '#1e2a1e', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'var(--accent-purple)',
            boxShadow: '0 0 6px var(--accent-purple)',
            transition: 'width 0.3s',
          }} />
        </div>
      </div>

      {/* カテゴリ一覧 */}
      <div style={{ padding: '0 0 120px' }}>
        {DETAILED_CATEGORIES.map((cat) => {
          const selectedBranch = state.selectedBranches[cat.name] ?? null;
          const visibleItems = selectedBranch
            ? getItemsForBranch(cat.name, selectedBranch)
            : DETAILED_ITEMS.filter(i => i.category === cat.name && i.branchKey === null);

          const catAnswered = visibleItems.filter(i => state.evaluations[i.key]).length;

          return (
            <div key={cat.name} style={{ borderBottom: '1px solid #1e2a1e' }}>
              {/* カテゴリヘッダー */}
              <div style={{
                padding: '18px 16px 12px',
                background: '#0a0f0a',
                position: 'sticky',
                top: 142,
                zIndex: 30,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      color: cat.color,
                      opacity: 0.7,
                      textTransform: 'uppercase',
                    }}>
                      {cat.branchAxis}
                    </span>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: cat.color,
                      letterSpacing: '0.05em',
                      marginTop: 2,
                    }}>
                      {cat.name}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#555' }}>
                    {catAnswered} / {visibleItems.length}
                  </span>
                </div>

                {/* 分岐選択ボタン */}
                <div style={{
                  display: 'flex',
                  gap: 6,
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}>
                  {cat.branches.map((branch) => {
                    const isSelected = selectedBranch === branch;
                    return (
                      <button
                        key={branch}
                        onClick={() => selectBranch(cat.name, branch)}
                        style={{
                          padding: '5px 10px',
                          fontSize: '0.7rem',
                          fontFamily: 'inherit',
                          fontWeight: isSelected ? 700 : 400,
                          background: isSelected ? cat.color : 'transparent',
                          color: isSelected ? '#000' : cat.color,
                          border: `1px solid ${cat.color}`,
                          borderRadius: 3,
                          cursor: 'pointer',
                          opacity: isSelected ? 1 : 0.55,
                          letterSpacing: '0.03em',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={e => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.opacity = '0.85';
                        }}
                        onMouseLeave={e => {
                          if (!isSelected) (e.currentTarget as HTMLElement).style.opacity = '0.55';
                        }}
                      >
                        {branch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 項目リスト */}
              <div>
                {visibleItems.map((item) => {
                  const evaluation = state.evaluations[item.key];
                  const comment = evaluation?.comment ?? '';
                  let prevSectionTitle: string | undefined;
                  const idx = visibleItems.indexOf(item);
                  if (idx > 0) prevSectionTitle = visibleItems[idx - 1].sectionTitle;

                  return (
                    <div key={item.key}>
                      {/* セクション区切り */}
                      {item.sectionTitle && (
                        <div style={{
                          padding: '10px 16px 4px',
                          fontSize: '0.65rem',
                          color: cat.color,
                          letterSpacing: '0.1em',
                          opacity: 0.7,
                          borderTop: prevSectionTitle !== undefined ? '1px solid #1e2a1e' : undefined,
                        }}>
                          // {item.sectionTitle}
                        </div>
                      )}

                      {/* アラートバナー */}
                      {item.alertType && item.alertText && (
                        <div style={{
                          margin: '8px 16px 0',
                          padding: '8px 12px',
                          borderRadius: 3,
                          fontSize: '0.72rem',
                          lineHeight: 1.6,
                          background: item.alertType === 'warning'
                            ? 'rgba(255,107,53,0.08)'
                            : 'rgba(0,255,255,0.06)',
                          border: `1px solid ${item.alertType === 'warning' ? 'rgba(255,107,53,0.3)' : 'rgba(0,255,255,0.2)'}`,
                          color: item.alertType === 'warning' ? '#ff6b35' : '#00e5cc',
                        }}>
                          {item.alertType === 'warning' ? '⚠ ' : 'ℹ '}{item.alertText}
                        </div>
                      )}

                      {/* 評価カード */}
                      <div style={{ padding: '12px 16px 8px' }}>
                        {/* 項目名 */}
                        <div style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: cat.color,
                          marginBottom: 4,
                          lineHeight: 1.4,
                        }}>
                          {item.item}
                        </div>

                        {/* ヒント */}
                        {item.hint && (
                          <div style={{
                            fontSize: '0.7rem',
                            color: '#666',
                            marginBottom: 8,
                            lineHeight: 1.5,
                          }}>
                            {item.hint}
                          </div>
                        )}

                        {/* 評価ボタン */}
                        <div style={{
                          display: 'flex',
                          gap: 6,
                          marginBottom: 8,
                          flexWrap: 'wrap',
                        }}>
                          {item.options.map((opt) => {
                            const isSelected = evaluation?.selectedValue === opt.value;
                            let btnColor = '#aaa';
                            if (opt.isUnknown) btnColor = '#555';
                            else if (opt.value === 'ok') btnColor = 'var(--accent-green)';
                            else if (opt.value === 'cond') btnColor = 'var(--accent-yellow, #ffe066)';
                            else if (opt.value === 'ng') btnColor = 'var(--accent-red, #ff4444)';

                            return (
                              <button
                                key={opt.value}
                                onClick={() => selectOption(item.key, opt.value)}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.72rem',
                                  fontFamily: 'inherit',
                                  fontWeight: isSelected ? 700 : 400,
                                  background: isSelected
                                    ? (opt.isUnknown ? 'rgba(255,107,53,0.15)' : `${btnColor}20`)
                                    : '#111618',
                                  color: isSelected ? btnColor : '#ccc',
                                  border: `1px solid ${isSelected ? btnColor : '#444'}`,
                                  borderRadius: 3,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                  letterSpacing: '0.02em',
                                  boxShadow: isSelected ? `0 0 6px ${btnColor}44` : 'none',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* コメント欄 */}
                        <textarea
                          value={comment}
                          onChange={e => {
                            if (!state.evaluations[item.key]) {
                              // 未評価でもコメントを入れられるよう先に評価をセット
                              selectOption(item.key, item.options[3]?.value ?? 'unknown');
                            }
                            setComment(item.key, e.target.value);
                          }}
                          placeholder={item.placeholder}
                          rows={2}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid #222',
                            borderRadius: 3,
                            color: '#aaa',
                            fontFamily: 'inherit',
                            fontSize: '0.72rem',
                            lineHeight: 1.6,
                            padding: '6px 10px',
                            resize: 'vertical',
                            minHeight: 52,
                            outline: 'none',
                          }}
                          onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = cat.color; }}
                          onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = '#222'; }}
                        />
                      </div>
                    </div>
                  );
                })}

                {!selectedBranch && (
                  <div style={{
                    padding: '16px',
                    color: '#444',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                  }}>
                    ↑ 分岐を選択すると、共通項目に加えて詳細項目が表示されます
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* メモ欄 */}
        <div style={{ padding: '24px 16px 8px' }}>
          <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.1em', marginBottom: 8 }}>
            // OVERALL MEMO
          </div>
          <textarea
            value={state.memo}
            onChange={e => setMemo(e.target.value)}
            placeholder="全体所見・引き継ぎメモなど"
            rows={4}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid #222',
              borderRadius: 3,
              color: '#aaa',
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              lineHeight: 1.7,
              padding: '10px 12px',
              resize: 'vertical',
              outline: 'none',
            }}
          />
        </div>

        {/* ナビゲーションボタン */}
        <div style={{ padding: '16px', display: 'flex', gap: 10 }}>
          <button
            onClick={() => { reset(); navigate('/'); }}
            style={{
              flex: 1,
              padding: '14px',
              background: 'transparent',
              border: '1px solid #333',
              borderRadius: 4,
              color: '#666',
              fontFamily: 'inherit',
              fontSize: '0.8rem',
              cursor: 'pointer',
              letterSpacing: '0.08em',
            }}
          >
            ← TOP
          </button>
        </div>
      </div>
    </div>
  );
}
