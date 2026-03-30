import { useAssessmentContext } from '../../context/AssessmentContext';
import { getPriorityIssues, getPriorityCategories } from './summaryHelpers';
import type { EvaluationEntry } from '../../hooks/useAssessment';

interface Props {
  evaluations: Record<string, EvaluationEntry>;
  totalScore: number;
  unknownItems: EvaluationEntry[];
  notes?: string[];
}

const JUDGMENT_COLOR = {
  low: 'var(--accent-red, #ff4444)',
  mid: 'var(--accent-orange, #ff8c00)',
  high: 'var(--accent-green)',
};

function Block({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: '0.6rem', color: '#555', letterSpacing: '0.15em', marginBottom: 4 }}>
        ▶ {label}
      </div>
      <div style={{ fontSize: '0.88rem', color: color ?? '#ddd', lineHeight: 1.6, paddingLeft: 10 }}>
        {value || '該当なし'}
      </div>
    </div>
  );
}

export function SignalView({ evaluations, totalScore, unknownItems, notes = [] }: Props) {
  const { getJudgmentFn, maxScore, categoryColors, scoredItems, itemsByCategory, assessmentType } = useAssessmentContext();
  const judgment = getJudgmentFn(totalScore);
  const scoreColor = JUDGMENT_COLOR[judgment.level];
  const pct = Math.round((totalScore / maxScore) * 100);
  const isNurse = assessmentType === 'nurse';

  const age = evaluations['age']?.selectedValue ?? '未入力';
  const gender = evaluations['gender']?.selectedValue ?? '未入力';
  const mainDisease = evaluations['mainDisease']?.selectedValue ?? '未入力';
  const unknownText = unknownItems.length > 0
    ? unknownItems.map(e => e.item).join('、')
    : '該当なし';

  const priorityIssues = getPriorityIssues(evaluations, scoredItems);
  const priorityCategories = getPriorityCategories(evaluations, itemsByCategory);

  // 精神症状の注目項目（看護師モードのみ）
  const psychiatricAlerts = isNurse
    ? (['hallucination', 'moodStability', 'selfHarmRisk']
        .map(key => evaluations[key])
        .filter(Boolean)
        .filter(e => e.score <= 1)
        .map(e => `${e.item}[${e.selectedValue}]`))
    : [];

  return (
    <div style={{
      background: '#0d1117',
      borderRadius: 6,
      border: `1px solid ${scoreColor}40`,
      overflow: 'hidden',
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: '14px 16px',
        background: `${scoreColor}10`,
        borderBottom: `1px solid ${scoreColor}30`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '0.58rem', color: '#555', letterSpacing: '0.2em' }}>SIGNAL // 圧縮・即時・現場判断用</div>
          {isNurse && (
            <div style={{ fontSize: '0.82rem', color: '#888', marginTop: 4 }}>
              {age}　{gender}　{mainDisease}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: scoreColor, lineHeight: 1 }}>
            {totalScore}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#666' }}>/ {maxScore} pt ({pct}%)</div>
        </div>
      </div>

      {/* 判定 */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1e2a1e',
        fontSize: '0.88rem',
        color: scoreColor,
        fontWeight: 700,
        lineHeight: 1.5,
      }}>
        {judgment.text}
      </div>

      {/* 本文 */}
      <div style={{ padding: '16px' }}>
        <Block
          label="優先対応課題"
          value={priorityIssues}
          color="var(--accent-orange, #ff8c00)"
        />
        <Block
          label="重点支援領域"
          value={priorityCategories}
          color={priorityCategories !== '該当なし'
            ? categoryColors[priorityCategories.split('、')[0]] ?? '#ddd'
            : '#ddd'}
        />
        {psychiatricAlerts.length > 0 && (
          <Block
            label="精神症状アラート"
            value={psychiatricAlerts.join('　')}
            color="var(--accent-red, #ff4444)"
          />
        )}
        <Block
          label="要確認（不明）"
          value={unknownText}
          color={unknownText !== '該当なし' ? 'var(--accent-orange, #ff8c00)' : '#666'}
        />
        {notes.some(n => n.trim()) && (
          <div style={{ marginTop: 6 }}>
            {notes.map((n, i) => n.trim() ? (
              <Block
                key={i}
                label={`特記事項${'①②③④⑤'[i]}`}
                value={n}
              />
            ) : null)}
          </div>
        )}
      </div>
    </div>
  );
}
