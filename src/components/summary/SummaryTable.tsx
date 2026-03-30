import { useAssessmentContext } from '../../context/AssessmentContext';
import {
  getCategoryText,
  getPriorityIssues,
  getStrengths,
  getPriorityCategories,
} from './summaryHelpers';
import type { EvaluationEntry } from '../../hooks/useAssessment';

interface Props {
  evaluations: Record<string, EvaluationEntry>;
  totalScore: number;
  unknownItems: EvaluationEntry[];
  notes?: string[];
  onNoteChange?: (i: number, value: string) => void;
}

const TODAY = new Date().toLocaleDateString('ja-JP', {
  year: 'numeric', month: 'numeric', day: 'numeric',
});

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '8rem 1fr',
      borderBottom: '1px solid #1e2a1e',
      minHeight: 44,
    }}>
      <div style={{
        padding: '10px 12px',
        fontSize: '0.75rem',
        color: '#888',
        borderRight: '1px solid #1e2a1e',
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1.4,
        flexShrink: 0,
      }}>
        {label}
      </div>
      <div style={{
        padding: '10px 14px',
        fontSize: '0.82rem',
        color: highlight ? 'var(--accent-green)' : '#ccc',
        fontWeight: highlight ? 700 : 400,
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
      }}>
        {value || '—'}
      </div>
    </div>
  );
}

export function SummaryTable({ evaluations, totalScore, unknownItems, notes, onNoteChange }: Props) {
  const { getJudgmentFn, maxScore, scoredItems, itemsByCategory, assessmentType } = useAssessmentContext();
  const judgment = getJudgmentFn(totalScore);
  const age = evaluations['age']?.selectedValue ?? '';
  const gender = evaluations['gender']?.selectedValue ?? '';
  const mainDisease = evaluations['mainDisease']?.selectedValue ?? '';
  const complication = evaluations['complication']?.selectedValue ?? '';
  const unknownText = unknownItems.length > 0
    ? unknownItems.map(e => e.item).join('、')
    : '該当なし';
  const isNurse = assessmentType === 'nurse';
  const psychiatricText = isNurse ? getCategoryText('精神症状', evaluations) : '';
  const livingText = isNurse
    ? ([getCategoryText('ADL', evaluations), getCategoryText('生活スキル', evaluations)]
        .filter(t => t !== '未回答').join('\n') || '未回答')
    : '';

  return (
    <div style={{
      background: '#0d1117',
      borderRadius: 6,
      border: '1px solid #1e2a1e',
      overflow: 'hidden',
    }}>
      {/* シートヘッダー */}
      <div style={{
        padding: '16px 16px 12px',
        borderBottom: '1px solid #1e2a1e',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        <div>
          <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.15em', marginBottom: 4 }}>
            DISCHARGE SUPPORT
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-green)', letterSpacing: '0.05em' }}>
            退院支援サマリー
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#666' }}>{TODAY}</div>
      </div>

      {/* 患者氏名 */}
      <div style={{
        display: 'grid', gridTemplateColumns: '8rem 1fr',
        borderBottom: '1px solid #1e2a1e', minHeight: 44,
      }}>
        <div style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#888', borderRight: '1px solid #1e2a1e', display: 'flex', alignItems: 'center' }}>
          患者氏名（手書き）
        </div>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, borderBottom: '1px solid #333', minHeight: 24 }} />
          <span style={{ fontSize: '0.82rem', color: '#666' }}>様</span>
        </div>
      </div>

      <Row label={`合計点（/${maxScore}）`} value={`${totalScore} / ${maxScore} pt`} highlight />
      <Row label="判定コメント" value={judgment.text} />
      {isNurse && <Row label="年齢" value={age} />}
      {isNurse && <Row label="性別" value={gender} />}
      {isNurse && <Row label="主疾患" value={mainDisease} />}
      {isNurse && <Row label="合併症" value={complication} />}
      <Row label="優先対応課題" value={getPriorityIssues(evaluations, scoredItems)} />
      <Row label="支援の土台" value={getStrengths(evaluations, scoredItems)} />
      <Row label="重点支援領域" value={getPriorityCategories(evaluations, itemsByCategory)} />
      {isNurse && <Row label="精神症状の特徴" value={psychiatricText} />}
      {isNurse && <Row label="生活環境の特徴" value={livingText} />}
      <Row label="要確認項目（不明）" value={unknownText} />

      {/* 特記事項1〜5（編集可能な場合のみ） */}
      {notes && notes.map((note, i) => (
        <div key={i} style={{
          display: 'grid', gridTemplateColumns: '8rem 1fr',
          borderBottom: '1px solid #1e2a1e', minHeight: 52,
        }}>
          <div style={{ padding: '10px 12px', fontSize: '0.75rem', color: '#888', borderRight: '1px solid #1e2a1e', display: 'flex', alignItems: 'center' }}>
            特記事項{i + 1}
          </div>
          <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center' }}>
            {onNoteChange ? (
              <textarea
                value={note}
                onChange={e => onNoteChange(i, e.target.value)}
                placeholder={`特記事項${i + 1}を入力`}
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
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#ccc' }}>{note}</span>
            )}
          </div>
        </div>
      ))}

      {/* 注釈 */}
      <div style={{ padding: '10px 14px', fontSize: '0.65rem', color: '#444', lineHeight: 1.8 }}>
        ※ このサマリーはアプリ内のアセスメント結果から自動生成されています
      </div>
    </div>
  );
}
