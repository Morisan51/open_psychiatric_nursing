// ojpp 退院支援詳細アセスメント — データ定義
// スペック: ojpp_discharge_assessment_spec.md

// ===== Interfaces =====

export interface DetailedOption {
  value: string;
  label: string;
  score: number;
  isUnknown?: boolean;
}

export interface DetailedItem {
  key: string;
  category: string;
  branchKey: string | null; // null = 全分岐共通
  sectionTitle?: string;
  item: string;
  hint?: string;
  placeholder: string;
  alertType?: 'warning' | 'info';
  alertText?: string;
  options: DetailedOption[];
}

export interface CategoryDef {
  name: string;
  color: string;
  branchAxis: string;
  branches: string[];
}

// ===== DETAILED_CATEGORIES =====

export const DETAILED_CATEGORIES: CategoryDef[] = [
  {
    name: '患者の意向',
    color: 'var(--accent-purple)',
    branchAxis: '意向表明の状態',
    branches: [
      '退院を希望している',
      '退院を希望していない',
      '意向が揺れている',
      '意向が表明できない・抑圧',
      '意向と現実が大きく乖離',
    ],
  },
  {
    name: '生活能力',
    color: 'var(--accent-blue)',
    branchAxis: '主たる課題領域',
    branches: [
      'セルフケア・身体管理',
      '家事・IADL',
      '生活リズム・時間管理',
      '対人・社会生活',
      '複合的に低下',
    ],
  },
  {
    name: '家族・キーパーソン',
    color: 'var(--accent-pink)',
    branchAxis: 'キーパーソンの種別',
    branches: [
      '親（父・母）',
      '配偶者・パートナー',
      '子',
      '兄弟姉妹',
      '友人・知人・支援者',
      '不在・なし',
    ],
  },
  {
    name: '居住環境',
    color: 'var(--accent-teal)',
    branchAxis: '居住形態',
    branches: [
      '単身',
      '家族同居',
      'グループホーム',
      '施設入所',
      '未定',
    ],
  },
  {
    name: '医療継続',
    color: 'var(--accent-cyan)',
    branchAxis: '退院後の主たる医療継続の形態',
    branches: [
      '外来通院継続',
      '他院・他科への転院',
      '訪問看護中心',
      'ACT・集中支援',
      '未確定',
    ],
  },
  {
    name: '経済状況',
    color: 'var(--accent-orange)',
    branchAxis: '主たる収入源',
    branches: [
      '障害年金',
      '生活保護',
      '就労収入',
      '家族による経済的支援',
      '複合（年金＋就労等）',
      '収入なし・未確定',
    ],
  },
  {
    name: '社会資源',
    color: 'var(--accent-green)',
    branchAxis: '導入予定の主たる社会資源の種別',
    branches: [
      '訪問系',
      '通所系',
      '相談支援',
      'インフォーマル支援',
      '複合利用',
      '未接続・未導入',
    ],
  },
];

// ===== 標準4択 (STD) =====

const STD: DetailedOption[] = [
  { value: 'ok',      label: '可',        score: 3 },
  { value: 'cond',    label: '条件付き可', score: 2 },
  { value: 'ng',      label: '不可',       score: 0 },
  { value: 'unknown', label: '不明',       score: 0, isUnknown: true },
];

// カスタム4択ヘルパー（最良=3 / 中間=2 / 最悪=0 / 不明=0）
function opt4(best: string, mid: string, worst: string): DetailedOption[] {
  return [
    { value: 'ok',      label: best,  score: 3 },
    { value: 'cond',    label: mid,   score: 2 },
    { value: 'ng',      label: worst, score: 0 },
    { value: 'unknown', label: '不明', score: 0, isUnknown: true },
  ];
}

// ===== カテゴリ 1：患者の意向 =====

const CAT = '患者の意向';

const PATIENT_WILL_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'pw_c1',
    category: CAT,
    branchKey: null,
    item: '今表明されている意向は「本音」か',
    hint: '権威勾配・同調圧力・場の空気によって「言わされている」意向ではないかを評価する。これがこのカテゴリ全体の核心',
    placeholder: '「先生がそう言うから」「家族がそう言うから」という同調。一対一の場と集団の場で意向が変わるかなど',
    options: opt4(
      '本音と一致していると判断できる',
      '一部本音・一部遠慮が混在',
      '表明された意向と本音のズレが疑われる',
    ),
  },
  {
    key: 'pw_c2',
    category: CAT,
    branchKey: null,
    item: '患者が意向を表明できる場と関係が確保されているか',
    hint: '医師・家族・看護師が同席する場では本音を言えない患者が多い。一対一・信頼できる支援者との場が設けられているか',
    placeholder: '誰と・どのような場で・どのくらいの頻度で患者の意向を聴取しているか。面会同席者の構成も記載',
    options: STD,
  },
  {
    key: 'pw_c3',
    category: CAT,
    branchKey: null,
    item: '患者・家族・医療チームの意向の一致度',
    hint: '三者が異なる意向を持っている場合、誰の意向が優先されているかを意識する。患者の意向が最初に来ているか',
    placeholder: '誰と誰の意向がどのように違うか。カンファレンスで患者の声がどのように扱われているかも記載',
    options: opt4(
      '三者がおおむね一致',
      '部分的に相違あり',
      '明確に不一致・患者の意向が周縁化されている',
    ),
  },
  {
    key: 'pw_c4',
    category: CAT,
    branchKey: null,
    item: '患者が「自分の人生を選んでいる」と感じているか',
    hint: '意向の内容ではなく、意向を持つこと自体への主体性を評価する。これは回復の核心と直結する',
    placeholder: '患者が使う言葉の主語は「私」か「先生」「家族」か。自己決定の経験が奪われてきた歴史がないかも評価する',
    options: opt4(
      '感じている',
      '部分的に感じている',
      '決めてもらっている・どうでもいい・従うしかない',
    ),
  },

  // ---- 分岐：退院を希望している ----
  {
    key: 'pw_yes_1',
    category: CAT,
    branchKey: '退院を希望している',
    sectionTitle: 'A：退院希望の内実を掘り下げる',
    item: '退院を希望する理由・動機',
    hint: '回復への意欲なのか・病棟環境への嫌悪なのか・家族への気遣いなのか。動機によって支援の方向が変わる',
    placeholder: '「家に帰りたい」「仕事に戻りたい」「ここが嫌だ」「家族に迷惑をかけたくない」など動機の内容を患者の言葉で記載',
    alertType: 'info',
    alertText: '「退院したい」という意向の裏にある動機・期待・恐れを評価する。「退院したい」は出発点であって、それ自体がアセスメントの終点ではない。',
    options: opt4(
      '回復・生活再建への意欲',
      '複合的な動機',
      '病棟からの逃避・周囲への気遣い・衝動的',
    ),
  },
  {
    key: 'pw_yes_2',
    category: CAT,
    branchKey: '退院を希望している',
    item: '退院後の生活への期待と現実の一致度',
    hint: '退院への希望が現実的な根拠に基づいているか・楽観的すぎる期待は退院後の失望につながる',
    placeholder: '「退院したらすぐ働く」「薬も必要ない」など過度な楽観の有無。修正を試みた場合の反応も記載',
    options: opt4(
      '現実的な根拠に基づいている',
      '一部楽観的だが修正可能',
      '著しく楽観的・現実から乖離している',
    ),
  },
  {
    key: 'pw_yes_3',
    category: CAT,
    branchKey: '退院を希望している',
    item: '退院への不安・恐れの存在',
    hint: '希望と不安は共存する。「退院したい」と言いながら抱えている恐れを安全に語れているか',
    placeholder: '患者が語る不安の内容。「不安は全くない」という言葉は否認のサインである可能性も念頭に置く',
    options: opt4(
      '不安を語れている・対処可能な範囲',
      '不安はあるが語りにくそう',
      '不安を語れない・または不安が全くないと言う',
    ),
  },

  // ---- 分岐：退院を希望していない ----
  {
    key: 'pw_no_1',
    category: CAT,
    branchKey: '退院を希望していない',
    sectionTitle: 'A：退院を希望しない理由の構造',
    item: '退院を希望しない理由',
    hint: '恐れなのか・喪失なのか・病棟への依存なのか・合理的判断なのか。理由によって全く異なるアプローチが必要',
    placeholder: '「外が怖い」「一人では無理」「家族に会いたくない」「病院が安心」など理由を患者の言葉で具体的に記載',
    alertType: 'warning',
    alertText: '「退院したくない」は意向として尊重されるべきだが、同時にその背景にある恐れ・喪失・依存を評価する必要がある。',
    options: opt4(
      '具体的な理由を語れている',
      '漠然とした不安・言語化が難しい',
      '理由を語れない・ここにいたいだけ',
    ),
  },
  {
    key: 'pw_no_2',
    category: CAT,
    branchKey: '退院を希望していない',
    item: '入院の長期化が患者にもたらしている影響',
    hint: '長期入院による生活能力の低下・社会との断絶・「病院が生活の場」になっていないかを評価する',
    placeholder: '入院期間・病棟以外の生活経験の喪失・「病院の外の生活」を想像できているかなど',
    options: opt4(
      '影響は限定的',
      '一部影響あり・本人も認識',
      '施設化・病院依存が深刻',
    ),
  },
  {
    key: 'pw_no_3',
    category: CAT,
    branchKey: '退院を希望していない',
    item: '「退院したくない」意向への医療チームの向き合い方',
    hint: '患者の意向を無視して退院を進めることも・永続的に入院を続けることも、どちらも支援ではない',
    placeholder: '外泊・試験外出など段階的なアプローチの有無。患者の恐れに対してどう応答しているか',
    options: opt4(
      '意向を尊重しながら段階的アプローチができている',
      '試みているが難航',
      '意向を無視した退院推進・または意向に従った放置',
    ),
  },

  // ---- 分岐：意向が揺れている ----
  {
    key: 'pw_waver_1',
    category: CAT,
    branchKey: '意向が揺れている',
    sectionTitle: 'A：揺れの構造を評価する',
    item: '何と何が葛藤しているか',
    placeholder: '「退院したいけど怖い」「帰りたいけど家族に会いたくない」など葛藤の両側を患者の言葉で記載',
    alertType: 'info',
    alertText: '意向の揺れは「優柔不断」ではなく「複数の現実が葛藤している」状態。何と何が葛藤しているかを特定する。',
    options: opt4(
      '葛藤の構造が言語化されている',
      'おぼろげながら把握されている',
      '葛藤の構造が不明・わからないだけ',
    ),
  },
  {
    key: 'pw_waver_2',
    category: CAT,
    branchKey: '意向が揺れている',
    item: '意向の揺れが生じるタイミング・文脈',
    hint: '誰といる時・どんな話題の後に・どんな状況で意向が変わるかを把握する',
    placeholder: '「家族が来た後は退院したくないと言う」「外出後は帰りたいと言う」などパターンを記載',
    options: opt4(
      'パターンが把握されている',
      'おおよそ把握',
      'パターン不明・予測不能',
    ),
  },
  {
    key: 'pw_waver_3',
    category: CAT,
    branchKey: '意向が揺れている',
    item: '揺れている状態を患者自身はどう体験しているか',
    placeholder: '「自分でも何がしたいかわからない」という言葉への患者の感情的反応を記載',
    options: opt4(
      '揺れを自然なこととして受け止めている',
      '揺れに戸惑いはあるが対話できる',
      '強い苦痛・自己批判・決めなければという強迫',
    ),
  },

  // ---- 分岐：意向が表明できない・抑圧 ----
  {
    key: 'pw_suppress_1',
    category: CAT,
    branchKey: '意向が表明できない・抑圧',
    sectionTitle: 'A：表明困難・抑圧の構造',
    item: '表明を妨げている要因の所在',
    hint: '権威勾配なのか・認知機能なのか・症状なのか・過去のトラウマなのか・文化的背景なのか',
    placeholder: '「怒られる気がする」「言っても無駄」「先生が決めることだから」「何も考えられない」など要因を記載',
    alertType: 'warning',
    alertText: '意向を表明できない状態は、意向がないのではない。表明を妨げている構造が何かを特定することがアセスメントの目的になる。',
    options: opt4(
      '要因が特定されている',
      'おぼろげに把握',
      '要因が特定できていない',
    ),
  },
  {
    key: 'pw_suppress_2',
    category: CAT,
    branchKey: '意向が表明できない・抑圧',
    item: '非言語・間接的な意向表明の有無',
    hint: '言葉では表明できなくても・行動・表情・沈黙・拒否が意向を示していることがある',
    placeholder: '外出時の表情・特定の話題での沈黙・特定の場所や人への反応など非言語の意向を記載',
    options: opt4(
      '非言語の意向表明が読み取れる',
      '一部読み取れる',
      '読み取れない・完全な沈黙・無反応',
    ),
  },
  {
    key: 'pw_suppress_3',
    category: CAT,
    branchKey: '意向が表明できない・抑圧',
    item: '意向を引き出すための工夫の有無',
    placeholder: 'どのような工夫を試みたか・誰が・どのような場で・どのような問いかけをしているか',
    options: opt4(
      '積極的な工夫がなされている',
      '一部試みている',
      '工夫されていない・本人が言わないからで終わっている',
    ),
  },
  {
    key: 'pw_suppress_4',
    category: CAT,
    branchKey: '意向が表明できない・抑圧',
    item: '代替的意思決定者との関係と患者の最善の利益',
    placeholder: '誰が代替的意思決定者か・その人物の意向が患者の利益と一致しているかの評価',
    options: opt4(
      '患者の最善の利益に基づく適切な代替決定',
      '一部問題あり',
      '代替決定者の意向が患者の利益より優先されている',
    ),
  },

  // ---- 分岐：意向と現実が大きく乖離 ----
  {
    key: 'pw_gap_1',
    category: CAT,
    branchKey: '意向と現実が大きく乖離',
    sectionTitle: 'A：乖離の構造と対話の可能性',
    item: '乖離の内容と大きさ',
    placeholder: '患者の意向の内容・現実の状況・その差異を具体的に記載。「なぜそう思うか」の背景も記述する',
    alertType: 'warning',
    alertText: '乖離を「問題」として患者を修正しようとする前に、患者の意向が生まれた文脈と意味を理解することが先になる。',
    options: opt4(
      '乖離は小さく修正可能',
      '一定の乖離があるが対話できる',
      '乖離が大きく・修正の試みに強い抵抗',
    ),
  },
  {
    key: 'pw_gap_2',
    category: CAT,
    branchKey: '意向と現実が大きく乖離',
    item: '乖離した意向が生まれた文脈・意味',
    hint: '現実から乖離した意向には必ず意味がある。その意味を理解せずに「修正」しようとしても失敗する',
    placeholder: '「退院してすぐ働く」という意向の背後にある「早く普通に戻りたい」という切実な願いなど、意向の深層を記載',
    options: opt4(
      '文脈・意味が理解されている',
      '一部理解されている',
      '理解されていない・なぜそう思うかが問われていない',
    ),
  },
  {
    key: 'pw_gap_3',
    category: CAT,
    branchKey: '意向と現実が大きく乖離',
    item: '乖離について患者と対話できているか',
    placeholder: '誰が・どのような関係性の中で・どのような方法で対話を試みているか。対話の際の患者の反応も記載',
    options: STD,
  },
  {
    key: 'pw_gap_4',
    category: CAT,
    branchKey: '意向と現実が大きく乖離',
    item: '乖離の中にある「叶えられる部分」',
    hint: '乖離した意向を全否定するのではなく、その中に叶えられる要素を探すことが対話の入口になる',
    placeholder: '「今すぐ働く」は無理でも「働くための準備をする」は可能かもしれない。意向の中の実現可能な核心を記載',
    options: opt4(
      '叶えられる部分が特定されている',
      '一部見えてきている',
      '全否定・または全肯定しか選択肢がない状態',
    ),
  },
];

// ===== カテゴリ 2：生活能力 =====

const CAT2 = '生活能力';

const LIVING_ABILITY_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'la_c1',
    category: CAT2,
    branchKey: null,
    item: '入院前の生活能力と現在の比較',
    hint: '入院による能力低下なのか・入院前からの課題なのかで支援の方向が変わる',
    placeholder: '入院前の生活状況・一人暮らしの経験の有無・入院期間と能力変化の関係',
    options: opt4('入院前と同等以上', 'やや低下', '著しく低下・入院前から課題あり'),
  },
  {
    key: 'la_c2',
    category: CAT2,
    branchKey: null,
    item: '能力低下を患者はどう意味づけているか',
    hint: '「できない自分」をどう体験しているかが支援の受け入れに直結する',
    placeholder: '「前はできていたのに」という喪失感・「これくらいできる」という過信・支援を恥と感じているかなど',
    options: opt4('現実的に受け止めている', '複合的・揺れている', '強い羞恥・否認・過小評価または過大評価'),
  },
  {
    key: 'la_c3',
    category: CAT2,
    branchKey: null,
    item: '症状の波による能力変動の幅',
    hint: '安定期に「できる」ことが、症状悪化時には「できなくなる」という変動を必ず評価する',
    placeholder: '症状が悪化した時に何ができなくなるか・その頻度・回復にかかる時間',
    options: opt4('変動が小さい・安定している', '一定の変動あり', '変動が大きい・悪化時に著しく低下'),
  },
  {
    key: 'la_c4',
    category: CAT2,
    branchKey: null,
    item: '「できない時」に助けを求められるか',
    hint: '能力の問題より「助けを求める行動」が地域生活の継続を左右することが多い',
    placeholder: '誰になら助けを求められるか・求められない理由（プライド・遠慮・信頼の欠如）など',
    options: opt4('求められる', '条件次第・特定の相手なら可', '求められない・一人で抱え込む'),
  },

  // ---- 分岐：セルフケア・身体管理 ----
  {
    key: 'la_sc_1',
    category: CAT2,
    branchKey: 'セルフケア・身体管理',
    item: '整容・清潔保持（入浴・洗面・更衣）',
    hint: '可：自発的に・適切な頻度で実行できる ／ 条件付き可：声かけ・支援があれば可 ／ 不可：著しく困難・拒否',
    placeholder: '入浴頻度・清潔への関心・セルフネグレクトのリスク・陰性症状との関連',
    alertType: 'info',
    alertText: 'ADLの評価ではなく「その行為を患者が自分の生活の中で実行できるか」という視点で評価する。',
    options: STD,
  },
  {
    key: 'la_sc_2',
    category: CAT2,
    branchKey: 'セルフケア・身体管理',
    item: '食事摂取の自立度',
    placeholder: '食事の規則性・内容・調理の可否・食欲への症状の影響・体重変動',
    options: STD,
  },
  {
    key: 'la_sc_3',
    category: CAT2,
    branchKey: 'セルフケア・身体管理',
    item: '身体疾患・合併症の自己管理',
    hint: '精神科患者に多い身体合併症（糖尿病・高血圧等）の自己管理能力を評価する',
    placeholder: '合併症の種類・自己測定（血糖・血圧）の可否・食事制限の理解と実行・受診の継続',
    options: [
      { value: 'ok',      label: '可',            score: 3 },
      { value: 'cond',    label: '条件付き可',     score: 2 },
      { value: 'ng',      label: '不可',           score: 0 },
      { value: 'unknown', label: '不明・合併症なし', score: 0, isUnknown: true },
    ],
  },
  {
    key: 'la_sc_4',
    category: CAT2,
    branchKey: 'セルフケア・身体管理',
    item: 'セルフケア低下を患者はどう体験しているか',
    placeholder: '「風呂に入れていないのはわかっている」「別にいい」など患者自身の言葉で記載',
    options: opt4('課題として認識・改善意欲あり', '気にはなっているが動けない', '無関心・否認・羞恥による回避'),
  },

  // ---- 分岐：家事・IADL ----
  {
    key: 'la_iadl_1',
    category: CAT2,
    branchKey: '家事・IADL',
    item: '調理の自立度',
    hint: '可：単独で安全に調理できる ／ 条件付き可：簡単なものは可 ／ 不可：火の管理・段取りが困難',
    placeholder: '調理の複雑さ・火の管理・電子レンジのみか・代替手段（配食・弁当・外食）',
    alertType: 'info',
    alertText: '「できるか」ではなく「退院後の生活動線の中で継続して実行できるか」を評価する。病棟でできることと自宅でできることは異なる。',
    options: STD,
  },
  {
    key: 'la_iadl_2',
    category: CAT2,
    branchKey: '家事・IADL',
    item: '掃除・洗濯・片付けの自立度',
    placeholder: '入院前の住居の状態・陰性症状との関連・過去にゴミ屋敷・不衛生な状態になったことがあるか',
    options: STD,
  },
  {
    key: 'la_iadl_3',
    category: CAT2,
    branchKey: '家事・IADL',
    item: '買い物・食料調達の自立度',
    placeholder: '計画的な購買行動の可否・衝動買いのパターン・アクセス可能な店舗と患者の移動能力の適合',
    options: STD,
  },
  {
    key: 'la_iadl_4',
    category: CAT2,
    branchKey: '家事・IADL',
    item: '公共機関の利用・各種手続きの実行',
    placeholder: '役所・銀行・郵便局などの利用経験・書類記入の可否・対人場面での困難の有無',
    options: STD,
  },

  // ---- 分岐：生活リズム・時間管理 ----
  {
    key: 'la_rhythm_1',
    category: CAT2,
    branchKey: '生活リズム・時間管理',
    item: '睡眠・覚醒リズムの安定度',
    placeholder: '就寝・起床の時間帯・睡眠時間・昼夜逆転の有無・薬の影響・退院後の生活スケジュールとの適合',
    alertType: 'warning',
    alertText: '生活リズムの乱れは精神症状の増悪因子になりやすい。「規則正しくできるか」ではなく「その乱れが生活崩壊につながるか」を評価する。',
    options: STD,
  },
  {
    key: 'la_rhythm_2',
    category: CAT2,
    branchKey: '生活リズム・時間管理',
    item: '服薬時間の管理と生活リズムの一致',
    hint: '「毎朝8時に飲む」という指示が患者の実際の生活リズムと一致しているかを評価する',
    placeholder: '処方の服薬タイミングと患者の実際の起床・就寝時間のズレ。朝型か夜型か',
    options: opt4('一致している', '概ね一致・工夫で対応可能', '乖離している・飲み忘れリスク高'),
  },
  {
    key: 'la_rhythm_3',
    category: CAT2,
    branchKey: '生活リズム・時間管理',
    item: '通所・通院など「決まった予定」を守る力',
    placeholder: '入院中の面会・OT・通院外出での遵守状況・「気が向かない時」の行動パターン',
    options: STD,
  },
  {
    key: 'la_rhythm_4',
    category: CAT2,
    branchKey: '生活リズム・時間管理',
    item: '一日・一週間の過ごし方のイメージ',
    hint: '退院後の生活を時間単位で具体的に描けているかが現実的な生活設計の指標になる',
    placeholder: '「退院したら何をしますか」への回答の具体度。空白の時間が多い生活設計は再発リスクになりうる',
    options: opt4('具体的に描けている', '漠然としているが否定的でない', '描けない・何もすることがない・過度に楽観的'),
  },

  // ---- 分岐：対人・社会生活 ----
  {
    key: 'la_social_1',
    category: CAT2,
    branchKey: '対人・社会生活',
    item: '日常的な対人コミュニケーション',
    placeholder: 'コンビニでの会計・近隣への挨拶・電話対応など日常場面での対人行動の具体例',
    alertType: 'info',
    alertText: '病棟という閉じた環境での対人能力と、地域社会での対人能力は異なる。退院後の実際の生活場面を想定して評価する。',
    options: STD,
  },
  {
    key: 'la_social_2',
    category: CAT2,
    branchKey: '対人・社会生活',
    item: 'トラブル・困難場面への対処',
    placeholder: '過去の近隣トラブル・クレーム・対人場面での衝動行為・相談行動の有無',
    options: STD,
  },
  {
    key: 'la_social_3',
    category: CAT2,
    branchKey: '対人・社会生活',
    item: '孤立への耐性と孤独の体験',
    hint: '一人でいられるかと、孤独を苦痛に感じるかは別の問い。両方を評価する',
    placeholder: '一人でいる時間の過ごし方・孤独感が症状の引き金になるパターン',
    options: opt4('一人の時間を適切に過ごせる', '孤独感はあるが対処可能', '孤独に耐えられない・または完全な孤立を望む'),
  },
  {
    key: 'la_social_4',
    category: CAT2,
    branchKey: '対人・社会生活',
    item: '地域社会との接点・社会参加の状況',
    placeholder: '趣味・地域活動・就労・ボランティアなど社会との接点。「何もない」場合はそれ自体がリスク因子として記載',
    options: STD,
  },

  // ---- 分岐：複合的に低下 ----
  {
    key: 'la_multi_1',
    category: CAT2,
    branchKey: '複合的に低下',
    item: '生活崩壊の起点になりやすい最弱点',
    hint: '複数の課題がある中で「ここが崩れると全部崩れる」という連鎖の起点を特定する',
    placeholder: '例：「睡眠が乱れる→服薬を忘れる→症状が悪化→外出できなくなる→食事が取れなくなる」という連鎖の起点を記載',
    alertType: 'warning',
    alertText: '複数領域で低下している場合、各能力の「足し算」ではなく「どこが崩れると生活全体が崩壊するか」という連鎖を評価する。',
    options: opt4('特定できている', 'おおよそ把握', '特定できていない'),
  },
  {
    key: 'la_multi_2',
    category: CAT2,
    branchKey: '複合的に低下',
    item: '支援が集中すべき優先領域',
    hint: '全領域を同時に支援することは不可能。最も重要な領域はどこかを評価する',
    placeholder: '何を最初に安定させることで他の領域が連鎖的に改善するか。支援の序列を記載',
    options: opt4('優先領域が明確', '概ね把握', '不明確・支援が分散している'),
  },
  {
    key: 'la_multi_3',
    category: CAT2,
    branchKey: '複合的に低下',
    item: '患者自身が「できる」と感じている領域',
    hint: '複合的低下の中でも患者が自信を持てる領域を起点にすることが支援への動機づけになる',
    placeholder: '患者が「これはできる」と言うこと・支援者が観察している強みの領域を具体的に記載',
    options: opt4('明確にある', 'かろうじてある', '何もできないという全否定'),
  },
  {
    key: 'la_multi_4',
    category: CAT2,
    branchKey: '複合的に低下',
    item: '現在の支援量と低下の程度の適合',
    placeholder: '低下の程度と支援計画のギャップ。「これだけの支援では生活は成立しない」という判断も明記する',
    options: opt4('適合している', '一部不足', '明らかに不足・過少支援'),
  },
];

// ===== カテゴリ 3：家族・キーパーソン =====

const CAT3 = '家族・キーパーソン';

const FAMILY_KP_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'kp_c1',
    category: CAT3,
    branchKey: null,
    item: 'キーパーソンは明確に特定されているか',
    placeholder: 'キーパーソンの氏名・続柄・患者との関係性の概要',
    options: STD,
  },
  {
    key: 'kp_c2',
    category: CAT3,
    branchKey: null,
    item: 'キーパーソンの退院に対する意向',
    hint: '表明された意向と本音のズレを意識して評価する',
    placeholder: '「はい大丈夫です」の裏にある本音を記載。条件がある場合はその条件を具体的に',
    options: opt4('積極的に賛成', '条件付き賛成', '消極的・反対'),
  },
  {
    key: 'kp_c3',
    category: CAT3,
    branchKey: null,
    item: '患者とキーパーソンの意向は一致しているか',
    hint: '両者の意向のズレが退院後の破綻リスクの核心になることが多い',
    placeholder: '何についての意向が一致・不一致か。対話の機会が設けられているかも記載',
    options: opt4('一致', '部分的に相違', '明確に不一致'),
  },

  // ---- 分岐：親（父・母）----
  {
    key: 'kp_parent_1',
    category: CAT3,
    branchKey: '親（父・母）',
    item: '父・母それぞれの退院意向と役割分担',
    placeholder: '父の意向・母の意向を個別に記載。どちらが主たる支援者かも明記',
    alertType: 'warning',
    alertText: '「両親は退院希望」と括らない。父と母の意向・役割・感情は必ず個別に確認する。',
    options: STD,
  },
  {
    key: 'kp_parent_2',
    category: CAT3,
    branchKey: '親（父・母）',
    item: '親自身の高齢化・健康状態',
    hint: '「今はできる」が5年後も続くかを必ず検討する',
    placeholder: '年齢・疾患・介護認定の有無。「今はできる」が5年後も続くかを必ず検討',
    options: STD,
  },
  {
    key: 'kp_parent_3',
    category: CAT3,
    branchKey: '親（父・母）',
    item: '親の感情的疲弊・負担の程度',
    placeholder: '長期入院の経緯・再発の繰り返し・「もう限界」という言葉が出ているかなど',
    options: STD,
  },
  {
    key: 'kp_parent_4',
    category: CAT3,
    branchKey: '親（父・母）',
    item: '患者にとって親との関係が「安心」か「緊張」か',
    hint: '支援関係か支配関係かを評価する',
    placeholder: '過干渉・支配・暴力歴・ネグレクト歴・依存関係など関係の質を具体的に記載',
    options: opt4('安心', '複合的', '緊張・支配・回避'),
  },
  {
    key: 'kp_parent_5',
    category: CAT3,
    branchKey: '親（父・母）',
    item: '病気・入院に対する親の意味づけ',
    placeholder: '「怠けている」「根性がない」「恥ずかしい」などの発言・態度も記載',
    options: opt4('適切に理解', '部分的に理解', '誤解・否認・スティグマ'),
  },

  // ---- 分岐：配偶者・パートナー ----
  {
    key: 'kp_spouse_1',
    category: CAT3,
    branchKey: '配偶者・パートナー',
    item: '婚姻・パートナー関係の安定性',
    placeholder: '入院前後の関係変化・配偶者が面会に来ているか・言葉に出ていない疲弊など',
    options: opt4('安定', '揺らぎあり', '不安定・破綻リスク'),
  },
  {
    key: 'kp_spouse_2',
    category: CAT3,
    branchKey: '配偶者・パートナー',
    item: '配偶者の就労・生活状況',
    placeholder: '就労状況・子育て・介護との重なり・経済的状況など',
    options: STD,
  },
  {
    key: 'kp_spouse_3',
    category: CAT3,
    branchKey: '配偶者・パートナー',
    item: '共依存・役割固定のリスク',
    hint: '支援が患者の自立を阻む関係になっていないかを評価する',
    placeholder: '「私がいないとこの人はダメ」という関係性・患者の主体性が奪われていないかなど',
    options: opt4('リスク低', '一部あり', '共依存・役割固定が顕著'),
  },
  {
    key: 'kp_spouse_4',
    category: CAT3,
    branchKey: '配偶者・パートナー',
    item: '患者にとって配偶者が「安心」か「緊張」か',
    placeholder: 'DV歴・支配関係・患者が配偶者についてどう語るかを記載',
    options: opt4('安心', '複合的', '緊張・恐怖・回避'),
  },
  {
    key: 'kp_spouse_5',
    category: CAT3,
    branchKey: '配偶者・パートナー',
    item: '退院後の夫婦の生活像を双方が共有しているか',
    placeholder: '対話の機会が設けられているか。それぞれが描く生活像の差異を記載',
    options: opt4('共有されている', '部分的に共有', '共有されていない'),
  },

  // ---- 分岐：子 ----
  {
    key: 'kp_child_1',
    category: CAT3,
    branchKey: '子',
    item: '子の年齢・生活状況・支援余力',
    placeholder: '子の年齢・就労・自身の家族・居住地・患者との物理的距離など',
    alertType: 'warning',
    alertText: '子がキーパーソンになる場合、役割逆転（ヤングケアラー含む）が生じていないかを必ず評価する。',
    options: STD,
  },
  {
    key: 'kp_child_2',
    category: CAT3,
    branchKey: '子',
    item: '役割逆転・過剰負担の有無',
    placeholder: '子の生活・学業・就労への影響。子自身が「断れない」状態になっていないか',
    options: STD,
  },
  {
    key: 'kp_child_3',
    category: CAT3,
    branchKey: '子',
    item: '患者にとって子との関係の意味',
    hint: '「子に迷惑をかけたくない」という感情が退院を阻む場合がある',
    placeholder: '「子に心配させたくない」「迷惑をかけた」という言葉が出ているかなど',
    options: opt4('支えになっている', '複合的', '罪悪感・遠慮・回避'),
  },

  // ---- 分岐：兄弟姉妹 ----
  {
    key: 'kp_sibling_1',
    category: CAT3,
    branchKey: '兄弟姉妹',
    item: '兄弟姉妹の関与意向と実際の距離',
    placeholder: '居住地・面会頻度・連絡の頻度・疎遠になった経緯など',
    options: STD,
  },
  {
    key: 'kp_sibling_2',
    category: CAT3,
    branchKey: '兄弟姉妹',
    item: '兄弟姉妹間での役割分担・合意',
    placeholder: '誰が主たる支援者か・他の兄弟の関与度・負担の偏りなど',
    options: opt4('合意あり', '暗黙の了解', '合意なし・一人に集中'),
  },
  {
    key: 'kp_sibling_3',
    category: CAT3,
    branchKey: '兄弟姉妹',
    item: '患者と兄弟姉妹の関係の歴史的文脈',
    placeholder: '幼少期からの関係・過去のトラブル・長期入院による関係変化など',
    options: opt4('良好', '複合的', '葛藤・断絶の歴史'),
  },

  // ---- 分岐：友人・知人・支援者 ----
  {
    key: 'kp_friend_1',
    category: CAT3,
    branchKey: '友人・知人・支援者',
    item: '関係の安定性・継続性',
    placeholder: '関係の年数・接触頻度・関係が成立した経緯など',
    alertType: 'warning',
    alertText: '家族以外がキーパーソンの場合、関係の法的・制度的裏付けがないことを念頭に評価する。',
    options: opt4('安定・長期的', '関係は続いているが不安定', '不安定・流動的'),
  },
  {
    key: 'kp_friend_2',
    category: CAT3,
    branchKey: '友人・知人・支援者',
    item: '支援の限界と役割の明確さ',
    hint: '友人・知人には担えない支援がある。その限界が明確になっているかを評価する',
    placeholder: '何を担えて何を担えないか。患者側の過剰な期待・依存リスクなど',
    options: opt4('明確', '曖昧', '過剰な期待・役割の混乱'),
  },
  {
    key: 'kp_friend_3',
    category: CAT3,
    branchKey: '友人・知人・支援者',
    item: '専門的支援者（PSW・相談員等）との連携',
    placeholder: '関与している専門職・制度的支援との役割分担の明確さなど',
    options: STD,
  },

  // ---- 分岐：不在・なし ----
  {
    key: 'kp_absent_1',
    category: CAT3,
    branchKey: '不在・なし',
    item: '不在の理由・経緯',
    placeholder: '不在に至った経緯を時系列で記載。患者がその不在をどう意味づけているかも記載',
    alertType: 'warning',
    alertText: 'キーパーソン不在は状態の記述ではなく構造的リスク。「なぜ不在か」を必ず分析する。',
    options: opt4('死別・やむを得ない事情', '疎遠・長期断絶', '拒絶・関係破綻'),
  },
  {
    key: 'kp_absent_2',
    category: CAT3,
    branchKey: '不在・なし',
    item: '患者の孤立感・孤独の意味づけ',
    placeholder: '「一人でも大丈夫」なのか「誰もいない」という絶望なのかを区別して記載',
    options: opt4('受け入れている', '揺れている', '強い孤独感・絶望'),
  },
  {
    key: 'kp_absent_3',
    category: CAT3,
    branchKey: '不在・なし',
    item: '制度的キーパーソンの確保状況',
    placeholder: '成年後見人・PSW・地域包括・民生委員など関与している制度的支援者を記載',
    options: [
      { value: 'ok',      label: '可',    score: 3 },
      { value: 'cond',    label: '調整中', score: 2 },
      { value: 'ng',      label: '不可',   score: 0 },
      { value: 'unknown', label: '不明',   score: 0, isUnknown: true },
    ],
  },
  {
    key: 'kp_absent_4',
    category: CAT3,
    branchKey: '不在・なし',
    item: '緊急時の連絡・対応体制',
    placeholder: '緊急連絡先・訪問看護・ACTなど危機介入可能な体制の有無',
    options: STD,
  },
];
// ===== カテゴリ 4：居住環境 =====

const CAT4 = '居住環境';

const HOUSING_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'ho_c1',
    category: CAT4,
    branchKey: null,
    item: '退院先を「生活できる場所」とイメージできているか',
    hint: '可：具体的・現実的 ／ 条件付き可：漠然としているが否定的でない ／ 不可：イメージ不能・回避・否定',
    placeholder: '「帰ったら何をしますか」への回答の具体度・現実との乖離など',
    options: STD,
  },
  {
    key: 'ho_c2',
    category: CAT4,
    branchKey: null,
    item: '不安の具体的対象',
    hint: '可：具体化されており対処可能 ／ 条件付き可：漠然とした不安 ／ 不可：全体化・言語化不能',
    placeholder: '患者が語る不安の内容を具体的に記載',
    options: STD,
  },

  // ---- 分岐：単身 ----
  {
    key: 'ho_alone_1',
    category: CAT4,
    branchKey: '単身',
    sectionTitle: 'A：生活動線の自立度',
    item: '移動・交通手段',
    hint: '駅から「近い」という記録ではなく、その距離を患者が実際に越えられるかを評価する',
    placeholder: '距離・手段・季節変動・経済的負担など',
    options: STD,
  },
  {
    key: 'ho_alone_2',
    category: CAT4,
    branchKey: '単身',
    item: '食料調達・調理',
    placeholder: '調達場所・距離・調理能力・配食サービス有無など',
    options: STD,
  },
  {
    key: 'ho_alone_3',
    category: CAT4,
    branchKey: '単身',
    item: 'ゴミ収集・分別対応',
    hint: '曜日・分別ルールを遂行できる生活リズムがあるか',
    placeholder: '分別複雑度・収集曜日と生活リズムの一致・身体的負担など',
    options: STD,
  },
  {
    key: 'ho_alone_4',
    category: CAT4,
    branchKey: '単身',
    item: '金銭管理・公共料金支払い',
    placeholder: '収入源・管理方法・過去の滞納・浪費傾向など',
    options: STD,
  },
  {
    key: 'ho_alone_5',
    category: CAT4,
    branchKey: '単身',
    sectionTitle: 'B：孤立・緊急時リスク',
    item: '夜間・休日の単独生活',
    placeholder: '緊急時の連絡手段・孤独感への耐性・過去の夜間状態など',
    options: STD,
  },
  {
    key: 'ho_alone_6',
    category: CAT4,
    branchKey: '単身',
    item: '近隣・地域とのつながり',
    placeholder: '近隣関係・民生委員・コンビニ店員など日常的接触の有無など',
    options: STD,
  },
  {
    key: 'ho_alone_7',
    category: CAT4,
    branchKey: '単身',
    item: '症状悪化時の自己対処・SOS発信',
    placeholder: '過去の危機時の行動パターン・連絡先の把握状況など',
    options: STD,
  },
  {
    key: 'ho_alone_8',
    category: CAT4,
    branchKey: '単身',
    sectionTitle: 'C：環境×疾患の適合',
    item: '季節・天候による生活制限',
    hint: '新潟の場合は冬季の外出可否を必ず記載',
    placeholder: '積雪・路面凍結・猛暑など地域特性。新潟の場合は冬季外出可否を必ず記載',
    options: STD,
  },
  {
    key: 'ho_alone_9',
    category: CAT4,
    branchKey: '単身',
    item: '環境の刺激量と症状特性の適合',
    placeholder: '陰性症状が強い→孤立しやすい環境か、陽性症状→刺激過多な環境かなど',
    options: STD,
  },

  // ---- 分岐：家族同居 ----
  {
    key: 'ho_family_1',
    category: CAT4,
    branchKey: '家族同居',
    sectionTitle: 'A：家族エンティティの構造',
    item: '同居家族それぞれの退院意向',
    hint: '「家族は退院希望」と括らず、各人の意向を個別に確認する',
    placeholder: '父・母・子など各人の意向を個別に記載。表明された意向と本音のズレも記載',
    options: opt4('一致', '一部相違', '不一致'),
  },
  {
    key: 'ho_family_2',
    category: CAT4,
    branchKey: '家族同居',
    item: '主たる支援者の特定と支援能力',
    placeholder: '誰が・何を・どの条件下で担うか。「できる」と「続けられる」は別の問い',
    options: STD,
  },
  {
    key: 'ho_family_3',
    category: CAT4,
    branchKey: '家族同居',
    item: '家族の介護負担と持続可能性',
    placeholder: '家族が本音を言えているか。「大丈夫です」の裏にある疲弊を読む',
    options: STD,
  },
  {
    key: 'ho_family_4',
    category: CAT4,
    branchKey: '家族同居',
    sectionTitle: 'B：関係の質と意味',
    item: '患者にとって家族の存在が「安心」か「緊張」か',
    placeholder: '患者が家族についてどう語るか。過干渉・支配・暴力歴・依存関係なども記載',
    options: opt4('安心', '複合的', '緊張・負担'),
  },
  {
    key: 'ho_family_5',
    category: CAT4,
    branchKey: '家族同居',
    item: '家族間の役割分担の明確さ',
    placeholder: '服薬管理・受診同行・金銭管理など具体的な役割の所在を記載',
    options: STD,
  },
  {
    key: 'ho_family_6',
    category: CAT4,
    branchKey: '家族同居',
    sectionTitle: 'C：物理的環境',
    item: '患者の個人空間の確保',
    placeholder: '自室の有無・鍵の有無・家族の介入頻度など',
    options: STD,
  },
  {
    key: 'ho_family_7',
    category: CAT4,
    branchKey: '家族同居',
    item: '季節・天候による生活制限',
    placeholder: '送迎の可否・積雪時の通院手段・家族の就労状況と季節の重なりなど',
    options: STD,
  },

  // ---- 分岐：グループホーム ----
  {
    key: 'ho_gh_1',
    category: CAT4,
    branchKey: 'グループホーム',
    item: '集団生活・共用空間への適応',
    placeholder: '他者と空間を共有することへの感情・過去の集団生活の経験など',
    options: STD,
  },
  {
    key: 'ho_gh_2',
    category: CAT4,
    branchKey: 'グループホーム',
    item: 'GHスタッフ支援の質・量の確認',
    placeholder: '夜間対応の有無・支援者の専門性・緊急時の連絡体制など',
    options: STD,
  },
  {
    key: 'ho_gh_3',
    category: CAT4,
    branchKey: 'グループホーム',
    item: '患者がGHを「居場所」として受け入れているか',
    placeholder: '見学の有無・見学後の感想・GHに対するイメージや偏見など',
    options: opt4('肯定的に受け入れている', '消極的・仕方なく', '拒否・否定的意味づけ'),
  },
  {
    key: 'ho_gh_4',
    category: CAT4,
    branchKey: 'グループホーム',
    item: '新規環境への適応コスト',
    placeholder: '過去の環境変化への適応パターン・試験外泊の実施と結果など',
    options: STD,
  },

  // ---- 分岐：施設入所 ----
  {
    key: 'ho_facility_1',
    category: CAT4,
    branchKey: '施設入所',
    item: '施設の支援内容と患者ニーズの一致',
    placeholder: '医療的ケアの必要度・精神科対応の可否・身体合併症対応など',
    options: STD,
  },
  {
    key: 'ho_facility_2',
    category: CAT4,
    branchKey: '施設入所',
    item: '患者が施設入所を「受け入れているか」',
    placeholder: '患者本人への説明と同意の経緯。家族の意向と患者意向のズレも記載',
    options: opt4('納得・受け入れている', '消極的同意', '強い拒否・意思確認不十分'),
  },
  {
    key: 'ho_facility_3',
    category: CAT4,
    branchKey: '施設入所',
    item: '施設入所に伴う喪失の意味づけ',
    hint: '施設移行で患者が失うもの（自宅・役割・自由）をどう意味づけているか',
    placeholder: '何を失うと感じているか。その喪失に対してどんな感情があるか',
    options: opt4('受け入れている', '揺れている', '受け入れられていない'),
  },

  // ---- 分岐：未定 ----
  {
    key: 'ho_undecided_1',
    category: CAT4,
    branchKey: '未定',
    item: '退院先が決まらない理由の所在',
    hint: '患者側・家族側・環境側・制度側のどこに障壁があるかを特定する',
    placeholder: '障壁の所在を具体的に記載。複数該当の場合はすべて記載',
    options: [
      { value: 'ok',      label: '患者側',       score: 3 },
      { value: 'cond',    label: '家族・環境側',  score: 2 },
      { value: 'ng',      label: '制度・資源側',  score: 0 },
      { value: 'unknown', label: '不明',          score: 0, isUnknown: true },
    ],
  },
  {
    key: 'ho_undecided_2',
    category: CAT4,
    branchKey: '未定',
    item: '患者が希望する退院先・生活像',
    placeholder: '患者の言葉で記載。「どこでもいい」「病院にいたい」も重要な情報',
    options: opt4('明確な希望あり', '漠然とした希望', '希望を語れない'),
  },
  {
    key: 'ho_undecided_3',
    category: CAT4,
    branchKey: '未定',
    item: '家族の受け入れ意向',
    hint: '家族全体ではなく各人の意向を個別に確認する',
    placeholder: '誰が・どんな条件なら受け入れられるか。家族間の意向の差異も記載',
    options: opt4('受け入れ意向あり', '条件付き', '受け入れ困難'),
  },
  {
    key: 'ho_undecided_4',
    category: CAT4,
    branchKey: '未定',
    item: '利用可能な社会資源の確認状況',
    placeholder: 'PSW・相談員との連携状況・申請中のサービスなど',
    options: [
      { value: 'ok',      label: '確認済',          score: 3 },
      { value: 'cond',    label: '調整中',           score: 2 },
      { value: 'ng',      label: '未確認・不足',      score: 0 },
      { value: 'unknown', label: '不明',              score: 0, isUnknown: true },
    ],
  },
];

// ===== カテゴリ 5：医療継続 =====

const CAT5 = '医療継続';

const MEDICAL_CONT_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'mc_c1',
    category: CAT5,
    branchKey: null,
    item: '服薬に対する患者の意味づけ',
    hint: '「飲めるか」ではなく「飲み続けたいと思っているか」を評価する。ここが医療継続の最大の分岐点',
    placeholder: '「薬を飲むと太る」「飲まなくても大丈夫」「一生飲み続けるのか」など患者の言葉で記載。病識の有無とは別に評価する',
    options: STD,
  },
  {
    key: 'mc_c2',
    category: CAT5,
    branchKey: null,
    item: '服薬管理の自立度',
    placeholder: '一包化・お薬カレンダー・訪問時確認など管理方法の具体策。過去の自己中断の経緯も記載',
    options: STD,
  },
  {
    key: 'mc_c3',
    category: CAT5,
    branchKey: null,
    item: '症状悪化の自己認識と早期対処',
    placeholder: '患者自身が語る「悪化のサイン」・クライシスプランの有無・過去の再発時のパターン',
    options: STD,
  },
  {
    key: 'mc_c4',
    category: CAT5,
    branchKey: null,
    item: '医療に対する患者の基本的信頼',
    hint: '医療者・病院・薬に対する根本的な態度が継続受診の基盤になる',
    placeholder: '過去の強制入院・隔離拘束の体験・「病院には二度と行きたくない」という言葉の有無など',
    options: opt4('信頼している', '複合的・条件付き', '不信・拒絶・トラウマ'),
  },

  // ---- 分岐：外来通院継続 ----
  {
    key: 'mc_out_1',
    category: CAT5,
    branchKey: '外来通院継続',
    item: '外来受診先の確定',
    placeholder: '受診先の医療機関名・担当医・初診日の設定状況・入院病院からの引き継ぎの有無',
    options: STD,
  },
  {
    key: 'mc_out_2',
    category: CAT5,
    branchKey: '外来通院継続',
    item: '通院手段・アクセスの現実的可能性',
    placeholder: '距離・交通手段・所要時間・交通費・季節変動・同行支援の有無',
    options: STD,
  },
  {
    key: 'mc_out_3',
    category: CAT5,
    branchKey: '外来通院継続',
    item: '受診頻度と症状管理の適合',
    placeholder: '予定受診頻度・症状の安定度・次回受診まで患者が安全に過ごせるかの見通し',
    options: STD,
  },
  {
    key: 'mc_out_4',
    category: CAT5,
    branchKey: '外来通院継続',
    item: '患者が「通院したい」と思っているか',
    hint: '義務感・強制感での通院は中断リスクが高い。動機の質を評価する',
    placeholder: '「先生に会いたい」「薬をもらいに行く」「家族に言われるから」など動機の質を患者の言葉で記載',
    options: opt4('自発的動機あり', '義務感・仕方なく', '拒否・もう行かなくていい'),
  },
  {
    key: 'mc_out_5',
    category: CAT5,
    branchKey: '外来通院継続',
    item: '担当医との関係の質',
    placeholder: '担当医についてどう語るか。転院の場合は新たな関係構築が必要なことを記載',
    options: opt4('信頼関係あり', '普通・特に感情なし', '不信・恐怖・回避'),
  },
  {
    key: 'mc_out_6',
    category: CAT5,
    branchKey: '外来通院継続',
    item: '受診を途切れさせるリスク因子',
    placeholder: '過去の中断経緯・中断時の状況・「調子が良くなったらやめる」という認識の有無',
    options: opt4('リスク低', '一部リスクあり', '中断リスク高'),
  },

  // ---- 分岐：他院・他科への転院 ----
  {
    key: 'mc_transfer_1',
    category: CAT5,
    branchKey: '他院・他科への転院',
    item: '転院先の確定と受け入れ体制',
    placeholder: '転院先医療機関名・担当医・初診日・紹介状の作成状況・情報引き継ぎの内容',
    alertType: 'warning',
    alertText: '転院は「医療継続」ではなく「医療の再接続」に近い。関係のゼロリセットと移行期のリスクを必ず評価する。',
    options: STD,
  },
  {
    key: 'mc_transfer_2',
    category: CAT5,
    branchKey: '他院・他科への転院',
    item: '移行期（退院〜初診まで）の空白の管理',
    hint: '退院から転院先初診までの期間に何が起きるかを具体的に計画する',
    placeholder: '退院日と初診日の間隔・その期間の服薬供給・緊急時の連絡先・支援者の関与',
    options: opt4('空白が最小化されている', '一定の空白あり・対策あり', '空白が長い・対策なし'),
  },
  {
    key: 'mc_transfer_3',
    category: CAT5,
    branchKey: '他院・他科への転院',
    item: '患者が転院を受け入れているか',
    placeholder: '転院の理由を患者にどう説明したか・患者の反応・「先生が変わるのが嫌だ」という言葉の有無',
    options: opt4('納得・受け入れている', '消極的同意', '拒否・不満・不安が強い'),
  },

  // ---- 分岐：訪問看護中心 ----
  {
    key: 'mc_visit_1',
    category: CAT5,
    branchKey: '訪問看護中心',
    item: '訪問看護と外来の連携体制',
    placeholder: '情報共有の頻度・手段・症状変化時の外来への連絡フロー・処方変更の決定プロセス',
    alertType: 'info',
    alertText: '通院困難なケースで訪問看護が医療の主軸になる場合、外来との連携が不可欠。「訪問だけで完結」しないことを前提に評価する。',
    options: STD,
  },
  {
    key: 'mc_visit_2',
    category: CAT5,
    branchKey: '訪問看護中心',
    item: '訪問時の服薬確認・管理の実効性',
    placeholder: '患者が服薬確認を受け入れているか・「飲んだふり」のリスク・訪問頻度と服薬タイミングの一致',
    options: STD,
  },
  {
    key: 'mc_visit_3',
    category: CAT5,
    branchKey: '訪問看護中心',
    item: '訪問がない日・時間帯の医療的空白',
    placeholder: '訪問頻度・曜日・夜間休日の対応・緊急時の連絡先・次回訪問まで患者が安全に過ごせるか',
    options: opt4('空白が管理されている', '一部リスクあり', '空白が大きい・対策なし'),
  },

  // ---- 分岐：ACT・集中支援 ----
  {
    key: 'mc_act_1',
    category: CAT5,
    branchKey: 'ACT・集中支援',
    item: 'ACT利用の適応・対象基準の確認',
    placeholder: 'ACTチームの所属・担当者・利用開始予定日・患者への説明と同意の状況',
    alertType: 'info',
    alertText: 'ACTは医療・生活・社会参加を包括的に支援する。対象の明確化と患者の同意が前提になる。',
    options: STD,
  },
  {
    key: 'mc_act_2',
    category: CAT5,
    branchKey: 'ACT・集中支援',
    item: '患者がACTの支援を「受け入れているか」',
    hint: 'ACTは支援の密度が高い。患者が「支援されすぎる」と感じる場合は継続が困難になる',
    placeholder: 'ACTチームとの関係の質・入院中から関係構築できているか・患者のACTに対する印象',
    options: opt4('受け入れている', '消極的同意', '拒否・監視されている感じ'),
  },

  // ---- 分岐：未確定 ----
  {
    key: 'mc_undecided_1',
    category: CAT5,
    branchKey: '未確定',
    item: '未確定の理由の所在',
    placeholder: 'なぜ未確定かを具体的に記載。「受け入れ先がない」「本人が拒否」では対応が全く異なる',
    alertType: 'warning',
    alertText: '退院時に医療継続先が未確定であることは重大なリスク。未確定の理由を特定し退院前に解決することを最優先課題とする。',
    options: opt4('調整中（解決見通しあり）', '難航中', '患者が医療継続を拒否'),
  },
  {
    key: 'mc_undecided_2',
    category: CAT5,
    branchKey: '未確定',
    item: '患者が医療継続を必要と感じているか',
    placeholder: '「薬を飲み続けたい」「先生に診てもらいたい」「もう治った」など患者の言葉で記載',
    options: opt4('必要性を感じている', '曖昧・条件次第', 'もう医療はいらない'),
  },
  {
    key: 'mc_undecided_3',
    category: CAT5,
    branchKey: '未確定',
    item: '退院後の最低限の医療的安全網の有無',
    placeholder: '救急受診先・かかりつけ外来・相談できる支援者など最低限の医療的接点の有無',
    options: opt4('最低限あり', '不十分だがゼロではない', '完全に空白'),
  },
];
// ===== カテゴリ 6：経済状況 =====

const CAT6 = '経済状況';

const ECONOMIC_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'ec_c1',
    category: CAT6,
    branchKey: null,
    item: '月収入額と退院後の生活費の収支',
    placeholder: '月収入額・家賃・光熱費・食費・医療費・交通費など主要支出の概算と収支バランス',
    options: STD,
  },
  {
    key: 'ec_c2',
    category: CAT6,
    branchKey: null,
    item: '金銭管理の自立度',
    placeholder: '通帳・現金の管理方法・過去の滞納・浪費・金銭トラブルの有無',
    options: STD,
  },
  {
    key: 'ec_c3',
    category: CAT6,
    branchKey: null,
    item: 'お金に対する患者の主観的意味',
    hint: '「お金がない」という事実と「お金がないと感じる」体験は別の問い',
    placeholder: '患者がお金についてどう語るか。過去の経済的困窮体験・借金・貧困の記憶など',
    options: opt4('現実的に捉えている', '不安が大きい', '強い恐怖・執着・回避'),
  },

  // ---- 分岐：障害年金 ----
  {
    key: 'ec_pension_1',
    category: CAT6,
    branchKey: '障害年金',
    item: '障害年金の受給状況・等級',
    placeholder: '等級（1級・2級・3級）・月額・基礎か厚生か・次回更新時期',
    options: [
      { value: 'ok',      label: '受給確定',       score: 3 },
      { value: 'cond',    label: '申請中・調整中',  score: 2 },
      { value: 'ng',      label: '未申請・停止リスク', score: 0 },
      { value: 'unknown', label: '不明',            score: 0, isUnknown: true },
    ],
  },
  {
    key: 'ec_pension_2',
    category: CAT6,
    branchKey: '障害年金',
    item: '更新リスクの認識と対応',
    placeholder: '次回更新時期・診断書作成の段取り・更新による等級変更リスクの有無',
    options: STD,
  },
  {
    key: 'ec_pension_3',
    category: CAT6,
    branchKey: '障害年金',
    item: '患者が年金受給をどう意味づけているか',
    hint: '年金受給を「病者である証明」として複雑な感情を持つ患者は少なくない',
    placeholder: '「障害者扱いされている」「早く働きたい」など年金に対する感情・自尊心への影響',
    options: opt4('安定した収入として受け入れている', '複合的な感情', '受給への抵抗・スティグマ'),
  },

  // ---- 分岐：生活保護 ----
  {
    key: 'ec_welfare_1',
    category: CAT6,
    branchKey: '生活保護',
    item: '生活保護の受給状況・担当CWとの関係',
    placeholder: '担当CW名・関係の質・患者がCWをどう体験しているか・引き継ぎの状況',
    alertType: 'warning',
    alertText: '生活保護は退院先の管轄ケースワーカーへの引き継ぎが必要。地域をまたぐ場合は手続きを必ず確認する。',
    options: STD,
  },
  {
    key: 'ec_welfare_2',
    category: CAT6,
    branchKey: '生活保護',
    item: '退院後の住居と保護費の整合性',
    placeholder: '住宅扶助の上限額・退院予定先の家賃・差額の処理方法など',
    options: STD,
  },
  {
    key: 'ec_welfare_3',
    category: CAT6,
    branchKey: '生活保護',
    item: '患者が生活保護をどう意味づけているか',
    placeholder: '「恥ずかしい」「早く抜け出したい」「仕方ない」など患者の言葉で記載',
    options: opt4('生活の基盤として受け入れている', '複合的な感情', '強い抵抗・恥・拒否感'),
  },
  {
    key: 'ec_welfare_4',
    category: CAT6,
    branchKey: '生活保護',
    item: '就労意欲との関係',
    placeholder: '「働けば保護が切られる」という誤解の有無・就労支援との接続状況',
    options: opt4('現実的に折り合えている', '葛藤あり', '現実と乖離した就労意欲・保護打ち切りへの不安'),
  },

  // ---- 分岐：就労収入 ----
  {
    key: 'ec_work_1',
    category: CAT6,
    branchKey: '就労収入',
    item: '就労形態と収入の安定度',
    placeholder: '雇用形態・月収・職場の理解度・障害開示の有無・福祉的就労（A型・B型）か一般就労か',
    alertType: 'info',
    alertText: '就労収入がある場合、「働いている」という事実ではなく「継続できるか」を評価する。',
    options: STD,
  },
  {
    key: 'ec_work_2',
    category: CAT6,
    branchKey: '就労収入',
    item: '症状の波と就労継続の適合',
    placeholder: '欠勤頻度・職場の柔軟性・症状悪化時の対応プラン・過去の離職経緯',
    options: STD,
  },
  {
    key: 'ec_work_3',
    category: CAT6,
    branchKey: '就労収入',
    item: '就労の患者にとっての意味',
    placeholder: '仕事に対してどんな言葉を使うか。「仕事だけが生きがい」という過剰な意味づけにも注意',
    options: opt4('生きがい・アイデンティティ', '収入手段として', '義務感・強迫的・負担'),
  },

  // ---- 分岐：家族による経済的支援 ----
  {
    key: 'ec_family_1',
    category: CAT6,
    branchKey: '家族による経済的支援',
    item: '支援者の経済状況と支援余力',
    placeholder: '支援者の収入・年齢・自身の家族・支援の上限額と継続期間の見通し',
    alertType: 'warning',
    alertText: '家族による経済的支援は最も不安定な収入源。「今できる」と「続けられる」は必ず分けて評価する。',
    options: STD,
  },
  {
    key: 'ec_family_2',
    category: CAT6,
    branchKey: '家族による経済的支援',
    item: '経済的支援と関係性の混在リスク',
    hint: 'お金の流れが支配・依存・罪悪感と結びついていないかを評価する',
    placeholder: '「お金を出してやっている」という支配・患者側の過剰な罪悪感・「返せない」という絶望など',
    options: opt4('混在リスク低', '一部混在', '支配・依存・罪悪感と強く結びついている'),
  },
  {
    key: 'ec_family_3',
    category: CAT6,
    branchKey: '家族による経済的支援',
    item: '制度的収入への移行計画',
    placeholder: '障害年金・生活保護・就労支援など制度的収入への申請・移行の見通し',
    options: opt4('計画あり', '検討中', '計画なし・家族支援が固定化している'),
  },

  // ---- 分岐：複合（年金＋就労等） ----
  {
    key: 'ec_combined_1',
    category: CAT6,
    branchKey: '複合（年金＋就労等）',
    item: '収入構成の内訳と各収入の安定度',
    placeholder: '収入源ごとの月額・安定度・一つが途絶えた場合の影響を記載',
    alertType: 'info',
    alertText: '複数の収入源がある場合、それぞれの変動リスクが重なったときの最悪ケースを想定する。',
    options: STD,
  },
  {
    key: 'ec_combined_2',
    category: CAT6,
    branchKey: '複合（年金＋就労等）',
    item: '就労と年金の関係についての患者の理解',
    placeholder: '「働いたら年金が切られる」という誤解・実際のルールの説明状況',
    options: opt4('正確に理解', '部分的に理解', '誤解・未理解'),
  },

  // ---- 分岐：収入なし・未確定 ----
  {
    key: 'ec_none_1',
    category: CAT6,
    branchKey: '収入なし・未確定',
    item: '収入がない・未確定の理由',
    placeholder: 'なぜ収入がないか・なぜ未確定かを具体的に記載',
    alertType: 'warning',
    alertText: '収入なし・未確定での退院は生活崩壊のリスクが高い。退院前に制度的収入の確保を最優先課題とする。',
    options: [
      { value: 'ok',      label: '申請手続き中',           score: 3 },
      { value: 'cond',    label: '制度の対象か未確認',      score: 2 },
      { value: 'ng',      label: '申請を拒否・制度につながれていない', score: 0 },
      { value: 'unknown', label: '不明',                   score: 0, isUnknown: true },
    ],
  },
  {
    key: 'ec_none_2',
    category: CAT6,
    branchKey: '収入なし・未確定',
    item: '緊急の生活費の確保状況',
    placeholder: '手持ち金・家族からの当座の援助・緊急小口資金など短期的な対応策',
    options: STD,
  },
  {
    key: 'ec_none_3',
    category: CAT6,
    branchKey: '収入なし・未確定',
    item: 'PSW・相談員との連携状況',
    placeholder: '関与しているPSW・相談員・申請中の制度・患者が拒否している場合はその理由',
    options: [
      { value: 'ok',      label: '可',    score: 3 },
      { value: 'cond',    label: '調整中', score: 2 },
      { value: 'ng',      label: '不可',   score: 0 },
      { value: 'unknown', label: '不明',   score: 0, isUnknown: true },
    ],
  },
  {
    key: 'ec_none_4',
    category: CAT6,
    branchKey: '収入なし・未確定',
    item: '収入のなさに対する患者の体験',
    placeholder: '過去の貧困体験・ホームレス経験・「どうせ無理」という諦めの有無など',
    options: opt4('現実的に捉えている', '強い不安', '絶望・思考停止・回避'),
  },
];

// ===== カテゴリ 7：社会資源 =====

const CAT7 = '社会資源';

const SOCIAL_RESOURCE_ITEMS: DetailedItem[] = [
  // ---- 共通項目 ----
  {
    key: 'sr_c1',
    category: CAT7,
    branchKey: null,
    item: '患者はその資源を「使いたい」と思っているか',
    hint: '資源が「ある」と患者が「使える・使いたい」は全く別の問い。ここが退院支援の最大の盲点になる',
    placeholder: '患者がそのサービスについてどう語るか。「仕方なく」「言われたから」も重要な情報',
    options: opt4('積極的に利用意向あり', '消極的同意', '抵抗・拒否・関心なし'),
  },
  {
    key: 'sr_c2',
    category: CAT7,
    branchKey: null,
    item: '支援を受けることへの患者の意味づけ',
    hint: '支援を「助け」と感じるか「監視」「侵入」「恥」と感じるかが利用継続を左右する',
    placeholder: '「人に頼るのは恥ずかしい」「見張られている感じ」など患者の言葉で記載',
    options: opt4('助け・安心として受け取れている', '複合的', '監視・侵入・恥・負担'),
  },
  {
    key: 'sr_c3',
    category: CAT7,
    branchKey: null,
    item: 'サービス導入の手続き・調整状況',
    placeholder: '開始予定日・担当者・未確定の場合はその理由と見通し',
    options: [
      { value: 'ok',      label: '確定',        score: 3 },
      { value: 'cond',    label: '調整中',       score: 2 },
      { value: 'ng',      label: '未着手・難航', score: 0 },
      { value: 'unknown', label: '不明',         score: 0, isUnknown: true },
    ],
  },

  // ---- 分岐：訪問系 ----
  {
    key: 'sr_visit_1',
    category: CAT7,
    branchKey: '訪問系',
    item: '訪問頻度・内容と患者ニーズの一致',
    placeholder: '訪問曜日・時間・頻度・主な支援内容。訪問がない日の生活成立度も記載',
    alertType: 'info',
    alertText: '訪問看護・ACT・ホームヘルパー・居宅介護など。「誰が・何のために・どのくらい訪問するか」を具体的に評価する。',
    options: STD,
  },
  {
    key: 'sr_visit_2',
    category: CAT7,
    branchKey: '訪問系',
    item: '患者が他者の訪問を受け入れられるか',
    hint: '「訪問看護が入る」と「患者がドアを開けられる」は別の問い。精神科では特に重要',
    placeholder: '他者を家に入れることへの感情・過去に訪問を拒否したことがあるか・信頼関係の有無',
    options: opt4('受け入れられる', '条件によっては可', '拒否・閉鎖・回避の可能性'),
  },
  {
    key: 'sr_visit_3',
    category: CAT7,
    branchKey: '訪問系',
    item: '訪問者と患者の関係性の質',
    placeholder: '入院中から関係を作れているか・担当者の固定・引き継ぎの質など',
    options: opt4('信頼関係が形成されている', '関係構築中', '担当者未定・関係ゼロからのスタート'),
  },
  {
    key: 'sr_visit_4',
    category: CAT7,
    branchKey: '訪問系',
    item: '症状悪化時の対応プロトコル',
    placeholder: '緊急連絡先・受診判断の基準・入院が必要になった場合の手順など',
    options: opt4('共有されている', '一部未共有', '存在しない'),
  },

  // ---- 分岐：通所系 ----
  {
    key: 'sr_daycare_1',
    category: CAT7,
    branchKey: '通所系',
    item: '通所先までのアクセスの現実的可能性',
    placeholder: '距離・交通手段・交通費・所要時間・季節・天候による変動（新潟は冬季必須）',
    alertType: 'info',
    alertText: 'デイケア・就労継続支援A型B型・地域活動支援センター・作業所など。「通える」と「通い続けられる」は別の問い。',
    options: STD,
  },
  {
    key: 'sr_daycare_2',
    category: CAT7,
    branchKey: '通所系',
    item: '通所先を患者が「居場所」と感じているか',
    hint: '見学・体験の有無と、その後の患者の言葉・表情が重要な指標',
    placeholder: '見学の有無・見学後の感想・他の利用者との関係・プログラム内容への関心など',
    options: opt4('居場所として感じている', 'まだわからない・不安', '拒否・否定的・行きたくない'),
  },
  {
    key: 'sr_daycare_3',
    category: CAT7,
    branchKey: '通所系',
    item: '通所頻度と生活リズムの適合',
    placeholder: '通所曜日・時間・頻度と患者の生活リズム・睡眠パターン・疲労耐性の一致度',
    options: opt4('適合している', '一部不適合', '不適合・無理なスケジュール'),
  },
  {
    key: 'sr_daycare_4',
    category: CAT7,
    branchKey: '通所系',
    item: '欠席した場合の対応体制',
    hint: '欠席が続いた時に誰がどう気づき対応するかが孤立・再発防止の鍵',
    placeholder: '連絡確認の仕組み・欠席が続いた場合の訪問・通所先と訪問看護の連携など',
    options: opt4('体制あり', '一部あり', '体制なし・欠席が見過ごされる'),
  },

  // ---- 分岐：相談支援 ----
  {
    key: 'sr_consult_1',
    category: CAT7,
    branchKey: '相談支援',
    item: 'サービス等利用計画の作成状況',
    placeholder: '相談支援専門員の氏名・事業所・計画の確定状況・モニタリング頻度',
    alertType: 'info',
    alertText: '相談支援専門員・PSW・地域包括・保健師など。「誰が全体を調整するか」を明確にする。',
    options: [
      { value: 'ok',      label: '確定',    score: 3 },
      { value: 'cond',    label: '作成中',  score: 2 },
      { value: 'ng',      label: '未作成',  score: 0 },
      { value: 'unknown', label: '不明',    score: 0, isUnknown: true },
    ],
  },
  {
    key: 'sr_consult_2',
    category: CAT7,
    branchKey: '相談支援',
    item: '患者と相談支援者の関係の質',
    hint: '制度的に担当者がいることと、患者が「この人に相談できる」と感じているかは別',
    placeholder: '入院中から関係を作れているか・面会の頻度・患者の相談支援者に対する印象',
    options: opt4('信頼関係あり', '関係形成中', '関係が薄い・患者が顔を知らない'),
  },
  {
    key: 'sr_consult_3',
    category: CAT7,
    branchKey: '相談支援',
    item: '多機関連携のコーディネート機能',
    hint: '複数のサービスが入る場合、誰が全体を調整するかが明確かを評価する',
    placeholder: '調整役の明確化・サービス担当者会議の予定・情報共有の仕組みなど',
    options: opt4('明確', '暗黙の了解', '不明確・誰も全体を見ていない'),
  },

  // ---- 分岐：インフォーマル支援 ----
  {
    key: 'sr_informal_1',
    category: CAT7,
    branchKey: 'インフォーマル支援',
    item: 'インフォーマル支援の種別と安定度',
    placeholder: '支援者の種別・関係の継続年数・接触頻度・支援の具体的内容',
    alertType: 'warning',
    alertText: 'インフォーマル支援は制度的保障がない。「あてにしすぎない」前提で評価し、公式支援との補完関係を確認する。',
    options: opt4('安定・継続的', '不定期・流動的', '不安定・一時的'),
  },
  {
    key: 'sr_informal_2',
    category: CAT7,
    branchKey: 'インフォーマル支援',
    item: '患者がそのつながりを「居場所」と感じているか',
    placeholder: '患者がそのつながりについてどう語るか。「行くと楽になる」「気が重い」など具体的に',
    options: opt4('居場所として感じている', '複合的', '表面的・義務的・意味を感じていない'),
  },
  {
    key: 'sr_informal_3',
    category: CAT7,
    branchKey: 'インフォーマル支援',
    item: 'インフォーマル支援と公式支援の補完関係',
    placeholder: '緊急時に誰に連絡するか・インフォーマル支援者が公式支援につなげる役割を担えるか',
    options: opt4('補完関係が成立', '一部接続あり', 'インフォーマルのみ・公式支援が不在'),
  },

  // ---- 分岐：複合利用 ----
  {
    key: 'sr_multi_1',
    category: CAT7,
    branchKey: '複合利用',
    item: '各サービスの役割分担の明確さ',
    placeholder: '各サービスが何を担うか一覧で記載。「誰も夜間を担わない」などの空白を明示',
    alertType: 'info',
    alertText: '複数のサービスを利用する場合、「足し算」ではなく「連携の質」を評価する。サービスが多ければ良いわけではない。',
    options: opt4('明確', '一部不明確', '重複・空白あり'),
  },
  {
    key: 'sr_multi_2',
    category: CAT7,
    branchKey: '複合利用',
    item: '患者の支援過多・疲弊リスク',
    hint: 'サービスが多すぎることで患者が消耗する場合がある',
    placeholder: '週あたりの支援接触回数・患者が「多すぎる」「休みたい」と言っていないかなど',
    options: opt4('適切な量', 'やや多い', '過多・患者が圧迫されている'),
  },
  {
    key: 'sr_multi_3',
    category: CAT7,
    branchKey: '複合利用',
    item: 'サービス間の情報共有・連携の質',
    placeholder: '担当者会議の頻度・共有ツール・情報伝達の実態。「左手が右手を知らない」状態になっていないか',
    options: opt4('共有されている', '一部のみ', '共有されていない・縦割り'),
  },
  {
    key: 'sr_multi_4',
    category: CAT7,
    branchKey: '複合利用',
    item: '危機時の連携プロトコル',
    placeholder: '緊急連絡の順序・入院判断の基準・各サービスの限界と引き継ぎの手順',
    options: opt4('合意されている', '概ね合意', '合意なし・誰が動くか不明'),
  },

  // ---- 分岐：未接続・未導入 ----
  {
    key: 'sr_none_1',
    category: CAT7,
    branchKey: '未接続・未導入',
    item: '未接続の理由の所在',
    placeholder: 'なぜ未接続かを具体的に記載',
    alertType: 'warning',
    alertText: '社会資源への未接続は「支援が必要ない」ではなく「なぜつながれないか」を問う。理由の所在が対応を決める。',
    options: [
      { value: 'ok',      label: '手続き上の問題（調整中）',         score: 3 },
      { value: 'cond',    label: '地域に資源が存在しない',           score: 2 },
      { value: 'ng',      label: '患者が拒否・支援を必要と感じていない', score: 0 },
      { value: 'unknown', label: '不明',                             score: 0, isUnknown: true },
    ],
  },
  {
    key: 'sr_none_2',
    category: CAT7,
    branchKey: '未接続・未導入',
    item: '患者が支援を必要と感じているか',
    placeholder: '「大丈夫」「迷惑をかけたくない」「人が家に来るのは嫌」など患者の言葉で記載',
    options: opt4('必要性を認識している', '曖昧・条件次第', '必要ない・一人でできる'),
  },
  {
    key: 'sr_none_3',
    category: CAT7,
    branchKey: '未接続・未導入',
    item: '最低限の危機対応体制の有無',
    placeholder: '緊急連絡先・かかりつけ外来・近隣・家族など最低限のセーフティネットの有無',
    options: opt4('最低限あり', '不十分だがゼロではない', '完全に孤立・緊急時の連絡先なし'),
  },
  {
    key: 'sr_none_4',
    category: CAT7,
    branchKey: '未接続・未導入',
    item: '将来的な資源接続の可能性',
    placeholder: 'どのような条件・関係があれば受け入れられるか。段階的アプローチの可能性など',
    options: opt4('接続の可能性あり', '時間をかければ可能性あり', '現時点では困難・強固な拒否'),
  },
];

// ===== 公開エクスポート =====

export const DETAILED_ITEMS: DetailedItem[] = [
  ...PATIENT_WILL_ITEMS,
  ...LIVING_ABILITY_ITEMS,
  ...FAMILY_KP_ITEMS,
  ...HOUSING_ITEMS,
  ...MEDICAL_CONT_ITEMS,
  ...ECONOMIC_ITEMS,
  ...SOCIAL_RESOURCE_ITEMS,
];

// カテゴリ名でフィルタするユーティリティ
export function getItemsByCategory(categoryName: string): DetailedItem[] {
  return DETAILED_ITEMS.filter(item => item.category === categoryName);
}

// 分岐でフィルタするユーティリティ（null = 共通項目も含む）
export function getItemsForBranch(categoryName: string, branchKey: string): DetailedItem[] {
  return DETAILED_ITEMS.filter(
    item => item.category === categoryName &&
    (item.branchKey === null || item.branchKey === branchKey)
  );
}
