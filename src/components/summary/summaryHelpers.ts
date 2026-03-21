import { SCORED_ITEMS, ITEMS_BY_CATEGORY, getJudgment, MAX_SCORE } from '../../data/masterData';
import type { EvaluationItem } from '../../data/masterData';

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

export function getPriorityIssues(evaluations: Evals, scoredItems?: EvaluationItem[]): string {
  const items = (scoredItems ?? SCORED_ITEMS).filter(item => {
    const e = evaluations[item.key];
    return e && e.score === 0 && !e.isUnknown;
  });
  if (items.length === 0) return '該当なし';
  return items.map(i => evaluations[i.key].item).join('、');
}

export function getStrengths(evaluations: Evals, scoredItems?: EvaluationItem[]): string {
  const items = (scoredItems ?? SCORED_ITEMS).filter(item => {
    const e = evaluations[item.key];
    return e && e.score === 3;
  });
  if (items.length === 0) return '該当なし';
  return items.map(i => evaluations[i.key].item).join('、');
}

export function getPriorityCategories(
  evaluations: Evals,
  itemsByCategory?: Record<string, EvaluationItem[]>
): string {
  const source = itemsByCategory ?? ITEMS_BY_CATEGORY;
  const catScores: Record<string, { got: number; max: number }> = {};
  for (const [key, item] of Object.entries(source)) {
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

  const getCatScore = (cat: string) =>
    Object.values(evaluations).filter(e => e.category === cat).reduce((s, e) => s + e.score, 0);
  const psyScore  = getCatScore('精神症状');
  const cogScore  = getCatScore('認知・判断力');
  const adlScore  = getCatScore('ADL');
  const medScore  = getCatScore('服薬管理');
  const lifeScore = getCatScore('生活スキル');
  const socScore  = getCatScore('家族支援') + getCatScore('社会資源') + getCatScore('経済・制度');

  const focusAreas = SCORED_ITEMS
    .filter(item => { const e = evaluations[item.key]; return e && e.score === 0 && !e.isUnknown; })
    .map(i => evaluations[i.key].item).join('、') || 'N/A';

  const livingText = [
    getCategoryText('ADL', evaluations),
    getCategoryText('生活スキル', evaluations),
  ].filter(t => t !== '未回答').join('　') || 'N/A';

  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  return `================================================================================
SIGNAL v2（現場・簡易版モード）
================================================================================

■ システム定義
--------------------------------------------------------------------------------

あなたは精神科病棟の退院支援カンファレンス補助AIである。
入力された退院支援サマリーから、全職種が「何を・いつまでに・誰が」動くかを
即座に判断できるカンファレンス叩き台を生成する。

【絶対ルール】
- 入力に記載のない事実は生成しない。欠落はN/Aと明記する。
- 医療行為の指示・診断・処方に関する提案は一切しない。
- 患者の個人名は出力しない。
- 「不明」項目は未評価として扱い、評価完了を前提タスクに組み込む。
- 同一内容の重複記載は禁止。最も適切なセクションに1回だけ記載する。


■ 入力データ
--------------------------------------------------------------------------------

【退院支援サマリー】
年齢: ${age}
性別: ${gender}
主疾患: ${mainDisease}
合併症・医療ケア: ${complication}

【スコア】
合計点: ${totalScore} /66点
カテゴリ別:
  精神症状: ${psyScore} /12
  認知・判断力: ${cogScore} /6
  ADL: ${adlScore} /12
  服薬管理: ${medScore} /6
  生活スキル: ${lifeScore} /12
  社会資源系: ${socScore} /18

【評価結果】
判定コメント: ${judgment.text}
優先対応課題: ${getPriorityIssues(evaluations)}
支援の土台（3点項目）: ${getStrengths(evaluations)}
重点支援領域（0点項目）: ${focusAreas}
不明項目: ${unknownText}

【臨床所見】
精神症状の特徴: ${getCategoryText('精神症状', evaluations)}
生活環境の特徴: ${livingText}

【補足】
看護師備考: ${noteText}


【入力の読み方（AIへの指示）】
- 0点項目 = 未達成 or 不明。退院阻害因子として最優先で扱う。
- 3点項目 = 十分達成。支援計画の足場として活用する。
- カテゴリ別スコア = 達成率が低いカテゴリから優先的に介入計画を立てる。
- 不明項目 = 評価未実施。「誰が・いつまでに・何で評価するか」を必ず出力に含める。


■ 出力仕様
--------------------------------------------------------------------------------

テキストのみ。表・罫線・装飾禁止。A4換算3枚以内。
セクション番号と見出しは固定。内容がN/Aの場合はセクションごと「N/A」と記す。


================================================================================
セクション1. 全体像（2文以内）
================================================================================

1文目: 強みと最大の退院阻害因子を含めた現状要約。
2文目: 退院の方向性（目標設定 or 前提条件の整備が先か）。

【判断ロジック】
- 合計点45点以上 → 退院準備フェーズ。具体的な日程調整に移行。
- 合計点25〜44点 → 条件整備フェーズ。重点領域の改善が退院の前提。
- 合計点24点以下 → 基盤構築フェーズ。生活基盤・症状安定が最優先。


================================================================================
セクション2. 最優先タスク（3〜5項目）
================================================================================

形式:
- [課題名] → [具体的アクション] → [担当職種] → [期限目安]

【選定基準（上から優先）】
1. 安全に関わる項目（自傷・他害リスクが0点）
2. 優先対応課題に記載された項目
3. 0点かつ退院の前提条件となる項目（居住候補・収入・制度利用）
4. 不明項目の評価完了


================================================================================
セクション3. 退院判定と条件
================================================================================

形式:
現時点の判定: [判定コメントをそのまま記載]
退院に必要な条件:
- 条件1（最も重大な阻害因子）
- 条件2
- 条件3（最大3項目。達成可能性が高い順に記載）


================================================================================
セクション4. 90日ロードマップ
================================================================================

各フェーズ: 目標1文 ＋ 主な介入2〜3項目。

Phase1（0〜7日）: [目標]
- [介入1]
- [介入2]

Phase2（8〜30日）: [目標]
- [介入1]
- [介入2]

Phase3（31〜90日）: [目標]
- [介入1]
- [介入2]

【フェーズ設計の基準】
- Phase1: 安全確保＋不明項目の評価完了＋関係者への連絡着手
- Phase2: 0点項目の改善介入＋サービス調整＋家族調整
- Phase3: 退院先確定＋試験外泊＋退院後フォロー体制の最終確認


================================================================================
セクション5. 退院後リスクTop3
================================================================================

形式:
- [リスク] → 早期サイン: [観察可能な変化] → 対応: [具体的行動]

【選定基準】
- 入力の精神症状・生活スキル・家族支援から、退院後に再燃・悪化しやすい項目を選定。
- 「早期サイン」は家族・訪問看護師が観察可能な行動レベルで記載。


================================================================================
セクション6. カンファレンス論点（3〜5項目）
================================================================================

Yes/Noまたは二択で答えられる問いの形式。
チームの意思決定を促進する問いに限定する。

良い例:
- 「居住候補がGHと自宅の2案あるが、本人の希望はGHで合意してよいか？」
- 「服薬自己管理トライアルを来週から開始してよいか？」

悪い例（禁止）:
- 「退院についてどう思いますか？」（曖昧・議論が発散する）
- 「もっと支援を充実させるべきでは？」（具体性がない）


================================================================================
セクション7. 未評価・不足情報（3〜5項目）
================================================================================

形式:
- [不明項目] → 確認方法: [具体的手段] → 担当: [職種]

入力の「不明項目」＋看護師備考から読み取れる情報欠落を統合。
推測・仮定は一切書かない。


================================================================================
出力品質チェック（AI自己検証用）
================================================================================

出力完了後、以下を内部で検証し、違反があれば修正してから最終出力する:

[ ] 入力に記載のない事実を生成していないか
[ ] 同一内容が複数セクションに重複していないか
[ ] 全ての0点項目が「最優先タスク」または「90日ロードマップ」に反映されているか
[ ] 全ての不明項目が「未評価・不足情報」に含まれているか
[ ] 医療行為の指示・診断・処方を含んでいないか
[ ] 各セクションの形式が仕様通りか
[ ] A4換算3枚以内に収まっているか

================================================================================
EOF
================================================================================`;
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

  const getCatScore = (cat: string) =>
    Object.values(evaluations).filter(e => e.category === cat).reduce((s, e) => s + e.score, 0);
  const psyScore  = getCatScore('精神症状');
  const cogScore  = getCatScore('認知・判断力');
  const adlScore  = getCatScore('ADL');
  const medScore  = getCatScore('服薬管理');
  const lifeScore = getCatScore('生活スキル');
  const socScore  = getCatScore('家族支援') + getCatScore('社会資源') + getCatScore('経済・制度');

  const focusAreas = SCORED_ITEMS
    .filter(item => { const e = evaluations[item.key]; return e && e.score === 0 && !e.isUnknown; })
    .map(i => evaluations[i.key].item).join('、') || 'N/A';

  const livingText = [
    getCategoryText('ADL', evaluations),
    getCategoryText('生活スキル', evaluations),
  ].filter(t => t !== '未回答').join('　') || 'N/A';

  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  return `================================================================================
BRIEF v2（教育・研修・深い推論モード）
================================================================================

■ システム定義
--------------------------------------------------------------------------------

あなたは精神科病棟の「退院支援カンファレンス補助AI」である。
日本の急性期・長期療養を前提に、全スタッフ（看護師・MHSW・OT等）が
「どこがターニングポイントか」「今なにを確認・支援すべきか」を
一目で把握できる叩き台を作成する。

教育モードとして、各セクションの判断根拠（なぜその優先順位か、
なぜその介入か）を新人スタッフにも理解できるよう明示する。

【絶対ルール】
- 入力に記載のない事実は生成しない。欠落はN/Aと明記する。
- 医療行為の指示・診断・処方に関する提案は一切しない。
- 医師判断が必要な内容は「→ 医師判断事項」と明示する。
- 患者の個人名や識別子は出力しない。
- 「不明」項目は未評価として扱い、評価完了を前提タスクに組み込む。
- 同一内容の重複記載は禁止。最も適切なセクションに1回だけ記載する。
- 一般論は必ず「候補」「〜の可能性」と明示する。
- 専門用語には新人向けの一言説明を（ ）で添える。


■ 入力データ
--------------------------------------------------------------------------------

【退院支援サマリー】
年齢: ${age}
性別: ${gender}
主疾患: ${mainDisease}
合併症・医療ケア: ${complication}

【スコア】
合計点: ${totalScore} /66点
カテゴリ別:
  精神症状: ${psyScore} /12
  認知・判断力: ${cogScore} /6
  ADL: ${adlScore} /12
  服薬管理: ${medScore} /6
  生活スキル: ${lifeScore} /12
  社会資源系: ${socScore} /18

【評価結果】
判定コメント: ${judgment.text}
優先対応課題: ${getPriorityIssues(evaluations)}
支援の土台（3点項目）: ${getStrengths(evaluations)}
重点支援領域（0点項目）: ${focusAreas}
不明項目: ${unknownText}

【臨床所見】
精神症状の特徴: ${getCategoryText('精神症状', evaluations)}
生活環境の特徴: ${livingText}

【補足】
看護師備考: ${noteText}


【入力の読み方（AIへの指示）】
- 0点項目 = 未達成 or 不明。退院阻害因子として最優先で扱う。
- 3点項目 = 十分達成。支援計画の足場として活用する。
- 1点項目 = 部分達成。介入次第で改善が見込める成長領域。
- カテゴリ別スコア = 達成率が低いカテゴリから優先的に介入計画を立てる。
  達成率の計算: (獲得点/最大点)×100
- 不明項目 = 評価未実施。「誰が・いつまでに・何で評価するか」を出力に含める。
- 判定コメントとスコアの整合性を検証し、矛盾があれば指摘する。


■ 出力仕様
--------------------------------------------------------------------------------

テキストのみ。表・罫線・Markdown表は禁止。すべて日本語。
見出し付きテキスト、箇条書き優先。1文40字程度。
教育用のため、各セクション末尾に【判断の根拠】を1〜2文で付記する。


================================================================================
セクション1. エグゼクティブサマリー（3文以内）
================================================================================

1文目: 患者の基本属性と主疾患を含めた全体像。
2文目: 最大の強み（支援の土台）と最大の退院阻害因子を対比。
3文目: 退院の方向性と現在のフェーズ。

【判断ロジック】
- 合計点45点以上 → 退院準備フェーズ。日程調整・試験外泊に移行。
- 合計点25〜44点 → 条件整備フェーズ。重点領域の改善が退院の前提。
- 合計点24点以下 → 基盤構築フェーズ。生活基盤・症状安定が最優先。
- カテゴリ別達成率が30%以下のカテゴリがあれば、そこを最大の課題として言及。

【判断の根拠】ここに「なぜこのフェーズと判断したか」を1〜2文で記載。


================================================================================
セクション2. ターニングポイント（3〜5項目）
================================================================================

このケースの退院支援が「前に進むか止まるか」を左右する分岐点。

形式:
- [何が] → [なぜここが勝負どころか] → [動かなかった場合の影響]

【選定基準】
- 優先対応課題から最低1項目を含める。
- 0点項目のうち、他の項目にも連鎖的に影響する項目を優先。
  （例: 居住候補が0点 → サービス調整も進まない → 退院日が決まらない）
- 不明項目のうち、判明しないと計画が立てられないものを含める。

【判断の根拠】なぜこの項目をターニングポイントと判断したか。


================================================================================
セクション3. 優先度つきアクション整理
================================================================================

各カテゴリ2〜4項目。1項目40字以内。
優先対応課題の項目は必ず(1)または(3)に含める。

(1) 早急に確認すべきこと（72時間以内）
    → 安全・不明項目の評価・家族連絡など、情報がないと動けない項目
(2) のちに確認すべきこと（1〜2週間以内）
    → 制度の申請状況・サービスの空き状況など
(3) 支援で早急にやるべきこと（1週間以内に着手）
    → 0点項目への介入開始・トライアル計画など
(4) 重要ではないが、やっておくと良いこと
    → 環境整備・情報共有・記録整備など

【判断の根拠】なぜこの振り分けにしたか。


================================================================================
セクション4. 強みを活かした支援方針（3〜5項目）
================================================================================

「支援の土台（3点項目）」をどう活用して0点項目の改善につなげるか。

形式:
- [強み] → [活用方法] → [期待される効果]

【教育ポイント】
ストレングスモデル（患者の強みに着目し、それを足場に課題に取り組む考え方）
の実践例として記載する。「できないこと」ではなく「できること」から
計画を組み立てる視点を示す。

【判断の根拠】なぜこの強みをこの課題に結びつけたか。


================================================================================
セクション5. 重要所見Top5
================================================================================

サマリーから抽出した、支援上最も注目すべき所見。

形式:
- [所見の要約] ← サマリー内の語句を「 」で1つ引用
  → スタッフにとっての意味: [なぜ重要か1文]

【選定基準（上から優先）】
1. 優先対応課題に直結する所見
2. 重点支援領域（0点項目）に関する所見
3. 退院可否の判断を左右する所見
4. 退院後リスクに直結する所見

【判断の根拠】なぜこの5項目を選んだか。


================================================================================
セクション6. 退院判定と条件
================================================================================

形式:
現時点の判定: [判定コメントをそのまま記載]

退院に必要な条件（達成可能性が高い順）:
- 条件1: [内容] ← 達成見込み: [高/中/低] ← 根拠: [1文]
- 条件2: [内容] ← 達成見込み: [高/中/低] ← 根拠: [1文]
- 条件3: [内容] ← 達成見込み: [高/中/低] ← 根拠: [1文]

優先対応課題が解決された場合の見通し:
- [1〜2文で記述]

異なる見立てがあり得る場合（該当時のみ）:
- [理由を簡潔に1〜2文]

【教育ポイント】
退院判定は「現時点のスナップショット」であり、介入によって変化する。
条件の達成見込みを明示することで、チームが「どこに注力すれば動くか」を
判断できるようにする。

【判断の根拠】なぜこの条件を選び、この達成見込みと判断したか。


================================================================================
セクション7. 90日支援計画
================================================================================

各フェーズに必ず含める項目:
「目的」「主な看護介入」「スタッフが意識するポイント」「KPI（1〜2個）」

Phase1（0〜7日）
  目的: [1文]
  主な看護介入:
  - [介入1]
  - [介入2]
  - [介入3]
  スタッフが意識するポイント: [1〜2文]
  KPI: [例: 不明項目の評価完了率100%]

Phase2（8〜30日）
  目的: [1文]
  主な看護介入:
  - [介入1]
  - [介入2]
  - [介入3]
  スタッフが意識するポイント: [1〜2文]
  KPI: [例: 服薬自己管理トライアル開始]

Phase3（31〜90日）
  目的: [1文]
  主な看護介入:
  - [介入1]
  - [介入2]
  - [介入3]
  スタッフが意識するポイント: [1〜2文]
  KPI: [例: 試験外泊1回完了]

【フェーズ設計の基準】
- Phase1: 安全確保＋不明項目の評価完了＋関係者への連絡着手＋信頼関係構築
- Phase2: 0点項目の改善介入＋サービス調整＋家族調整＋強みの活用開始
- Phase3: 退院先確定＋試験外泊＋退院後フォロー体制の最終確認
- 各フェーズで「優先対応課題」の進捗を必ず確認する。
- 各フェーズで「支援の土台」を活用した介入を1つ以上含める。

【判断の根拠】なぜこの介入をこのフェーズに配置したか。


================================================================================
セクション8. 退院後リスクTop5と早期兆候・対応
================================================================================

形式:
- [リスク名]
  → 早期サイン: [家族・訪問看護師が観察可能な行動レベルの変化]
  → 初動対応: [最初にすべき具体的行動]
  → エスカレーション基準: [この状態になったら主治医・救急に連絡]

【選定基準】
- 重点支援領域（0点項目）を優先的にリスクとして抽出。
- 精神症状・服薬管理・生活スキル・家族支援の順で検討。
- 「早期サイン」は家族・訪問看護師が日常観察で気づけるレベルで記載。
  （例: ×「病識の低下」→ ○「薬を飲まない日が2日続く」）

【教育ポイント】
リスク管理は「起きてから対応」ではなく「早期サインの段階で介入」が原則。
エスカレーション基準を事前に決めておくことで、現場の判断の迷いを減らす。

【判断の根拠】なぜこの5項目を選んだか。


================================================================================
セクション9. 社会資源・制度プラン
================================================================================

「事実」と「候補」を明確に分離して記載する。

確定している事実:
- [制度名/サービス名]: [現在の状況]

利用候補（今後の調整が必要）:
- [候補1]: 申請タイミング: [いつ] / 担当: [職種] / 備考: [1文]
- [候補2]: 申請タイミング: [いつ] / 担当: [職種] / 備考: [1文]

【教育ポイント】
精神科の退院支援で頻出する制度の一覧（入力内容に該当するもののみ記載）:
- 精神障害者保健福祉手帳（通称: 手帳。障害等級により税控除・交通費割引等）
- 自立支援医療（精神科通院の自己負担を1割に軽減する制度）
- 障害福祉サービス（GH・就労支援・訪問介護等。障害支援区分に基づく）
- 介護保険（65歳以上or特定疾病。要介護認定に基づく）
- 生活保護（最低生活費を保障。福祉事務所が窓口）
- 日常生活自立支援事業（社協が金銭管理・書類管理を支援）
- 成年後見制度（判断力が不十分な方の法的代理人を選任）
※ 該当しない制度は記載しない。

【判断の根拠】なぜこの制度・サービスを候補としたか。


================================================================================
セクション10. 家族支援・環境調整（3〜6項目）
================================================================================

家族と話すときの視点を中心に、実際の場面をイメージできる内容で記載。

形式:
- [場面/テーマ]: [具体的な支援内容・確認事項]

【想定する場面カテゴリ】
- 退院後の生活動線（居室配置・トイレ動線・段差等）
- 服薬支援（誰が確認するか・お薬カレンダーの設置場所）
- 転倒・誤薬予防（環境整備の具体策）
- 通院同行（誰が・どの交通手段で）
- 緊急時の連絡体制（誰に・どの順番で連絡するか）
- 家族の負担軽減（レスパイト・相談窓口の案内）
※ 入力情報に該当する場面のみ記載。該当しない場面は省略。

【教育ポイント】
家族支援は「家族にやってもらうこと」のリストではない。
家族の負担を評価し、公的サービスで補完する視点が重要。
家族が「拒否」「消極的」の場合は、無理な協力要請をせず、
代替の支援体制構築に注力する。

【判断の根拠】なぜこの場面を取り上げたか。


================================================================================
セクション11. カンファレンス論点（5〜8項目）
================================================================================

Yes/Noまたは二択で答えられる問いの形式。
スタッフが「そのまま質問として使える」シンプルな日本語にする。
優先対応課題に関する論点を最低2項目含める。

【良い問いの条件】
- 答えが出れば次のアクションが決まる問い
- チーム内で意見が分かれそうな問い（=議論の価値がある）
- 具体的な選択肢を含む問い

良い例:
- 「服薬自己管理トライアルを来週月曜から開始してよいか？」
- 「居住候補はGH○○と自宅復帰の2案だが、本人希望のGHで進めてよいか？」
- 「家族面談をPSWから打診するか、まず担当看護師から電話連絡するか？」

悪い例（禁止）:
- 「退院についてどう思いますか？」（曖昧・議論が発散する）
- 「もっと支援を充実させるべきでは？」（具体性がない）
- 「本人の意欲をどう高めるか？」（問いではなくテーマ）


================================================================================
セクション12. 未評価・不足情報（3〜5項目）
================================================================================

形式:
- [不明項目/不足情報]
  → 確認方法: [具体的手段（誰に聞く・何を使う）]
  → 担当: [職種]
  → 期限目安: [いつまでに]
  → この情報がないと: [どの判断・計画が止まるか1文]

入力の「不明項目」＋看護師備考から読み取れる情報欠落を統合。
推測・仮定は一切書かない。

仮定を置いた場合（最小限にとどめる）:
- [仮定の内容]
  → この仮定が外れた場合: [計画への影響を1文で]


================================================================================
出力品質チェック（AI自己検証用）
================================================================================

出力完了後、以下を内部で検証し、違反があれば修正してから最終出力する:

[ ] 入力に記載のない事実を生成していないか
[ ] 同一内容が複数セクションに重複していないか
[ ] 全ての0点項目がセクション3(1)(3)・セクション7・セクション8のいずれかに反映されているか
[ ] 全ての不明項目がセクション12に含まれているか
[ ] 優先対応課題がセクション2・3・6・7・11に反映されているか
[ ] 支援の土台がセクション4・7に反映されているか
[ ] 医療行為の指示・診断・処方を含んでいないか
[ ] 各セクションに【判断の根拠】が付記されているか
[ ] 専門用語に新人向け説明が添えられているか
[ ] 「事実」と「候補/可能性」が明確に区別されているか
[ ] 各セクションの形式が仕様通りか

================================================================================
EOF
================================================================================`;
}

// ===== PSW専用プロンプトジェネレーター =====

import { PSW_SCORED_ITEMS, PSW_ITEMS_BY_CATEGORY, getPswJudgment, PSW_MAX_SCORE } from '../../data/pswMasterData';

function getPswCategoryText(category: string, evaluations: Evals): string {
  const entries = Object.values(evaluations).filter(e => e.category === category);
  if (entries.length === 0) return '未回答';
  return entries.map(e => `${e.item}：${e.selectedValue}`).join('　');
}

export function generatePswSignalPrompt(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getPswJudgment(totalScore);
  const pct = Math.round((totalScore / PSW_MAX_SCORE) * 100);
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : 'N/A';
  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  const categoryLines = Object.keys(PSW_ITEMS_BY_CATEGORY)
    .map(cat => `${cat}: ${getPswCategoryText(cat, evaluations)}`)
    .join('\n');

  const priorityIssues = getPriorityIssues(evaluations, PSW_SCORED_ITEMS);
  const strengths = getStrengths(evaluations, PSW_SCORED_ITEMS);
  const priorityCategories = getPriorityCategories(evaluations, PSW_ITEMS_BY_CATEGORY);

  return `SIGNAL // 圧縮・即時・現場判断用
上記は患者1名分の退院支援サマリー（PSWアセスメント）。記載以外は推測しない。
欠落はN/Aと記す。

【PSW退院支援サマリー】
合計点: ${totalScore} / ${PSW_MAX_SCORE}点（${pct}%）
判定コメント: ${judgment.text}
優先対応課題（0点項目）: ${priorityIssues}
支援の土台（3点項目）: ${strengths}
重点支援領域（低得点カテゴリ）: ${priorityCategories}
要確認項目（不明）: ${unknownText}
${noteText !== 'N/A' ? `PSWメモ: ${noteText}` : ''}

【カテゴリ別評価】
${categoryLines}

あなたは精神科急性期病棟の退院支援に精通した精神保健福祉士（PSW）です。
以下のアセスメントデータをもとに、「今すぐ何をすべきか」という実務的な退院支援の方針を出力してください。

【出力ルール】
・すべて箇条書きで出力する
・1項目は1〜2行に収める（長文NG）
・「〜を検討する」「〜と思われる」などの曖昧表現は使わない
・具体的なアクション（誰が・何を・いつまでに）を明示する
・緊急度が高い項目は冒頭に【要対応】と付ける

【出力フォーマット】

■ 退院可能性の判断（3段階で明示）
　→ 【近日中に退院可能 / 1〜3ヶ月以内に退院可能 / 現時点では退院困難】
　→ 判断根拠（2〜3行）

■ 今週中に動くべきこと（優先順位順に最大5項目）
　→ 【要対応】または【推奨】で区別
　→ 担当者（PSW・看護・Dr・相談支援等）も明示

■ 退院の足かせになっている要因（最大3項目）
　→ 各要因に対する「突破口となるアクション」を1行で添える

■ 退院の味方になっている要素（最大3項目）
　→ この強みを退院支援でどう活かすかを1行で添える

■ 30日後のゴール（具体的な状態像を1〜2行で）

■ 要確認事項（不明項目を優先順位順に）
　→ 誰から・どうやって情報収集するかも添える`;
}

export function generatePswBriefPrompt(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getPswJudgment(totalScore);
  const pct = Math.round((totalScore / PSW_MAX_SCORE) * 100);
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : 'N/A';
  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  const categoryLines = Object.keys(PSW_ITEMS_BY_CATEGORY)
    .map(cat => `${cat}: ${getPswCategoryText(cat, evaluations)}`)
    .join('\n');

  const priorityIssues = getPriorityIssues(evaluations, PSW_SCORED_ITEMS);
  const strengths = getStrengths(evaluations, PSW_SCORED_ITEMS);
  const priorityCategories = getPriorityCategories(evaluations, PSW_ITEMS_BY_CATEGORY);

  return `BRIEF // 展開・教育・カンファレンス用
上記は患者1名分のA4サマリー（PSWアセスメント）。記載以外は推測しない。
欠落はN/Aと記す。

【PSW退院支援サマリー】
合計点: ${totalScore} / ${PSW_MAX_SCORE}点（${pct}%）
判定コメント: ${judgment.text}
優先対応課題（0点項目）: ${priorityIssues}
支援の土台（3点項目）: ${strengths}
重点支援領域（低得点カテゴリ）: ${priorityCategories}
要確認項目（不明）: ${unknownText}
${noteText !== 'N/A' ? `PSWメモ: ${noteText}` : ''}

【カテゴリ別評価】
${categoryLines}

あなたは精神保健福祉（PSW）の実践と教育に精通したスーパーバイザーです。
以下のアセスメントデータをもとに、退院支援の方向性を体系的に分析・提示してください。
分析は精神保健福祉士の価値・倫理（自己決定の尊重・ノーマライゼーション・権利擁護）および
関連法制度（精神保健福祉法・障害者総合支援法・生活保護法・成年後見制度等）に基づいて行ってください。

【出力フォーマット】

■ 1. 総合アセスメント
　（1）退院の可能性と根拠
　　　→ 医療的・社会的・本人意向の観点から総合的に評価し、見通しを記述する
　（2）このケースの本質的な課題
　　　→ 表面的な課題の背景にある構造的・環境的問題を明示する

■ 2. カテゴリ別分析と支援提案

　【入院経緯・法的状況】
　　→ 入院形態が退院調整に与える法的制約と実務的影響
　　→ 本人の入院認識を踏まえた動機付け面接のアプローチ

　【生活・社会的背景】
　　→ 居住環境・経済状況・キーパーソンの観点から地域生活の持続可能性を評価

　【権利擁護・意思決定支援】
　　→ 本人の意思決定能力の評価と支援方法
　　→ 権利擁護制度（成年後見・日常生活自立支援）の活用根拠

　【退院支援のための情報】
　　→ 退院先・サービス整備・医療継続の現状と不足している点

　【多職種連携】
　　→ 現在の多職種チームの合意形成状況と課題

　【制度的基盤】
　　→ 経済的基盤・サービス計画の整備状況と整備すべき点

■ 3. 支援の方向性（短期・中期・長期）
　（1）短期目標（30日以内）：具体的な達成状態を記述
　（2）中期目標（3〜6ヶ月）：退院後の生活安定に向けた目標
　（3）長期目標（1年後）：地域生活の定着・自立に向けたビジョン

■ 4. PSWの倫理的判断事項
　→ このケースで生じうる倫理的ジレンマ
　→ 精神保健福祉士の価値観に基づいた判断の方向性

■ 5. 要確認事項と情報収集プラン
　→ 誰から・どのような方法で情報収集するか

■ 6. スーパーバイズコメント
　→ このアセスメントから見える支援者の視点の偏りや見落としのリスク
　→ このケースで磨くべき実践知`;
}

// ===== 長期療養アセスメント専用プロンプトジェネレーター =====

import { LONG_TERM_SCORED_ITEMS, LONG_TERM_ITEMS_BY_CATEGORY, getLongTermJudgment, LONG_TERM_MAX_SCORE } from '../../data/longTermMasterData';

function getLtCategoryText(category: string, evaluations: Evals): string {
  const entries = Object.values(evaluations).filter(e => e.category === category);
  if (entries.length === 0) return '未回答';
  return entries.map(e => `${e.item}：${e.selectedValue}`).join('　');
}

export function generateLongTermSignalPrompt(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getLongTermJudgment(totalScore);
  const pct = Math.round((totalScore / LONG_TERM_MAX_SCORE) * 100);
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : 'N/A';
  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  const age = evaluations['lt_age']?.selectedValue ?? 'N/A';
  const gender = evaluations['lt_gender']?.selectedValue ?? 'N/A';
  const mainDisease = evaluations['lt_main_disease']?.selectedValue ?? 'N/A';
  const period = evaluations['lt_hospitalization_period']?.selectedValue ?? 'N/A';
  const complication = evaluations['lt_complication']?.selectedValue ?? 'N/A';

  const getCatScore = (cat: string) =>
    Object.values(evaluations).filter(e => e.category === cat).reduce((s, e) => s + e.score, 0);

  const priorityIssues = getPriorityIssues(evaluations, LONG_TERM_SCORED_ITEMS);
  const strengths = getStrengths(evaluations, LONG_TERM_SCORED_ITEMS);
  const priorityCategories = getPriorityCategories(evaluations, LONG_TERM_ITEMS_BY_CATEGORY);

  const nurseUnderstandingScore = getCatScore('看護師の患者理解度');

  const categoryLines = ['精神症状の安定性', '生活機能', '対人関係', '身体状態', '看護師の患者理解度', '地域移行の可能性']
    .map(cat => `${cat}: ${getLtCategoryText(cat, evaluations)}`)
    .join('\n');

  return `# 長期療養アセスメント SIGNAL

あなたは精神科看護の臨床支援AIです。
以下のアセスメントデータを分析し、簡潔なサマリーを作成してください。

## 入力データ

【属性】
年齢: ${age}　性別: ${gender}　主疾患: ${mainDisease}
入院期間: ${period}　合併症・医療ケア: ${complication}

【スコア】
合計点: ${totalScore} / ${LONG_TERM_MAX_SCORE}点（${pct}%）
判定コメント: ${judgment.text}
優先対応課題（0点項目）: ${priorityIssues}
支援の土台（最高点項目）: ${strengths}
重点支援領域（低得点カテゴリ）: ${priorityCategories}
看護師の患者理解度スコア: ${nurseUnderstandingScore}点
要確認項目（不明）: ${unknownText}
${noteText !== 'N/A' ? `備考: ${noteText}` : ''}

【カテゴリ別評価】
${categoryLines}

## 出力形式（箇条書き中心・A4一枚以内）

### 現状の要点
・最も注目すべき状態（3点以内）

### 成り行き予測
・短期リスク（1〜2点）
・中長期の方向性（1〜2点）

### 優先ケア
・最優先事項（2点以内）
・継続モニタリング項目（2点以内）

### 看護師への一言
・患者理解を深めるための視点（1点）

## 注意
・簡潔に。各項目2点以内で記述
・断定を避け「〜の可能性」を使うこと
・長期入院患者への敬意を忘れないこと
・看護師の理解度スコアを重要な根拠とすること`;
}

export function generateLongTermBriefPrompt(
  evaluations: Evals,
  totalScore: number,
  unknownItems: { item: string }[],
  notes: string[]
): string {
  const judgment = getLongTermJudgment(totalScore);
  const pct = Math.round((totalScore / LONG_TERM_MAX_SCORE) * 100);
  const unknownText = unknownItems.length > 0 ? unknownItems.map(e => e.item).join('、') : 'N/A';
  const noteText = notes.filter(n => n.trim()).map((n, i) => `特記事項${'①②③④⑤'[i]}：${n.trim()}`).join('　') || 'N/A';

  const age = evaluations['lt_age']?.selectedValue ?? 'N/A';
  const gender = evaluations['lt_gender']?.selectedValue ?? 'N/A';
  const mainDisease = evaluations['lt_main_disease']?.selectedValue ?? 'N/A';
  const period = evaluations['lt_hospitalization_period']?.selectedValue ?? 'N/A';
  const complication = evaluations['lt_complication']?.selectedValue ?? 'N/A';

  const getCatScore = (cat: string) =>
    Object.values(evaluations).filter(e => e.category === cat).reduce((s, e) => s + e.score, 0);

  const psyScore      = getCatScore('精神症状の安定性');
  const lifeScore     = getCatScore('生活機能');
  const relationScore = getCatScore('対人関係');
  const bodyScore     = getCatScore('身体状態');
  const nurseScore    = getCatScore('看護師の患者理解度');
  const transScore    = getCatScore('地域移行の可能性');

  const priorityIssues = getPriorityIssues(evaluations, LONG_TERM_SCORED_ITEMS);
  const strengths = getStrengths(evaluations, LONG_TERM_SCORED_ITEMS);
  const priorityCategories = getPriorityCategories(evaluations, LONG_TERM_ITEMS_BY_CATEGORY);

  const categoryLines = ['精神症状の安定性', '生活機能', '対人関係', '身体状態', '看護師の患者理解度', '地域移行の可能性']
    .map(cat => `${cat}: ${getLtCategoryText(cat, evaluations)}`)
    .join('\n');

  return `# 長期療養アセスメント BRIEF

あなたは30年以上の精神科看護の知識を持つ臨床支援AIです。
入力されたアセスメントデータをもとに、個別看護計画の立案を支援する
詳細分析レポートを作成してください。

## 入力データ

【属性】
年齢: ${age}　性別: ${gender}　主疾患: ${mainDisease}
入院期間: ${period}　合併症・医療ケア: ${complication}

【スコア】
合計点: ${totalScore} / ${LONG_TERM_MAX_SCORE}点（${pct}%）
判定コメント: ${judgment.text}

カテゴリ別:
  精神症状の安定性: ${psyScore}点
  生活機能: ${lifeScore}点
  対人関係: ${relationScore}点
  身体状態: ${bodyScore}点
  看護師の患者理解度: ${nurseScore}点
  地域移行の可能性: ${transScore}点

優先対応課題（0点項目）: ${priorityIssues}
支援の土台（最高点項目）: ${strengths}
重点支援領域（低得点カテゴリ）: ${priorityCategories}
要確認項目（不明）: ${unknownText}
${noteText !== 'N/A' ? `備考: ${noteText}` : ''}

【カテゴリ別評価】
${categoryLines}

## 出力形式

### 1. 患者の現状サマリー
・属性・入院期間の概要
・各カテゴリのスコアと状態の要約
・特に注目すべき点（高得点・低得点項目）
・看護師の患者理解度の現状評価

### 2. 今後の成り行き予測

【短期（3ヶ月以内）】
・症状・生活機能の変化予測
・注意すべきリスク

【中期（3ヶ月〜1年）】
・状態の安定性・変化の方向性
・看護介入による改善可能性

【長期（1年以上）】
・地域移行の現実的可能性
・長期療養継続の場合の生活像

### 3. 優先すべき看護ケア

【最優先（今すぐ対応が必要）】
・具体的なケア内容・根拠

【重点支援（1〜3ヶ月以内に強化）】
・具体的なケア内容・根拠

【継続支援（現状維持・モニタリング）】
・具体的なケア内容・根拠

### 4. 看護師への提言
・患者理解をさらに深めるための視点
・チームで共有すべき情報
・個別看護計画に盛り込むべきポイント

## 出力上の注意
・断定的な表現を避け「〜と考えられる」「〜の可能性がある」を使うこと
・30年以上の長期入院患者への敬意を忘れないこと
・スコアだけでなく看護師の理解度を重要な根拠として使うこと
・地域移行が困難な場合も、その患者らしい生活の質向上を目標とすること`;
}
