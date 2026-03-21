// 長期療養アセスメント マスターデータ
// 長期療養アセスメント.xlsx / 長期療養モード実装指示書.txt より移植

import type { EvaluationItem, EvaluationOption } from './masterData';

export const LONG_TERM_CATEGORY_COLORS: Record<string, string> = {
  '属性':               'var(--accent-green)',
  '精神症状の安定性':   'var(--accent-cyan)',
  '生活機能':           'var(--accent-blue)',
  '対人関係':           'var(--accent-teal)',
  '身体状態':           'var(--accent-orange)',
  '看護師の患者理解度': 'var(--accent-purple)',
  '地域移行の可能性':   'var(--accent-yellow)',
};

export const LONG_TERM_CATEGORIES = [
  '属性',
  '精神症状の安定性',
  '生活機能',
  '対人関係',
  '身体状態',
  '看護師の患者理解度',
  '地域移行の可能性',
] as const;

export type LongTermCategoryName = typeof LONG_TERM_CATEGORIES[number];

const UI: EvaluationOption = {
  value: '不明',
  label: '不明',
  score: null,
  comment: '要確認',
  criteria: '',
  isUnknown: true,
};

export const LONG_TERM_MASTER_DATA: EvaluationItem[] = [

  // ===== 属性（点数対象外）=====

  {
    key: 'lt_age',
    category: '属性',
    item: '年齢',
    isInfoOnly: true,
    options: [
      { value: '〜29歳',   label: '〜29歳',   score: null, comment: '若年層',     criteria: '' },
      { value: '30〜44歳', label: '30〜44歳', score: null, comment: '若年〜中年', criteria: '' },
      { value: '45〜64歳', label: '45〜64歳', score: null, comment: '中年',       criteria: '' },
      { value: '65〜74歳', label: '65〜74歳', score: null, comment: '前期高齢',   criteria: '' },
      { value: '75歳以上', label: '75歳以上', score: null, comment: '後期高齢',   criteria: '' },
      { ...UI },
    ],
  },

  {
    key: 'lt_gender',
    category: '属性',
    item: '性別',
    isInfoOnly: true,
    options: [
      { value: '男性',  label: '男性',  score: null, comment: '', criteria: '' },
      { value: '女性',  label: '女性',  score: null, comment: '', criteria: '' },
      { value: 'その他', label: 'その他', score: null, comment: '', criteria: '' },
      { ...UI },
    ],
  },

  {
    key: 'lt_main_disease',
    category: '属性',
    item: '主疾患',
    isInfoOnly: true,
    options: [
      { value: '統合失調症',  label: '統合失調症',  score: null, comment: '', criteria: '' },
      { value: '双極性障害',  label: '双極性障害',  score: null, comment: '', criteria: '' },
      { value: 'うつ病',      label: 'うつ病',      score: null, comment: '', criteria: '' },
      { value: '認知症',      label: '認知症',      score: null, comment: '', criteria: '' },
      { value: 'その他',      label: 'その他',      score: null, comment: '', criteria: '' },
      { ...UI },
    ],
  },

  {
    key: 'lt_hospitalization_period',
    category: '属性',
    item: '入院期間',
    isInfoOnly: true,
    options: [
      { value: '1年未満',   label: '1年未満',   score: null, comment: '', criteria: '' },
      { value: '1〜5年',    label: '1〜5年',    score: null, comment: '', criteria: '' },
      { value: '5〜10年',   label: '5〜10年',   score: null, comment: '', criteria: '' },
      { value: '10〜20年',  label: '10〜20年',  score: null, comment: '', criteria: '' },
      { value: '20〜40年',  label: '20〜40年',  score: null, comment: '', criteria: '' },
      { value: '40年以上',  label: '40年以上',  score: null, comment: '', criteria: '' },
      { ...UI },
    ],
  },

  {
    key: 'lt_complication',
    category: '属性',
    item: '合併症・医療ケア',
    isInfoOnly: true,
    options: [
      { value: 'なし',          label: 'なし',          score: null, comment: '', criteria: '' },
      { value: 'あり（軽度）',  label: 'あり（軽度）',  score: null, comment: '', criteria: '' },
      { value: 'あり（中等度）', label: 'あり（中等度）', score: null, comment: '', criteria: '' },
      { value: 'あり（高度）',  label: 'あり（高度）',  score: null, comment: '', criteria: '' },
      { ...UI },
    ],
  },

  // ===== 精神症状の安定性 =====

  {
    key: 'lt_hallucination',
    category: '精神症状の安定性',
    item: '幻覚・妄想の程度',
    isInfoOnly: false,
    options: [
      {
        value: '強い：連日出現・現実検討不能',
        label: '強い：連日出現・現実検討不能',
        score: 0,
        comment: '【高リスク】現実検討が困難な状態。安全確保と薬物療法の再評価が必要。',
        criteria: '連日幻覚・妄想が出現し、現実と区別できない。日常生活全般に支障あり。',
      },
      {
        value: '軽度：週1回程度・服薬で改善可',
        label: '軽度：週1回程度・服薬で改善可',
        score: 1,
        comment: '【管理可能】服薬継続と環境調整で安定維持を目指す。',
        criteria: '週1回程度の出現だが服薬で改善可能。本人もある程度認識している。',
      },
      {
        value: 'なし：長期間寛解状態',
        label: 'なし：長期間寛解状態',
        score: 2,
        comment: '【良好】長期寛解状態。服薬継続の重要性を継続的に強化する。',
        criteria: '長期間（3ヶ月以上）幻覚・妄想の出現なし。服薬継続が主要な維持要因。',
      },
    ],
  },

  {
    key: 'lt_mood_stability',
    category: '精神症状の安定性',
    item: '気分・情緒の安定',
    isInfoOnly: false,
    options: [
      {
        value: '不安定：急変が頻回・自傷念慮あり',
        label: '不安定：急変が頻回・自傷念慮あり',
        score: 0,
        comment: '【要注意】自傷念慮があるため安全確保が最優先。1:1での観察強化を検討。',
        criteria: '感情の急変が月複数回以上、または自傷・希死念慮が確認されている。',
      },
      {
        value: 'やや不安定：月1〜2回の変動',
        label: 'やや不安定：月1〜2回の変動',
        score: 1,
        comment: '【継続観察】変動のきっかけを特定し、予防的なケアを検討する。',
        criteria: '月1〜2回程度の情緒不安定エピソードがある。きっかけは概ね特定可能。',
      },
      {
        value: '安定：3ヶ月以上安定',
        label: '安定：3ヶ月以上安定',
        score: 2,
        comment: '【良好】3ヶ月以上の安定を維持。この状態を支える要因を明確化して継続。',
        criteria: '3ヶ月以上、著明な気分変動・情緒不安定なし。日常生活に支障なし。',
      },
    ],
  },

  {
    key: 'lt_self_harm_risk',
    category: '精神症状の安定性',
    item: '自傷・他害リスク',
    isInfoOnly: false,
    options: [
      {
        value: '高：直近1ヶ月で行為あり',
        label: '高：直近1ヶ月で行為あり',
        score: 0,
        comment: '【最優先対応】直近1ヶ月以内の行為あり。多職種で緊急対応を協議する。',
        criteria: '直近1ヶ月以内に自傷または他害行為が確認されている。',
      },
      {
        value: '中：半年以内に問題あり',
        label: '中：半年以内に問題あり',
        score: 1,
        comment: '【継続モニタリング】半年以内に問題あり。再燃サインを全スタッフで共有する。',
        criteria: '過去6ヶ月以内に自傷または他害行為、またはその念慮が確認されている。',
      },
      {
        value: '低：年1〜2回程度',
        label: '低：年1〜2回程度',
        score: 2,
        comment: '【観察継続】年1〜2回程度の発生。状況や前兆パターンをアセスメントに記録。',
        criteria: '年1〜2回程度。直近6ヶ月間は問題なし。',
      },
      {
        value: 'なし：1年以上問題なし',
        label: 'なし：1年以上問題なし',
        score: 3,
        comment: '【良好】1年以上問題なし。安定を支える環境・支援要因を維持する。',
        criteria: '1年以上、自傷・他害行為またはその念慮の報告なし。',
      },
    ],
  },

  {
    key: 'lt_symptom_pattern',
    category: '精神症状の安定性',
    item: '症状の変動パターン',
    isInfoOnly: false,
    options: [
      {
        value: '把握不能：予測できない',
        label: '把握不能：予測できない',
        score: 0,
        comment: '【要アセスメント】パターンが不明なため予防的ケアができない。経過観察・記録強化が必要。',
        criteria: '症状の出現・増悪のきっかけや前兆が把握できていない。',
      },
      {
        value: 'おおよそ把握：きっかけは分かる',
        label: 'おおよそ把握：きっかけは分かる',
        score: 1,
        comment: '【継続評価】きっかけは分かる状態。前兆・回復過程の把握も目指す。',
        criteria: '症状悪化のきっかけ（例：特定のストレス場面）は概ね特定できている。',
      },
      {
        value: '明確に把握：前兆・経過・回復を説明できる',
        label: '明確に把握：前兆・経過・回復を説明できる',
        score: 2,
        comment: '【優れた理解】前兆から回復まで説明できる。早期介入が可能な状態。',
        criteria: '前兆サイン・症状の経過・回復過程を担当看護師が明確に説明できる。',
      },
    ],
  },

  {
    key: 'lt_violence_risk',
    category: '精神症状の安定性',
    item: '暴力・行動制限リスク',
    isInfoOnly: false,
    options: [
      {
        value: '高：直近1ヶ月で暴力行為・行動制限あり',
        label: '高：直近1ヶ月で暴力行為・行動制限あり',
        score: 0,
        comment: '【緊急対応】直近1ヶ月以内に暴力行為または行動制限あり。安全管理計画を緊急確認。',
        criteria: '直近1ヶ月以内に暴力行為または隔離・身体拘束等の行動制限が実施されている。',
      },
      {
        value: '中：半年以内に行動制限歴あり',
        label: '中：半年以内に行動制限歴あり',
        score: 1,
        comment: '【注意継続】半年以内の行動制限歴あり。再燃予防のための環境・薬物療法を確認。',
        criteria: '過去6ヶ月以内に行動制限が実施された記録がある。現在は落ち着いている。',
      },
      {
        value: '低：1年以上行動制限なし',
        label: '低：1年以上行動制限なし',
        score: 2,
        comment: '【良好】1年以上行動制限なし。安定を維持する支援継続が重要。',
        criteria: '1年以上、暴力行為・行動制限の記録なし。',
      },
    ],
  },

  // ===== 生活機能 =====

  {
    key: 'lt_self_care',
    category: '生活機能',
    item: 'セルフケア（清潔・更衣）',
    isInfoOnly: false,
    options: [
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '【全介助】日常的な介助が必要。介助量の評価と負担軽減の工夫を検討。',
        criteria: '清潔保持・更衣を自分では行えず、全面的な介助が必要。',
      },
      {
        value: '一部介助・声かけ必要',
        label: '一部介助・声かけ必要',
        score: 1,
        comment: '【支援継続】声かけや一部介助で実施可能。自立に向けた段階的支援を継続。',
        criteria: '声かけや部分的な介助があれば清潔・更衣を行える。自発性にムラがある。',
      },
      {
        value: '自立',
        label: '自立',
        score: 2,
        comment: '【自立】自分で清潔・更衣を管理できている。この習慣を継続支援する。',
        criteria: '清潔保持・更衣を自発的かつ適切に実施できている。',
      },
    ],
  },

  {
    key: 'lt_meal',
    category: '生活機能',
    item: '食事',
    isInfoOnly: false,
    options: [
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '【全介助】経管栄養または全介助。嚥下評価・栄養管理を多職種で確認。',
        criteria: '食事を自力で摂取できず、全介助または経管栄養が必要。',
      },
      {
        value: '一部介助・見守り必要',
        label: '一部介助・見守り必要',
        score: 1,
        comment: '【要見守り】見守りや一部介助が必要。安全な食事環境の整備を継続。',
        criteria: '見守りや一部介助があれば食事を摂取できる。ペース調整や促しが必要なことがある。',
      },
      {
        value: '自立',
        label: '自立',
        score: 2,
        comment: '【自立】自力での食事摂取が安定している。',
        criteria: '食事を安全かつ自立して摂取できている。',
      },
    ],
  },

  {
    key: 'lt_excretion',
    category: '生活機能',
    item: '排泄',
    isInfoOnly: false,
    options: [
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '【全介助】おむつ使用または全介助。皮膚トラブル・感染リスクの管理が重要。',
        criteria: '排泄の認識・実施いずれかで全介助が必要。オムツ使用等。',
      },
      {
        value: '一部介助・見守り必要',
        label: '一部介助・見守り必要',
        score: 1,
        comment: '【要支援】誘導や一部介助で排泄可能。失禁予防のパターン把握を継続。',
        criteria: '誘導や一部介助があれば排泄できる。失禁が時々ある。',
      },
      {
        value: '自立',
        label: '自立',
        score: 2,
        comment: '【自立】排泄を自立して行えている。',
        criteria: '排泄を自分で認識・実施できている。失禁なし。',
      },
    ],
  },

  {
    key: 'lt_sleep_rhythm',
    category: '生活機能',
    item: '睡眠リズム',
    isInfoOnly: false,
    options: [
      {
        value: '著しく乱れている・毎夜対応必要',
        label: '著しく乱れている・毎夜対応必要',
        score: 0,
        comment: '【毎夜対応】夜間の対応が毎夜必要。薬物療法・環境調整・日中活動の見直しを多職種で協議。',
        criteria: '入眠困難・夜間頻回覚醒・昼夜逆転等が著しく、スタッフの夜間対応が毎夜必要。',
      },
      {
        value: 'やや不規則・時々対応必要',
        label: 'やや不規則・時々対応必要',
        score: 1,
        comment: '【観察継続】時々対応が必要。睡眠記録をつけて傾向を把握する。',
        criteria: '週に数回程度、入眠困難や夜間覚醒があり対応が必要なことがある。',
      },
      {
        value: 'ほぼ安定',
        label: 'ほぼ安定',
        score: 2,
        comment: '【良好】睡眠リズムが安定。精神症状の安定にも寄与する重要な要因。',
        criteria: 'ほぼ規則的な睡眠が取れており、夜間の特別対応は不要な状態。',
      },
    ],
  },

  {
    key: 'lt_daytime_activity',
    category: '生活機能',
    item: '日中活動・活動量',
    isInfoOnly: false,
    options: [
      {
        value: 'ほぼ臥床・活動なし',
        label: 'ほぼ臥床・活動なし',
        score: 0,
        comment: '【廃用リスク】長期臥床は廃用症候群・褥瘡リスクを高める。促しと段階的な活動プログラムが必要。',
        criteria: 'ほぼ一日中臥床または室内に籠もり、活動への参加がない。',
      },
      {
        value: '促せば参加・受動的',
        label: '促せば参加・受動的',
        score: 1,
        comment: '【要促し】促しで参加できる。興味・関心を引き出すかかわりを工夫する。',
        criteria: 'スタッフの声かけ・促しがあれば活動に参加するが、自発性は低い。',
      },
      {
        value: '自発的に活動に参加',
        label: '自発的に活動に参加',
        score: 2,
        comment: '【自発的】自発的な活動参加ができている。活動の継続と多様化を支援する。',
        criteria: '声かけなく自ら活動（作業療法・レクリエーション・病棟内作業等）に参加している。',
      },
    ],
  },

  // ===== 対人関係 =====

  {
    key: 'lt_staff_relation',
    category: '対人関係',
    item: 'スタッフとの関係',
    isInfoOnly: false,
    options: [
      {
        value: '拒否・敵対的',
        label: '拒否・敵対的',
        score: 0,
        comment: '【関係構築が最優先】ケア拒否・敵対的態度がある。信頼関係の再構築から始める。担当看護師の固定が有効。',
        criteria: 'スタッフのケアを拒否する、または敵対的・攻撃的な言動が頻回にある。',
      },
      {
        value: '受動的・最低限の関わり',
        label: '受動的・最低限の関わり',
        score: 1,
        comment: '【関係継続】最低限の関わりはある。患者のペースを尊重しながら関係を深める。',
        criteria: '必要最低限のやり取りには応じるが、自発的な会話・関わりは少ない。',
      },
      {
        value: '良好・信頼関係あり',
        label: '良好・信頼関係あり',
        score: 2,
        comment: '【良好】信頼関係が構築されている。この関係性を地域移行の支援基盤として活用する。',
        criteria: 'スタッフとの関係が良好で、相談や感情表出ができる。ケアへの協力もある。',
      },
    ],
  },

  {
    key: 'lt_patient_relation',
    category: '対人関係',
    item: '他患者との関係',
    isInfoOnly: false,
    options: [
      {
        value: 'トラブル頻回・隔離必要',
        label: 'トラブル頻回・隔離必要',
        score: 0,
        comment: '【安全管理優先】他患者とのトラブルが頻回。空間的配慮・隔離など安全管理を最優先に。',
        criteria: '他患者との摩擦・暴言・暴力が頻繁にあり、隔離や居室変更等の対応が必要。',
      },
      {
        value: '時々摩擦あり・対応必要',
        label: '時々摩擦あり・対応必要',
        score: 1,
        comment: '【要介入】時々トラブルが発生。きっかけとなる状況のパターン把握と予防介入を行う。',
        criteria: '月に数回程度、他患者との言語的・身体的トラブルがあり対応が必要。',
      },
      {
        value: '問題なし・良好',
        label: '問題なし・良好',
        score: 2,
        comment: '【良好】他患者との関係に問題なし。グループ活動や交流機会を積極的に提供する。',
        criteria: '他患者との関係が概ね良好で、トラブルはほとんどない。',
      },
    ],
  },

  {
    key: 'lt_family_relation',
    category: '対人関係',
    item: '家族との関係・面会状況',
    isInfoOnly: false,
    options: [
      {
        value: '家族なし・または完全拒絶',
        label: '家族なし・または完全拒絶',
        score: 0,
        comment: '【身寄りなし対応】家族の代替として成年後見・相談支援専門員等の第三者支援体制を構築する。',
        criteria: '身寄りがない、または家族が面会・連絡を完全に拒絶している状態。',
      },
      {
        value: '面会まれ・関係は希薄',
        label: '面会まれ・関係は希薄',
        score: 1,
        comment: '【関係調整】面会が稀で関係が希薄。家族の事情を把握した上で無理のない形での関係維持を支援。',
        criteria: '年数回程度の面会または電話連絡のみ。関係が希薄化している。',
      },
      {
        value: '定期的な面会・関係良好',
        label: '定期的な面会・関係良好',
        score: 2,
        comment: '【良好】定期的な面会で関係良好。家族の意向を地域移行の計画に反映する。',
        criteria: '月1回以上の定期的な面会があり、患者と家族の関係が良好に維持されている。',
      },
    ],
  },

  // ===== 身体状態 =====

  {
    key: 'lt_physical_complication',
    category: '身体状態',
    item: '身体合併症の管理状況',
    isInfoOnly: false,
    options: [
      {
        value: '管理困難・頻回な医療処置必要',
        label: '管理困難・頻回な医療処置必要',
        score: 0,
        comment: '【医療管理必須】頻回な医療処置が必要。多職種での管理体制と地域移行時の医療継続計画が重要。',
        criteria: '身体合併症の管理が困難で、頻繁な処置・観察・医師の介入が必要な状態。',
      },
      {
        value: '定期処置あり・安定管理中',
        label: '定期処置あり・安定管理中',
        score: 1,
        comment: '【安定管理中】定期処置で安定管理中。地域移行後の処置継続体制を早期から計画する。',
        criteria: '定期的な処置（創処置・注射等）はあるが、状態は概ね安定している。',
      },
      {
        value: '合併症なし・または外来管理で十分',
        label: '合併症なし・または外来管理で十分',
        score: 2,
        comment: '【良好】身体合併症の問題なし、または外来通院レベルで管理可能。',
        criteria: '身体合併症がない、または軽微で外来管理のみで対応できる状態。',
      },
    ],
  },

  {
    key: 'lt_fall_risk',
    category: '身体状態',
    item: '運動機能・転倒リスク',
    isInfoOnly: false,
    options: [
      {
        value: '高リスク：転倒歴あり・常時見守り必要',
        label: '高リスク：転倒歴あり・常時見守り必要',
        score: 0,
        comment: '【転倒予防最優先】転倒歴あり・常時見守り必要。環境整備・リハビリ・薬剤見直しを検討。',
        criteria: '過去に転倒歴があり、現在も常時見守りが必要な運動機能の低下がある。',
      },
      {
        value: '中リスク：環境調整・一部介助で対応',
        label: '中リスク：環境調整・一部介助で対応',
        score: 1,
        comment: '【環境整備で対応】環境調整と一部介助で対応可能。段差除去・手すり設置等を検討。',
        criteria: '環境整備や一部介助があれば転倒なく移動できる。転倒リスクは中程度。',
      },
      {
        value: '低リスク：自立歩行可能',
        label: '低リスク：自立歩行可能',
        score: 2,
        comment: '【良好】自立歩行可能。運動機能の維持・向上のため定期的な活動を継続する。',
        criteria: '介助なく安全に歩行でき、転倒リスクは低い。',
      },
    ],
  },

  {
    key: 'lt_weight_metabolism',
    category: '身体状態',
    item: '体重・代謝',
    isInfoOnly: false,
    options: [
      {
        value: '著しい異常：介入が必要な状態',
        label: '著しい異常：介入が必要な状態',
        score: 0,
        comment: '【医療的介入必要】著しい体重異常または代謝異常あり。栄養科・内科と連携した介入が必要。',
        criteria: '著しい体重増加・減少、または血糖・脂質等の代謝異常で医学的介入が必要な状態。',
      },
      {
        value: '要観察：経過モニタリング中',
        label: '要観察：経過モニタリング中',
        score: 1,
        comment: '【継続観察】経過モニタリング中。定期的な測定と食事・運動指導を継続。',
        criteria: '軽度の体重変化や代謝異常があり、経過観察・モニタリングが継続されている。',
      },
      {
        value: '安定：問題なし',
        label: '安定：問題なし',
        score: 2,
        comment: '【良好】体重・代謝ともに安定。抗精神病薬による代謝異常の定期チェックを継続。',
        criteria: '体重・血糖・脂質等の代謝指標が概ね安定しており、特別な介入は不要。',
      },
    ],
  },

  {
    key: 'lt_aspiration_risk',
    category: '身体状態',
    item: '窒息リスク',
    isInfoOnly: false,
    options: [
      {
        value: '高：嚥下障害あり・刻み食/とろみ必要',
        label: '高：嚥下障害あり・刻み食/とろみ必要',
        score: 0,
        comment: '【誤嚥性肺炎リスク高】嚥下障害あり。食形態の調整・食事時の観察・嚥下リハビリを徹底する。',
        criteria: '嚥下障害があり、食形態の調整（刻み食・とろみ等）が必要。誤嚥・窒息リスクが高い。',
      },
      {
        value: '中：早食い・丸呑み傾向あり・見守り必要',
        label: '中：早食い・丸呑み傾向あり・見守り必要',
        score: 1,
        comment: '【要見守り】早食い・丸呑み傾向あり。食事中の見守りとペース調整の声かけを継続する。',
        criteria: '嚥下障害はないが、早食い・丸呑みの傾向があり食事中の見守りが必要。',
      },
      {
        value: '低：問題なし',
        label: '低：問題なし',
        score: 2,
        comment: '【良好】窒息リスクは低い。加齢に伴う嚥下機能の変化を定期的に確認する。',
        criteria: '嚥下機能に問題なく、通常の食事形態で安全に食事できている。',
      },
    ],
  },

  // ===== 看護師の患者理解度（高得点＝理解度が高い）=====

  {
    key: 'lt_life_history_knowledge',
    category: '看護師の患者理解度',
    item: '生活史・入院前背景の把握',
    isInfoOnly: false,
    options: [
      {
        value: 'ほとんど知らない',
        label: 'ほとんど知らない',
        score: 0,
        comment: '【情報収集が急務】生活史の把握は個別ケアの基盤。本人・家族からの収集、記録の見直しを実施する。',
        criteria: '患者の入院前の生活・職歴・家族背景等をほとんど把握できていない。',
      },
      {
        value: '概要は知っている',
        label: '概要は知っている',
        score: 1,
        comment: '【継続把握】概要は把握できている。さらに詳細な情報を収集してケアに活かす。',
        criteria: '入院前の概要（疾患歴・家族構成程度）は把握できているが、詳細は不明。',
      },
      {
        value: '詳細に把握・説明できる',
        label: '詳細に把握・説明できる',
        score: 2,
        comment: '【高い理解度】詳細な生活史を把握。この理解を新人スタッフや引継ぎに活かす。',
        criteria: '患者の生活史・入院前背景を詳細に把握し、他のスタッフに説明できる。',
      },
    ],
  },

  {
    key: 'lt_symptom_pattern_knowledge',
    category: '看護師の患者理解度',
    item: '患者特有の症状パターンの把握',
    isInfoOnly: false,
    options: [
      {
        value: '把握できていない',
        label: '把握できていない',
        score: 0,
        comment: '【要アセスメント】症状パターンの把握は早期介入の基礎。観察・記録の積み重ねから始める。',
        criteria: 'この患者特有の症状の出現パターン・前兆・回復過程が把握できていない。',
      },
      {
        value: 'おおよそ分かる',
        label: 'おおよそ分かる',
        score: 1,
        comment: '【継続把握】概ね分かっている。前兆から回復過程までの詳細把握を目指す。',
        criteria: '大まかな症状パターンは分かっているが、前兆サインや回復の見通しは不確か。',
      },
      {
        value: '前兆から回復まで説明できる',
        label: '前兆から回復まで説明できる',
        score: 2,
        comment: '【優秀】前兆から回復まで説明できる。この知識をケアプランと申し送りに記録・共有する。',
        criteria: '症状の前兆サイン・増悪経過・回復プロセスを明確に把握し説明できる。',
      },
    ],
  },

  {
    key: 'lt_values_knowledge',
    category: '看護師の患者理解度',
    item: '患者の価値観・好みの把握',
    isInfoOnly: false,
    options: [
      {
        value: 'ほとんど知らない',
        label: 'ほとんど知らない',
        score: 0,
        comment: '【個別性なし】好みや価値観が不明ではパーソンセンタードケアが難しい。日々の関わりから意図的に把握する。',
        criteria: 'この患者の好み・趣味・大切にしていること等をほとんど把握できていない。',
      },
      {
        value: 'いくつか知っている',
        label: 'いくつか知っている',
        score: 1,
        comment: '【継続把握】いくつかは把握できている。さらに深めてケアに反映させる。',
        criteria: '患者の好みや関心事をいくつかは把握しているが、深い理解にはまだ至っていない。',
      },
      {
        value: '深く理解・ケアに活かせている',
        label: '深く理解・ケアに活かせている',
        score: 2,
        comment: '【高い個別性】患者の価値観を深く理解し、ケアに反映できている。この理解をチームで共有する。',
        criteria: '患者の価値観・好みを深く理解し、日々のケア計画や関わりに具体的に活かしている。',
      },
    ],
  },

  {
    key: 'lt_trust_depth',
    category: '看護師の患者理解度',
    item: '信頼関係の深さ',
    isInfoOnly: false,
    options: [
      {
        value: '関係が築けていない',
        label: '関係が築けていない',
        score: 0,
        comment: '【関係構築最優先】信頼関係がない状態。安全・安心を基盤にした関わりから再構築する。',
        criteria: '患者との信頼関係が構築できておらず、ケアへの抵抗・拒否が続いている。',
      },
      {
        value: '最低限の関係はある',
        label: '最低限の関係はある',
        score: 1,
        comment: '【関係継続】最低限の関係はある。患者のペースを尊重しながら関係を深める努力を継続。',
        criteria: '必要最低限のやり取りや協力関係はあるが、深い信頼関係には至っていない。',
      },
      {
        value: '患者が自発的に話しかけてくる',
        label: '患者が自発的に話しかけてくる',
        score: 2,
        comment: '【深い信頼関係】患者が自発的に話しかける関係。この関係を長期療養ケアの核心として大切にする。',
        criteria: '患者が自発的に悩みや気持ちを話しかけてくる、深い信頼関係が構築されている。',
      },
    ],
  },

  {
    key: 'lt_change_sign_confidence',
    category: '看護師の患者理解度',
    item: '微細な変化サインを読める自信',
    isInfoOnly: false,
    options: [
      {
        value: '全く自信がない',
        label: '全く自信がない',
        score: 0,
        comment: '【観察力強化が必要】変化サインを読む力は経験と知識の蓄積から育つ。先輩からの指導と事例学習を積む。',
        criteria: 'この患者の微細な変化（表情・言動・行動）を早期に気づく自信が全くない。',
      },
      {
        value: 'なんとなく気づける',
        label: 'なんとなく気づける',
        score: 1,
        comment: '【継続観察】なんとなく気づける段階。根拠を言語化する練習を積んで確信に近づける。',
        criteria: '何か変だと感じることはあるが、具体的な根拠を言語化するのが難しい。',
      },
      {
        value: '確信を持って早期に気づける',
        label: '確信を持って早期に気づける',
        score: 2,
        comment: '【高い観察力】確信を持って早期に気づける。この観察力を記録・申し送りで共有して組織の力にする。',
        criteria: 'この患者の微細な変化に確信を持って早期に気づき、具体的な根拠を説明できる。',
      },
    ],
  },

  // ===== 地域移行の可能性 =====

  {
    key: 'lt_discharge_will',
    category: '地域移行の可能性',
    item: '退院意欲（本人）',
    isInfoOnly: false,
    options: [
      {
        value: 'なし・または意思表示不能',
        label: 'なし・または意思表示不能',
        score: 0,
        comment: '【長期入院リスク】退院意欲がない、または意思表示できない。退院を強制せず、まず「院内での豊かな生活」を目指す。',
        criteria: '退院について「したくない」と明示、または意思疎通困難で意向が確認できない。',
      },
      {
        value: '曖昧・時々話題にする',
        label: '曖昧・時々話題にする',
        score: 1,
        comment: '【可能性あり】曖昧だが時々話題にする。退院後の生活への不安を一緒に整理する支援が有効。',
        criteria: '退院について時々口にするが、具体的な希望や計画はなく揺らぎがある。',
      },
      {
        value: 'あり・具体的に希望している',
        label: 'あり・具体的に希望している',
        score: 2,
        comment: '【退院支援の好機】具体的な希望がある。意欲を尊重し、現実的な退院計画を一緒に立てる。',
        criteria: '退院を具体的に希望しており、退院後の生活についてイメージを持って話せる。',
      },
    ],
  },

  {
    key: 'lt_family_acceptance',
    category: '地域移行の可能性',
    item: '家族の受け入れ状況',
    isInfoOnly: false,
    options: [
      {
        value: '拒否・または家族なし',
        label: '拒否・または家族なし',
        score: 0,
        comment: '【代替支援体制が必要】家族に頼れない場合はGH・支援付き住居・成年後見等の社会資源で代替体制を構築する。',
        criteria: '家族が受け入れを拒否、または身寄りがない状態。',
      },
      {
        value: '消極的・条件付き',
        label: '消極的・条件付き',
        score: 1,
        comment: '【調整が必要】消極的または条件付きの受け入れ。家族の不安・条件を丁寧に聴き取り、支援で補完できる部分を示す。',
        criteria: '家族は受け入れを完全には拒否していないが、消極的・条件付きの姿勢がある。',
      },
      {
        value: '積極的・受け入れ体制あり',
        label: '積極的・受け入れ体制あり',
        score: 2,
        comment: '【強力な支援基盤】家族の積極的受け入れは最大の強み。家族の負担を適切に評価し過剰負担にならないよう注意する。',
        criteria: '家族が積極的に受け入れを表明しており、退院後の生活を共に支える体制がある。',
      },
    ],
  },
];

// ===== ユーティリティ =====

export const LONG_TERM_SCORED_ITEMS = LONG_TERM_MASTER_DATA.filter(item => !item.isInfoOnly);

/** カテゴリ別に項目をグループ化 */
export const LONG_TERM_ITEMS_BY_CATEGORY = LONG_TERM_CATEGORIES.reduce<Record<string, EvaluationItem[]>>(
  (acc, category) => {
    acc[category] = LONG_TERM_MASTER_DATA.filter(item => item.category === category);
    return acc;
  },
  {}
);

/** 最大スコア（実データから計算）*/
export const LONG_TERM_MAX_SCORE = LONG_TERM_SCORED_ITEMS.reduce((sum, item) => {
  const max = Math.max(...item.options.map(o => o.score ?? 0));
  return sum + max;
}, 0);

/** 判定コメント */
export function getLongTermJudgment(totalScore: number): {
  level: 'low' | 'mid' | 'high';
  text: string;
} {
  const third = Math.floor(LONG_TERM_MAX_SCORE / 3);
  if (totalScore <= third) {
    return {
      level: 'low',
      text: '集中ケアフェーズ／複数の領域で重大な課題あり／安全確保と基本的ケアの安定化が最優先',
    };
  }
  if (totalScore <= third * 2) {
    return {
      level: 'mid',
      text: '継続ケア必要／主要課題への集中的介入を継続しながら生活の質向上を目指す',
    };
  }
  return {
    level: 'high',
    text: '地域移行検討可能／状態が安定しており、地域移行に向けた具体的な計画立案が可能',
  };
}
