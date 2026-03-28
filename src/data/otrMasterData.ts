export const OTR_SCORE_LABELS: Record<number, string> = {
  4: '問題なし',
  3: '少しの助言で可能',
  2: '繰り返し指導が必要',
  1: '常時指導が必要',
  0: '不明・評価不能',
};

export interface OtrItem {
  key: string;
  label: string;
}

export interface OtrCategory {
  key: string;
  label: string;
  color: string;
  items: OtrItem[];
}

export const OTR_CATEGORIES: OtrCategory[] = [
  {
    key: 'cognitive',
    label: '認知・遂行的側面',
    color: 'var(--accent-cyan)',
    items: [
      { key: 'instruction_understanding', label: '指示の理解' },
      { key: 'concentration', label: '集中・持続' },
      { key: 'process_understanding', label: '工程・結果の理解' },
      { key: 'planning', label: '段取り' },
      { key: 'accuracy', label: '正確さ・丁寧さ' },
      { key: 'work_speed', label: '作業速度' },
      { key: 'problem_handling', label: '問題対処' },
      { key: 'change_handling', label: '変更に対する対処' },
    ],
  },
  {
    key: 'physical',
    label: '身体的側面',
    color: 'var(--accent-orange)',
    items: [
      { key: 'physical_endurance', label: '身体的耐性' },
      { key: 'motor_coordination', label: '目的動作の協応性' },
    ],
  },
  {
    key: 'psychological',
    label: '心理的側面',
    color: 'var(--accent-purple)',
    items: [
      { key: 'stress_tolerance', label: 'ストレス耐性' },
      { key: 'emotional_control', label: '感情のコントロール' },
      { key: 'activity_interest', label: '活動の興味関心' },
      { key: 'motivation', label: '意思・意欲' },
    ],
  },
  {
    key: 'social',
    label: '集団関係',
    color: 'var(--accent-yellow)',
    items: [
      { key: 'participation', label: '参加・交流' },
      { key: 'consideration', label: '基本的配慮' },
      { key: 'expression', label: '意思表示' },
      { key: 'cooperation', label: '協調性' },
    ],
  },
];

export interface OtrBasicInfo {
  age: string;
  gender: '男性' | '女性' | 'その他' | '';
  mainDiagnosis: string;
  chiefComplaint: string;
  adlStatus: string[]; // 5要素の配列
}

export type OtrScores = Record<string, number>;

export interface OtrAssessment {
  id: string;
  savedAt: number;
  basicInfo: OtrBasicInfo;
  scores: OtrScores;
}

export function calcOtrTotals(scores: OtrScores) {
  let total = 0;
  let maxPossible = 0;
  let unknownCount = 0;
  OTR_CATEGORIES.forEach(cat =>
    cat.items.forEach(item => {
      const s = scores[item.key];
      if (s === undefined || s === null) return;
      if (s === 0) unknownCount++;
      else { total += s; maxPossible += 4; }
    })
  );
  return { total, maxPossible, unknownCount };
}

export function calcOtrCategoryTotals(cat: OtrCategory, scores: OtrScores) {
  let catTotal = 0;
  let catMax = 0;
  let catUnknown = 0;
  cat.items.forEach(item => {
    const s = scores[item.key];
    if (s === undefined || s === null) return;
    if (s === 0) catUnknown++;
    else { catTotal += s; catMax += 4; }
  });
  return { catTotal, catMax, catUnknown };
}

function formatItems(cat: OtrCategory, scores: OtrScores): string {
  return cat.items.map(item => {
    const s = scores[item.key];
    if (s === undefined || s === null) return `・${item.label}：未評価`;
    if (s === 0) return `・${item.label}：不明・評価不能`;
    return `・${item.label}：${OTR_SCORE_LABELS[s]}（${s}点）`;
  }).join('\n');
}

export function generateOtrSignalPrompt(basicInfo: OtrBasicInfo, scores: OtrScores): string {
  const { total, maxPossible, unknownCount } = calcOtrTotals(scores);
  const [cog, phy, psy, soc] = OTR_CATEGORIES.map(cat => formatItems(cat, scores));

  return `あなたは精神科作業療法の臨床支援AIです。
以下のOTRアセスメント結果を分析し、簡潔なサマリーを作成してください。
記載以外の事実は生成しない。欠落はN/Aと記す。

現場の多職種（医師・看護師・PSW）が読むことを前提に、
専門用語を使わず平易な日本語で記述すること。

【悪い例】構造化環境と段階的支援を通じて参加拡大を図る
【良い例】決まった流れの中で、少しずつ参加できる活動を増やす

【基本情報】
年齢：${basicInfo.age || 'N/A'}歳 / 性別：${basicInfo.gender || 'N/A'} / 主疾患：${basicInfo.mainDiagnosis || 'N/A'}

【主訴】
${basicInfo.chiefComplaint || 'N/A'}

【ADL・生活状況】
${Array.isArray(basicInfo.adlStatus) ? basicInfo.adlStatus.filter(s => s.trim()).join('\n') || 'N/A' : basicInfo.adlStatus || 'N/A'}

【OTRスコア】
合計：${total}点 / ${maxPossible}点（評価可能項目の最大点）
不明・評価不能：${unknownCount}項目

■ 認知・遂行的側面
${cog}

■ 身体的側面
${phy}

■ 心理的側面
${psy}

■ 集団関係
${soc}

【出力形式】箇条書き中心・A4一枚以内

0. アセスメントのまとめと解決すべき課題（200文字以内）
このアセスメント全体を総括し、現在の状態と最優先で解決すべき課題を簡潔にまとめる。

予想される目標（3つ）
主疾患・主訴・スコアプロフィールから導かれる作業療法目標を3つ挙げる。
各目標は「〜できる」の形で具体的に記述する。
→ さらに上記3つを「〜できる」の形で30文字程度の1文に集約する。

予想される方針（3つ）
上記目標を達成するための支援方針を3つ挙げる。
各方針は「〜を通じて〜を図る」等の具体的なアプローチで記述する。
→ さらに上記3つを「〜を通じて〜を図る」の形で30文字程度の1文に集約する。

1. 全体像（1文）
強みと最大の課題を含めて総括する。

2. 強み（3点以上の項目）
支援計画の足場として活用できる領域を列挙する。

3. 優先支援領域（1〜2点の項目）
各項目について「現状 → 支援の方向性」を1行で記述する。

4. 適合する作業活動（2〜3点）
現在のスコアに合った活動の種類・条件を端的に示す。

5. 多職種への共有事項（2〜3点）
医師・看護師・PSWに伝えるべき情報を簡潔に列挙する。

6. 再評価が必要な項目
不明項目がある場合のみ記載。なければ省略。

※本出力は担当OTの臨床判断を補助するものです。`;
}

export function generateOtrBriefPrompt(basicInfo: OtrBasicInfo, scores: OtrScores): string {
  const { total, maxPossible, unknownCount } = calcOtrTotals(scores);
  const [cog, phy, psy, soc] = OTR_CATEGORIES.map(cat => formatItems(cat, scores));

  return `あなたは精神科作業療法の支援計画立案を補助するAIです。
以下のOTRアセスメント結果をもとに、作業療法士の臨床判断を支援する
詳細な構造化分析を提供してください。
記載以外の事実は生成しない。欠落はN/Aと記す。

現場の多職種（医師・看護師・PSW）が読むことを前提に、
専門用語を使わず平易な日本語で記述すること。

【悪い例】構造化環境と段階的支援を通じて参加拡大を図る
【良い例】決まった流れの中で、少しずつ参加できる活動を増やす

【基本情報】
年齢：${basicInfo.age || 'N/A'}歳 / 性別：${basicInfo.gender || 'N/A'} / 主疾患：${basicInfo.mainDiagnosis || 'N/A'}

【主訴】
${basicInfo.chiefComplaint || 'N/A'}

【ADL・生活状況】
${Array.isArray(basicInfo.adlStatus) ? basicInfo.adlStatus.filter(s => s.trim()).join('\n') || 'N/A' : basicInfo.adlStatus || 'N/A'}

【OTRスコア】
合計：${total}点 / ${maxPossible}点（評価可能項目の最大点）
不明・評価不能：${unknownCount}項目

■ 認知・遂行的側面
${cog}

■ 身体的側面
${phy}

■ 心理的側面
${psy}

■ 集団関係
${soc}

以上の情報をもとに、下記の形式で回答してください。

### 0. アセスメントのまとめと解決すべき課題（200文字以内）
このアセスメント全体を総括し、現在の状態と最優先で解決すべき課題を簡潔にまとめる。

**予想される目標（3つ）**
主疾患・主訴・スコアプロフィールから導かれる作業療法目標を3つ挙げる。
各目標は「〜できる」の形で具体的に記述する。
→ さらに上記3つを「〜できる」の形で30文字程度の1文に集約する。

**予想される方針（3つ）**
上記目標を達成するための支援方針を3つ挙げる。
各方針は「〜を通じて〜を図る」等の具体的なアプローチで記述する。
→ さらに上記3つを「〜を通じて〜を図る」の形で30文字程度の1文に集約する。

### 1. 全体像サマリー（3文以内）
1文目：患者の基本属性・主疾患を含めた現状の総括。
2文目：最大の強みと最大の課題を対比。
3文目：作業療法の介入方向性と現在のフェーズ。

### 2. 強みの整理
スコア3〜4の項目を列挙し、支援計画で活用できる資源として記述する。
各項目について「なぜ強みと判断したか」の根拠を1文で付記する。

### 3. 優先的支援領域
スコア1〜2の項目について、臨床的優先度順に整理する。
各項目について記述する：
- 現在の状態
- 想定される背景・要因
- 具体的な支援アプローチ

### 4. 作業活動の適合性アセスメント
現在のスコアプロフィールに適合する作業活動の種類と条件を提案する。
以下の軸で検討すること：
- 個別 vs 集団
- 構造化の程度（高・中・低）
- 身体的負荷
- 推奨セッション時間・頻度

### 5. 目標設定の方向性
主疾患・主訴・ADL状況を考慮した上で記述する。
短期目標（〜1ヶ月）：達成可能な具体的行動目標。
中期目標（〜3ヶ月）：機能改善・社会参加に向けた方向性。

### 6. 多職種連携への情報提供
医師・看護師・PSWそれぞれに共有すべき情報を分けて記述する。
一般論ではなく、このスコアプロフィールから導かれる具体的内容にすること。

### 7. 再評価の視点
不明・評価不能項目がある場合のみ記載。
各不明項目について「再評価のタイミング・観察ポイント・評価方法」を提示する。
不明項目が0件の場合は省略。

※本分析は作業療法士の臨床判断を補助するものです。最終的な支援計画の決定は担当OTが行ってください。`;
}
