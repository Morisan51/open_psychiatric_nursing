import { useState } from 'react';
import { useAssessmentContext } from '../context/AssessmentContext';
import { SummaryTable } from '../components/summary/SummaryTable';
import {
  generateSignalPrompt, generateBriefPrompt,
  generatePswSignalPrompt, generatePswBriefPrompt,
  generateLongTermSignalPrompt, generateLongTermBriefPrompt,
} from '../components/summary/summaryHelpers';

type Mode = 'signal' | 'brief';

function CopyButton({ getText }: { getText: () => string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
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
        background: copied ? 'rgba(170,255,0,0.12)' : 'rgba(170,255,0,0.04)',
        border: `1px solid ${copied ? 'var(--accent-green)' : 'rgba(170,255,0,0.3)'}`,
        borderRadius: 4,
        color: copied ? 'var(--accent-green)' : '#bbb',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        letterSpacing: '0.12em',
        cursor: 'pointer',
        fontWeight: 700,
        transition: 'all 0.2s',
        minHeight: 58,
        boxShadow: copied ? '0 0 12px rgba(170,255,0,0.2)' : 'none',
      }}
    >
      {copied ? '✓ コピーしました' : 'まるっとコピー'}
    </button>
  );
}

export function ExecutiveSummaryPage() {
  const { state, totalScore, unknownItems, assessmentType } = useAssessmentContext();
  const isPsw = assessmentType === 'psw';
  const isLongTerm = assessmentType === 'long_term';
  const { evaluations } = state;
  const answeredCount = Object.keys(evaluations).length;

  const [mode, setMode] = useState<Mode>('signal');

  // SummaryPageと共有（summary-notes）
  const [notes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('summary-notes');
      if (!saved) return ['', '', '', '', ''];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      const { notes: n, savedAt } = parsed as { notes: string[]; savedAt: number };
      const TTL_MS = 24 * 60 * 60 * 1000;
      if (Date.now() - savedAt > TTL_MS) {
        localStorage.removeItem('summary-notes');
        return ['', '', '', '', ''];
      }
      return n;
    } catch {
      return ['', '', '', '', ''];
    }
  });

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 8px',
    background: active ? 'rgba(170,255,0,0.06)' : 'transparent',
    border: 'none',
    borderBottom: active ? '2px solid var(--accent-green)' : '2px solid transparent',
    color: active ? 'var(--accent-green)' : '#555',
    fontFamily: 'inherit',
    fontSize: '0.7rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    transition: 'all 0.15s',
    textAlign: 'left' as const,
    lineHeight: 1.4,
  });

  return (
    <div style={{ padding: '20px 16px 100px', maxWidth: 640, margin: '0 auto' }}>

      <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 16 }}>
        // EXECUTIVE SUMMARY
      </div>

      {/* モード切替タブ */}
      <div style={{
        display: 'flex',
        background: '#0d1117',
        borderRadius: 6,
        border: '1px solid #1e2a1e',
        marginBottom: 20,
        overflow: 'hidden',
      }}>
        <button style={tabStyle(mode === 'signal')} onClick={() => setMode('signal')}>
          <div style={{ fontWeight: 700 }}>SIGNAL</div>
          <div style={{ fontSize: '0.6rem', color: mode === 'signal' ? '#888' : '#444', marginTop: 2 }}>
            圧縮・即時・現場判断用
          </div>
        </button>
        <div style={{ width: 1, background: '#1e2a1e' }} />
        <button style={tabStyle(mode === 'brief')} onClick={() => setMode('brief')}>
          <div style={{ fontWeight: 700 }}>BRIEF</div>
          <div style={{ fontSize: '0.6rem', color: mode === 'brief' ? '#888' : '#444', marginTop: 2 }}>
            展開・教育・カンファレンス用
          </div>
        </button>
      </div>

      {answeredCount === 0 && (
        <div style={{
          padding: '32px 20px',
          textAlign: 'center',
          color: '#555',
          fontSize: '0.85rem',
          background: '#0d1117',
          borderRadius: 4,
        }}>
          アセスメントを入力するとサマリーが表示されます
        </div>
      )}

      {answeredCount > 0 && (
        <>
          <SummaryTable
            evaluations={evaluations}
            totalScore={totalScore}
            unknownItems={unknownItems}
            notes={notes}
          />

          {/* SIGNAL: AIプロンプト表示 */}
          {mode === 'signal' && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
                // AI PROMPT（データ埋め込み済み）
              </div>
              <div style={{
                background: '#070d07',
                border: '1px solid #1e2a1e',
                borderRadius: 4,
                padding: '14px 16px',
                fontSize: '0.82rem',
                color: '#bbb',
                lineHeight: 1.9,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
              }}>
                {isLongTerm
                  ? generateLongTermSignalPrompt(evaluations, totalScore, unknownItems, notes)
                  : isPsw
                  ? generatePswSignalPrompt(evaluations, totalScore, unknownItems, notes)
                  : generateSignalPrompt(evaluations, totalScore, unknownItems, notes)}
              </div>
            </div>
          )}

          {/* BRIEF: AIプロンプト表示 */}
          {mode === 'brief' && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: 10 }}>
                // AI PROMPT（データ埋め込み済み）
              </div>
              <div style={{
                background: '#070d07',
                border: '1px solid #1e2a1e',
                borderRadius: 4,
                padding: '14px 16px',
                fontSize: '0.82rem',
                color: '#bbb',
                lineHeight: 1.9,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                letterSpacing: '0.02em',
              }}>
                {isLongTerm
                  ? generateLongTermBriefPrompt(evaluations, totalScore, unknownItems, notes)
                  : isPsw
                  ? generatePswBriefPrompt(evaluations, totalScore, unknownItems, notes)
                  : generateBriefPrompt(evaluations, totalScore, unknownItems, notes)}
              </div>
            </div>
          )}

          <CopyButton
            getText={() => {
              if (isLongTerm) {
                return mode === 'signal'
                  ? generateLongTermSignalPrompt(evaluations, totalScore, unknownItems, notes)
                  : generateLongTermBriefPrompt(evaluations, totalScore, unknownItems, notes);
              }
              if (isPsw) {
                return mode === 'signal'
                  ? generatePswSignalPrompt(evaluations, totalScore, unknownItems, notes)
                  : generatePswBriefPrompt(evaluations, totalScore, unknownItems, notes);
              }
              return mode === 'signal'
                ? generateSignalPrompt(evaluations, totalScore, unknownItems, notes)
                : generateBriefPrompt(evaluations, totalScore, unknownItems, notes);
            }}
          />

          <div style={{
            marginTop: 10,
            padding: '14px 16px',
            background: 'rgba(170,255,0,0.05)',
            border: '1px solid rgba(170,255,0,0.25)',
            borderLeft: '3px solid var(--accent-green)',
            borderRadius: 4,
            fontSize: '0.85rem',
            color: '#ccc',
            lineHeight: 1.9,
            fontWeight: 500,
          }}>
            コピーした内容をAIに貼り付けてください。<br />
            <br />
            <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>【精度を上げる4つのコツ】</span><br />
            1. 上位モデルを使う（Claude Opus / GPT-4o / Gemini Pro）<br />
            <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ フリープランでもモデル切替で精度が大きく変わります</span><br />
            2. GPTは「深く考える」モードで実行する<br />
            <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ o1 / o3 / Deep Research などの推論モードを活用</span><br />
            3. 出力後「もっと具体的に」と追加で指示する<br />
            <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ 1回で完璧を求めず、対話で精度を上げるのがAI活用の基本</span><br />
            4. メモアプリに入れて保存する<br />
            <span style={{ color: '#888', fontSize: '0.78rem' }}>　→ 出力結果をそのまま記録・共有・引継ぎに活用</span><br />
            <br />
            <span style={{ color: 'var(--status-warning)', fontWeight: 700 }}>【出力は必ず叩き台として扱ってください】</span><br />
            <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
              AIの出力には事実誤認・制度の変更・患者固有の事情の見落としが含まれる可能性があります。
            </span>
          </div>
        </>
      )}
    </div>
  );
}
