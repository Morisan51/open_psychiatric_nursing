import { SCORED_ITEMS, ITEMS_BY_CATEGORY, getJudgment, MAX_SCORE } from '../../data/masterData';

type Evals = Record<string, {
  category: string;
  item: string;
  selectedValue: string;
  score: number;
  isUnknown: boolean;
}>;

export function getCategoryText(category: string, evaluations: Evals): string {
  const entries = Object.values(evaluations).filter(e => e.category === category);
  if (entries.length === 0) return '未回答';
  return entries.map(e => `${e.item}：${e.selectedValue}`).join('　');
}

export function getPriorityIssues(evaluations: Evals): string {
  const items = SCORED_ITEMS.filter(item => {
    const e = evaluations[item.key];
    return e && e.score === 0 && !e.isUnknown;
  });
  if (items.length === 0) return '該当なし';
  return items.map(i => evaluations[i.key].item).join('、');
}

export function getStrengths(evaluations: Evals): string {
  const items = SCORED_ITEMS.filter(item => {
    const e = evaluations[item.key];
    return e && e.score === 3;
  });
  if (items.length === 0) return '該当なし';
  return items.map(i => evaluations[i.key].item).join('、');
}

export function getPriorityCategories(evaluations: Evals): string {
  const catScores: Record<string, { got: number; max: number }> = {};
  for (const [key, item] of Object.entries(ITEMS_BY_CATEGORY)) {
    const scored = item.filter(i => !i.isInfoOnly);
    if (scored.length === 0) continue;
    const max = scored.reduce((s, i) => s + Math.max(...i.options.map(o => o.score ?? 0)), 0);
    const got = Object.values(evaluations)
      .filter(e => e.category === key)
      .reduce((s, e) => s + e.score, 0);
    catScores[key] = { got, max };
  }
  const low = Object.entries(catScores)
    .filter(([, v]) => v.max > 0 && v.got / v.max < 0.5)
    .sort((a, b) => a[1].got / a[1].max - b[1].got / b[1].max)
    .map(([k]) => k);
  if (low.length === 0) return '該当なし';
  return low.join('、');
}

const LINE = '─'.repeat(36);
const TODAY = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });

export function generateSignalText(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getJudgment(totalScore);
  const pct = Math.round((totalScore / MAX_SCORE) * 100);
  const age = evaluations['age']?.selectedValue ?? '未入力';
  const gender = evaluations['gender']?.selectedValue ?? '未入力';
  const mainDisease = evaluations['mainDisease']?.selectedValue ?? '未入力';
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : '該当なし';

  const psychiatricAlerts = ['hallucination', 'moodStability', 'selfHarmRisk']
    .map(key => evaluations[key])
    .filter(Boolean)
    .filter(e => e.score <= 1)
    .map(e => `${e.item}[${e.selectedValue}]`)
    .join('　');

  const noteLines = notes
    .map((n, i) => n.trim() ? `特記事項${'①②③④⑤'[i]}：${n.trim()}` : '')
    .filter(Boolean)
    .join('\n');

  return [
    `SIGNAL // 圧縮・即時・現場判断用  ${TODAY}`,
    LINE,
    `スコア：${totalScore} / ${MAX_SCORE} pt（${pct}%）`,
    `判定：${judgment.text}`,
    `基本属性：${age}　${gender}　${mainDisease}`,
    LINE,
    `▶ 優先対応課題`,
    `  ${getPriorityIssues(evaluations)}`,
    `▶ 重点支援領域`,
    `  ${getPriorityCategories(evaluations)}`,
    psychiatricAlerts ? `▶ 精神症状アラート\n  ${psychiatricAlerts}` : '',
    `▶ 要確認（不明）`,
    `  ${unknownText}`,
    noteLines ? `${LINE}\n${noteLines}` : '',
  ].filter(Boolean).join('\n');
}

export function generateBriefText(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getJudgment(totalScore);
  const age = evaluations['age']?.selectedValue ?? '未入力';
  const gender = evaluations['gender']?.selectedValue ?? '未入力';
  const mainDisease = evaluations['mainDisease']?.selectedValue ?? '未入力';
  const complication = evaluations['complication']?.selectedValue ?? '未入力';
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : '該当なし';

  const livingText = [
    getCategoryText('ADL', evaluations),
    getCategoryText('生活スキル', evaluations),
  ].filter(t => t !== '未回答').join('\n');

  const noteLines = notes
    .map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim() || '（空白）'}`)
    .join('\n');

  return [
    `BRIEF // 展開・教育・カンファレンス用  ${TODAY}`,
    LINE,
    `退院支援サマリー`,
    LINE,
    `合計点：${totalScore} / ${MAX_SCORE} pt`,
    `判定：${judgment.text}`,
    `年齢：${age}　性別：${gender}`,
    `主疾患：${mainDisease}　合併症：${complication}`,
    LINE,
    `優先対応課題：${getPriorityIssues(evaluations)}`,
    `支援の土台：${getStrengths(evaluations)}`,
    `重点支援領域：${getPriorityCategories(evaluations)}`,
    LINE,
    `精神症状の特徴：`,
    getCategoryText('精神症状', evaluations),
    `生活環境の特徴：`,
    livingText || '未回答',
    LINE,
    `要確認項目（不明）：${unknownText}`,
    LINE,
    noteLines,
  ].join('\n');
}

export function generateSignalPrompt(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getJudgment(totalScore);
  const age = evaluations['age']?.selectedValue ?? 'N/A';
  const gender = evaluations['gender']?.selectedValue ?? 'N/A';
  const mainDisease = evaluations['mainDisease']?.selectedValue ?? 'N/A';
  const complication = evaluations['complication']?.selectedValue ?? 'N/A';
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : 'N/A';

  const livingText = [
    getCategoryText('ADL', evaluations),
    getCategoryText('生活スキル', evaluations),
  ].filter(t => t !== '未回答').join('　') || 'N/A';

  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  return `SIGNAL // 圧縮・即時・現場判断用
上記は患者1名分の退院支援サマリー。記載以外は推測しない。
欠落はN/Aと記す。

【退院支援サマリー】
年齢: ${age}
性別: ${gender}
主疾患: ${mainDisease}
合併症・医療ケア: ${complication}
合計点: ${totalScore} /66点
判定コメント: ${judgment.text}
優先対応課題: ${getPriorityIssues(evaluations)}
支援の土台（強み）: ${getStrengths(evaluations)}
重点支援領域（課題）: ${getPriorityCategories(evaluations)}
精神症状の特徴: ${getCategoryText('精神症状', evaluations)}
生活環境の特徴: ${livingText}
要確認項目: ${unknownText}
看護師備考: ${noteText}

役割
精神科病棟の退院支援カンファレンス補助AI。
全スタッフが「何を優先すべきか」を一目で把握できる叩き台を作成する。医療行為の指示はしない。

判断基準
・「優先対応課題」＝退院の前提条件。最優先で対応。
・「支援の土台」＝強み。支援計画の基盤として活用。
・「重点支援領域」＝0点評価。集中的介入が必要。

出力要件（すべてテキスト・表禁止・合計A4で3枚以内）

1. エグゼクティブサマリー（80字以内）
- 全体像を1文で。強みと最大の課題を含める。

2. ターニングポイントと優先アクション
- 3〜5項目の箇条書き。
- 各項目「課題 → 具体的アクション → 担当」を1行30字以内で。

3. 退院可否と条件
- 判定コメントを基本線に、退院に必要な条件を3項目以内で。

4. 90日計画（3フェーズ各2〜3行）
- 0〜7日／8〜30日／31〜90日
- 各フェーズ「目標」「主な介入」のみ記載。

5. 退院後リスクTop3
- 「リスク → 早期サイン → 対応」を1行40字以内で。

6. カンファレンス論点（3〜5項目）
- Yes/Noで答えられる問いの形式。

7. 不足情報（3〜5項目）
- 箇条書きのみ。仮定は書かない。

ルール
・入力にない事実は書かない。
・1文30字程度。箇条書き優先。
・重複する内容は統合して1回だけ書く。
・患者の個人名は出力しない。`;
}

export function generateBriefPrompt(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getJudgment(totalScore);
  const age = evaluations['age']?.selectedValue ?? 'N/A';
  const gender = evaluations['gender']?.selectedValue ?? 'N/A';
  const mainDisease = evaluations['mainDisease']?.selectedValue ?? 'N/A';
  const complication = evaluations['complication']?.selectedValue ?? 'N/A';
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : 'N/A';

  const livingText = [
    getCategoryText('ADL', evaluations),
    getCategoryText('生活スキル', evaluations),
  ].filter(t => t !== '未回答').join('　') || 'N/A';

  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  return `BRIEF // 展開・教育・カンファレンス用
上記は患者1名分のA4サマリー。記載以外は推測しない。
欠落はN/Aと記す。

【退院支援サマリー】
年齢: ${age}
性別: ${gender}
主疾患: ${mainDisease}
合併症・医療ケア: ${complication}
合計点: ${totalScore} /66点
判定コメント: ${judgment.text}
優先対応課題: ${getPriorityIssues(evaluations)}
支援の土台（強み）: ${getStrengths(evaluations)}
重点支援領域（課題）: ${getPriorityCategories(evaluations)}
精神症状の特徴: ${getCategoryText('精神症状', evaluations)}
生活環境の特徴: ${livingText}
要確認項目: ${unknownText}
看護師備考: ${noteText}

役割
あなたは精神科病棟の「退院支援カンファレンス補助AI」。
日本の急性期・長期療養を前提に、全スタッフ（看護師・MHSW・OT等）が
・どこがターニングポイントか
・今なにを確認・支援すべきか
を一目で把握できる叩き台を作成する。医療行為の指示はしない。

重要な判断基準
・「優先対応課題」に記載された項目は、退院の前提条件として最優先で対応すべき課題である。
・「支援の土台」に記載された項目は、患者の強みであり、支援計画の基盤として活用する。
・「重点支援領域」に記載された項目は、0点評価の領域であり、集中的な介入が必要である。
・「合計点」は66点満点。点数と判定コメントを照合し、支援の方向性を判断する。

出力要件（表は禁止・テキストのみ）

エグゼクティブサマリー（120字以内）
- このケースの全体像を1段落で要約する。
- 「優先対応課題」と「支援の土台」を必ず反映させる。

今回の支援のターニングポイント
- 箇条書きで2〜3項目。
- 各40字以内。
- 「優先対応課題」から最低1項目を含める。
- 「何が」「なぜここが勝負どころか」をセットで書く。

優先度つきアクション整理
- 各カテゴリ2〜4項目。1項目40字以内。
- 「優先対応課題」の項目は必ず(1)または(3)に含める。
(1) 早急に確認すべきこと
(2) のちに確認すべきこと
(3) 支援で早急にやるべきこと
(4) 重要ではないが、やっておくと良いこと

強みを活かした支援方針
- 「支援の土台」に記載された強みをどう活用するか、2〜4項目で具体的に記述する。
- 各項目30〜50字。

重要所見 Top5
- 各20〜40字。
- サマリー内の語句を必ず一つ「　」で引用する。
- 「スタッフにとってなぜ重要か」を一言だけ添える。
- 「優先対応課題」「重点支援領域」から優先的に抽出する。

退院可否の見立てと根拠
- 「判定コメント」を基本線として尊重。
- 「優先対応課題」が解決された場合の見通しを含める。
- その判断を支える根拠を3〜5行で箇条書き。
- 異なる見立てがあり得る場合のみ、その理由を簡潔に列挙する。

90日支援計画（ざっくり）
- フェーズごとに3〜5行程度で記述。表は禁止。
- 「優先対応課題」の解決を各フェーズの目標に組み込む。
- 「支援の土台」を活用した介入を明記する。
- 各フェーズに必ず含める項目：「目的」「主な看護介入」「スタッフが意識するポイント」
- フェーズ：0〜7日／8〜30日／31〜90日
- KPIはあっても各フェーズ1〜2個まで。

退院後リスクTop5と早期兆候・対応
- 各30〜60字。
- 「重点支援領域」の項目を優先的にリスクとして抽出する。
- 「リスク → 早期サイン → スタッフがまず行う行動」の順で1行にまとめる。

社会資源・制度プラン
- 事実としてわかることと、「候補」「〜の可能性」を明確に分けて書く。
- 利用候補／申請・調整のタイミング／主な担当を簡潔に整理する。

家族支援・環境調整
- 家族と話すときの視点を中心に、3〜6項目の箇条書き。
- 介護導線・誤薬/転倒予防・服薬支援・通院同行など、実際の場面をイメージできる内容にする。

カンファレンス論点（5〜8項目）
- Yes/Noで答えやすい問いの形にする。
- 「優先対応課題」に関する論点を最低2項目含める。
- スタッフが「そのまま質問として使える」シンプルな日本語にする。

不足情報と仮定
- 不足: 「いま分かっていないが、支援上重要な情報」を箇条書き。
- 仮定: 最小限にとどめ、各仮定ごとに「この仮定が外れた場合の影響」を1行で書く。

ルール
・入力にない事実は書かない。
・一般論は必ず「候補」「〜の可能性」と明示する。
・文体は簡潔、1文40字程度、箇条書き優先。
・患者の個人名や識別子は出力しない。
・医師判断が必要な内容は「医師判断事項」と明示する。
・専門用語は、可能なら新人向けの一言説明を添える。

出力形式
・見出し付きテキストのみ。
・表や罫線、Markdown表は使用しない。
・すべて日本語で出力する。`;
}
