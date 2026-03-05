// Excelの「Master」シートを完全移植
// 退院支援補助アプリ4.0完成版.xlsm → TypeScript定数

export interface EvaluationOption {
  value: string;
  label: string;
  score: number | null; // null = 情報項目（点数対象外）
  comment: string;
  criteria: string;
  isUnknown?: boolean;
}

export interface EvaluationItem {
  key: string;
  category: string;
  item: string;
  isInfoOnly: boolean; // 点数対象外フラグ
  options: EvaluationOption[];
}

export const CATEGORY_COLORS: Record<string, string> = {
  '属性':       'var(--accent-green)',
  '精神症状':   'var(--accent-cyan)',
  '認知・判断力': 'var(--accent-purple)',
  'ADL':       'var(--accent-blue)',
  '服薬管理':   'var(--accent-orange)',
  '生活スキル': 'var(--accent-yellow)',
  '家族支援':   'var(--accent-pink)',
  '社会資源':   'var(--accent-teal)',
  '経済・制度': 'var(--accent-red)',
};

export const CATEGORIES = [
  '属性',
  '精神症状',
  '認知・判断力',
  'ADL',
  '服薬管理',
  '生活スキル',
  '家族支援',
  '社会資源',
  '経済・制度',
] as const;

export type CategoryName = typeof CATEGORIES[number];

const UNKNOWN_OPTION: EvaluationOption = {
  value: '不明',
  label: '不明',
  score: 0,
  comment: '要確認',
  criteria: '',
  isUnknown: true,
};

const INFO_UNKNOWN_OPTION: EvaluationOption = {
  value: '不明',
  label: '不明',
  score: null,
  comment: '要確認',
  criteria: '',
  isUnknown: true,
};

export const MASTER_DATA: EvaluationItem[] = [

  // ===== 属性（全項目 isInfoOnly=true）=====

  {
    key: 'age',
    category: '属性',
    item: '年齢',
    isInfoOnly: true,
    options: [
      {
        value: '〜29歳',
        label: '〜29歳',
        score: null,
        comment: '若年層：社会資源豊富で地域移行しやすい',
        criteria: '単身生活・就労支援の活用が現実的',
      },
      {
        value: '30〜44歳',
        label: '30〜44歳',
        score: null,
        comment: '若年〜中年：地域移行可能',
        criteria: '就労/自立支援の併用で生活設計が可能',
      },
      {
        value: '45〜64歳',
        label: '45〜64歳',
        score: null,
        comment: '中年期：資源は減るが生活は可能',
        criteria: '就労資源は限定的だが支援の組合せで可',
      },
      {
        value: '65〜74歳',
        label: '65〜74歳',
        score: null,
        comment: '高齢移行期：介護保険併用が必要',
        criteria: '介護サービス前提で生活設計',
      },
      {
        value: '75歳以上',
        label: '75歳以上',
        score: null,
        comment: '高齢：介護領域の施設検討が優位',
        criteria: '特養/老健/介護医療院の選択が現実的',
      },
    ],
  },

  {
    key: 'gender',
    category: '属性',
    item: '性別',
    isInfoOnly: true,
    options: [
      {
        value: '男性',
        label: '男性',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: '女性',
        label: '女性',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
    ],
  },

  {
    key: 'mainDisease',
    category: '属性',
    item: '主疾患',
    isInfoOnly: true,
    options: [
      {
        value: '統合失調症',
        label: '統合失調症',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: '双極性障害',
        label: '双極性障害',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: 'うつ病',
        label: 'うつ病',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: '知的障害',
        label: '知的障害',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: '自閉スペクトラム症',
        label: '自閉スペクトラム症',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: 'アルコール関連障害',
        label: 'アルコール関連障害',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: '認知症',
        label: '認知症',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      {
        value: 'その他',
        label: 'その他',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '評価点には反映しない',
      },
      { ...INFO_UNKNOWN_OPTION },
    ],
  },

  // ===== 精神症状 =====

  {
    key: 'complication',
    category: '精神症状',
    item: '合併症・医療ケア',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '高度',
        label: '高度',
        score: 0,
        comment: '医療的ケア量が多く地域生活は困難',
        criteria: '吸引/在宅酸素/胃瘻/頻回処置が必要',
      },
      {
        value: '中等度',
        label: '中等度',
        score: 1,
        comment: '支援があれば地域生活可能',
        criteria: '定期処置あり（褥瘡処置、インスリン等）',
      },
      {
        value: 'なし',
        label: 'なし',
        score: 3,
        comment: '医療的ケア不要、退院に支障なし',
        criteria: '外来受診と服薬管理で対応可能',
      },
    ],
  },

  {
    key: 'hallucination',
    category: '精神症状',
    item: '幻覚・妄想',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '強い',
        label: '強い',
        score: 0,
        comment: '症状が持続・悪化し地域生活は困難',
        criteria: '連日出現/現実検討不能/安静保持困難',
      },
      {
        value: '軽度',
        label: '軽度',
        score: 1,
        comment: '症状はあるが軽度、支援次第で安定可能',
        criteria: '週1回程度/服薬で改善可能',
      },
      {
        value: 'なし',
        label: 'なし',
        score: 3,
        comment: '症状は安定し退院後の生活に支障なし',
        criteria: '長期間寛解状態',
      },
    ],
  },

  {
    key: 'moodStability',
    category: '精神症状',
    item: '気分・情緒安定',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不安定',
        label: '不安定',
        score: 0,
        comment: '気分変動が激しく退院後も支援必須',
        criteria: '1週間以内に急変が複数回/自傷念慮あり',
      },
      {
        value: 'やや不安定',
        label: 'やや不安定',
        score: 1,
        comment: '軽度の不安定あり、環境調整で安定可能',
        criteria: '月1〜2回の変動/支援下で安定',
      },
      {
        value: '安定',
        label: '安定',
        score: 3,
        comment: '情緒安定しており地域生活に支障なし',
        criteria: '3ヶ月以上安定',
      },
    ],
  },

  {
    key: 'selfHarmRisk',
    category: '精神症状',
    item: '自傷・他害リスク',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '高',
        label: '高',
        score: 0,
        comment: '重大リスクあり、地域生活は困難',
        criteria: '直近1ヶ月で暴力/自傷行為あり、制止困難',
      },
      {
        value: '中',
        label: '中',
        score: 1,
        comment: '環境次第でコントロール可能',
        criteria: '半年以内に行動問題あり/環境調整で軽減',
      },
      {
        value: '低',
        label: '低',
        score: 2,
        comment: '稀に小規模なトラブル',
        criteria: '年1〜2回程度の小規模トラブル',
      },
      {
        value: 'なし',
        label: 'なし',
        score: 3,
        comment: 'リスクなく退院に支障なし',
        criteria: '1年以上問題なし/行動制限不要',
      },
    ],
  },

  // ===== 認知・判断力 =====

  {
    key: 'memoryOrientation',
    category: '認知・判断力',
    item: '記憶・見当識',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '障害あり',
        label: '障害あり',
        score: 0,
        comment: '記憶・見当識に障害、地域生活は困難',
        criteria: '時間/場所の見当識欠如、記憶障害',
      },
      {
        value: '一部保持',
        label: '一部保持',
        score: 1,
        comment: '一部保たれるが支援必須',
        criteria: '日常範囲はフォローあれば対応可',
      },
      {
        value: '問題なし',
        label: '問題なし',
        score: 3,
        comment: '記憶・見当識に問題なし',
        criteria: '自立生活に支障なし',
      },
    ],
  },

  {
    key: 'decisionMaking',
    category: '認知・判断力',
    item: '判断力',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '困難',
        label: '困難',
        score: 0,
        comment: '判断力欠如、単身生活は不可能',
        criteria: '危険判断不可/金銭・契約理解不能',
      },
      {
        value: '一部可能',
        label: '一部可能',
        score: 1,
        comment: '一部判断可能、支援必須',
        criteria: '日常判断は可だが重要判断は不可',
      },
      {
        value: '可能',
        label: '可能',
        score: 3,
        comment: '判断力あり、地域生活に支障なし',
        criteria: '自己決定とリスク判断が可能',
      },
    ],
  },

  // ===== ADL =====

  {
    key: 'mobility',
    category: 'ADL',
    item: '移動',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '介護量が多く退院先は介護施設中心',
        criteria: '常時介助が必要',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        comment: 'サポートがあれば地域生活可能',
        criteria: '部分的な介助が必要',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: 'ADL自立、地域生活に支障なし',
        criteria: '自立して実施可能',
      },
    ],
  },

  {
    key: 'eating',
    category: 'ADL',
    item: '食事',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '介護量が多く退院先は介護施設中心',
        criteria: '常時介助が必要',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        comment: 'サポートがあれば地域生活可能',
        criteria: '部分的な介助が必要',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: 'ADL自立、地域生活に支障なし',
        criteria: '自立して実施可能',
      },
    ],
  },

  {
    key: 'toileting',
    category: 'ADL',
    item: '排泄',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '介護量が多く退院先は介護施設中心',
        criteria: '常時介助が必要',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        comment: 'サポートがあれば地域生活可能',
        criteria: '部分的な介助が必要',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: 'ADL自立、地域生活に支障なし',
        criteria: '自立して実施可能',
      },
    ],
  },

  {
    key: 'bathing',
    category: 'ADL',
    item: '入浴・清潔',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '全介助',
        label: '全介助',
        score: 0,
        comment: '介護量が多く退院先は介護施設中心',
        criteria: '常時介助が必要',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        comment: 'サポートがあれば地域生活可能',
        criteria: '部分的な介助が必要',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: 'ADL自立、地域生活に支障なし',
        criteria: '自立して実施可能',
      },
    ],
  },

  // ===== 服薬管理 =====

  {
    key: 'medicationUnderstanding',
    category: '服薬管理',
    item: '服薬理解',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不可',
        label: '不可',
        score: 0,
        comment: '薬の理解なし、自己管理は困難',
        criteria: '目的/用量/副作用の理解がない',
      },
      {
        value: '一部理解',
        label: '一部理解',
        score: 1,
        comment: '説明下で概ね理解、練習継続必要',
        criteria: '反復説明で理解可',
      },
      {
        value: '理解あり',
        label: '理解あり',
        score: 3,
        comment: '十分理解し自己管理に活かせる',
        criteria: '副作用時の受診判断も可',
      },
    ],
  },

  {
    key: 'medicationAdherence',
    category: '服薬管理',
    item: '服薬実行',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不可',
        label: '不可',
        score: 0,
        comment: '自己管理不能、訪問看護必須',
        criteria: '準備・内服ともに全介助',
      },
      {
        value: '見守りで可',
        label: '見守りで可',
        score: 1,
        comment: '支援下で一部可能、練習継続必要',
        criteria: '見守りがあれば実行可能',
      },
      {
        value: '自己管理可',
        label: '自己管理可',
        score: 3,
        comment: '自己管理可能、地域生活に支障なし',
        criteria: '整理・記録・継続が可能',
      },
    ],
  },

  // ===== 生活スキル =====

  {
    key: 'moneyManagement',
    category: '生活スキル',
    item: '金銭管理',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不可',
        label: '不可',
        score: 0,
        comment: '金銭管理不可、地域生活は困難',
        criteria: '浪費/詐欺被害リスク高',
      },
      {
        value: '部分可',
        label: '部分可',
        score: 1,
        comment: '部分的に管理可能、支援必須',
        criteria: '少額は可/家計は支援必要',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: '金銭管理可能、地域生活に支障なし',
        criteria: '生活費全般を管理可能',
      },
    ],
  },

  {
    key: 'mealPreparation',
    category: '生活スキル',
    item: '食事準備',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不可',
        label: '不可',
        score: 0,
        comment: '自炊不可、支援体制が必要',
        criteria: '調理器具の安全使用不可',
      },
      {
        value: '部分可',
        label: '部分可',
        score: 1,
        comment: '簡単な準備は可能、支援必要',
        criteria: 'レンジ調理・配食活用で可',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: '自炊可能、衛生面も管理可',
        criteria: '献立・調理・片付けまで可',
      },
    ],
  },

  {
    key: 'shopping',
    category: '生活スキル',
    item: '買い物',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不可',
        label: '不可',
        score: 0,
        comment: '一人での買い物が困難',
        criteria: '計画立案・会計ができない',
      },
      {
        value: '部分可',
        label: '部分可',
        score: 1,
        comment: '支援やメモがあれば可能',
        criteria: '同行・見守りで可',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        comment: '計画的に買い物ができる',
        criteria: '予算内で必要物品を購入可能',
      },
    ],
  },

  {
    key: 'clinicVisit',
    category: '生活スキル',
    item: '通院',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '不可',
        label: '不可',
        score: 0,
        comment: '通院不可、自立困難',
        criteria: '予約/移動/受付ができない',
      },
      {
        value: '同行必要',
        label: '同行必要',
        score: 1,
        comment: '同行あれば通院可能',
        criteria: '家族/支援員同行で可',
      },
      {
        value: '単独可',
        label: '単独可',
        score: 3,
        comment: '単独通院可能、地域生活に支障なし',
        criteria: '予約・受診・服薬指導に自力対応',
      },
    ],
  },

  // ===== 家族支援 =====

  {
    key: 'familyAcceptance',
    category: '家族支援',
    item: '家族の受け入れ姿勢',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '拒否',
        label: '拒否',
        score: 0,
        comment: '家族支援ゼロ、退院困難',
        criteria: '面会拒否・同居拒否',
      },
      {
        value: '消極的',
        label: '消極的',
        score: 1,
        comment: '関わりあるが協力困難',
        criteria: '連絡は取れるが支援は難しい',
      },
      {
        value: '条件付き',
        label: '条件付き',
        score: 2,
        comment: '一部協力あり（介護分担など）',
        criteria: '役割分担の合意あり',
      },
      {
        value: '積極的',
        label: '積極的',
        score: 3,
        comment: '家族積極支援あり、退院後も安定可能',
        criteria: '継続支援の意思と体制あり',
      },
    ],
  },

  {
    key: 'keyPerson',
    category: '家族支援',
    item: 'キーパーソンの有無',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '無',
        label: '無',
        score: 0,
        comment: '意思決定・支援の中心者が不在',
        criteria: '支援会議に継続参加できる人がいない',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        comment: '要確認',
        criteria: '親族・支援者の調整中',
      },
      {
        value: 'あり',
        label: 'あり',
        score: 3,
        comment: '支援の中心者が明確で円滑',
        criteria: '同意形成・連絡調整が迅速に可能',
      },
    ],
  },

  // ===== 社会資源 =====

  {
    key: 'disabilityLevel',
    category: '社会資源',
    item: '障害支援区分',
    isInfoOnly: true,
    options: [
      { ...INFO_UNKNOWN_OPTION },
      {
        value: '未取得',
        label: '未取得',
        score: null,
        comment: '未整備のためサービス利用に制約',
        criteria: '区分未申請/不明',
      },
      {
        value: '申請中',
        label: '申請中',
        score: null,
        comment: '受給見込みあり',
        criteria: '申請・審査進行中',
      },
      {
        value: '区分1',
        label: '区分1',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '区分1：時々支援',
      },
      {
        value: '区分2',
        label: '区分2',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '区分2：毎日いくつかの場面で支援',
      },
      {
        value: '区分3',
        label: '区分3',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '区分3：生活の多くで継続支援',
      },
      {
        value: '区分4',
        label: '区分4',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '区分4：ほぼ常時の見守り・複数介助',
      },
      {
        value: '区分5',
        label: '区分5',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '区分5：終日介護レベル',
      },
      {
        value: '区分6',
        label: '区分6',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '区分6：最重度の支援量',
      },
    ],
  },

  {
    key: 'careLevel',
    category: '社会資源',
    item: '要介護度',
    isInfoOnly: true,
    options: [
      { ...INFO_UNKNOWN_OPTION },
      {
        value: '非該当',
        label: '非該当',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '介護保険非該当：介護保険の支援は原則不要（自立）',
      },
      {
        value: '要支援1',
        label: '要支援1',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要支援1：IADL中心に助言・見守りがときどき必要',
      },
      {
        value: '要支援2',
        label: '要支援2',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要支援2：IADL＋一部ADLに日常的な支援が必要',
      },
      {
        value: '要介護1',
        label: '要介護1',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要介護1：歩行・排泄・入浴で一部介助、見守り頻回',
      },
      {
        value: '要介護2',
        label: '要介護2',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要介護2：複数ADLで部分介助、継続的支援が必要',
      },
      {
        value: '要介護3',
        label: '要介護3',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要介護3：移乗・排泄・入浴に相当介助、屋内移動も支援',
      },
      {
        value: '要介護4',
        label: '要介護4',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要介護4：多くのADLで全面介助、常時見守りが必要',
      },
      {
        value: '要介護5',
        label: '要介護5',
        score: null,
        comment: '情報項目（点数対象外）',
        criteria: '要介護5：ほぼ全介助、臥床中心・医療連携が前提',
      },
    ],
  },

  {
    key: 'availableResources',
    category: '社会資源',
    item: '利用可能資源',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '無',
        label: '無',
        score: 0,
        comment: '地域サービスの利用予定なし',
        criteria: '訪看/訪介/通所/就労等の利用予定なし',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        comment: '一部は利用見込',
        criteria: '一部サービスを調整中',
      },
      {
        value: 'あり',
        label: 'あり',
        score: 3,
        comment: '複数サービスを計画的に利用見込',
        criteria: '訪看/訪介/通所/就労等の利用計画あり',
      },
    ],
  },

  {
    key: 'housingCandidate',
    category: '社会資源',
    item: '居住候補',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '無',
        label: '無',
        score: 0,
        comment: '住まい候補なし、退院調整困難',
        criteria: 'GH/施設/住居候補がない',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        comment: '候補あり、今後の調整次第',
        criteria: '見学・申込中',
      },
      {
        value: 'あり',
        label: 'あり',
        score: 3,
        comment: '住まい候補あり、退院可能性高い',
        criteria: '受入確定または内定',
      },
    ],
  },

  // ===== 経済・制度 =====

  {
    key: 'income',
    category: '経済・制度',
    item: '収入',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '無',
        label: '無',
        score: 0,
        comment: '収入なし、退院困難',
        criteria: '無収入/支援未整備',
      },
      {
        value: '生活保護・受給中',
        label: '生活保護・受給中',
        score: 1,
        comment: '最低限の生活基盤あり',
        criteria: '申請済み/受給見込',
      },
      {
        value: '年金・給与あり',
        label: '年金・給与あり',
        score: 3,
        comment: '安定した収入あり、退院可能',
        criteria: '継続的な収入あり',
      },
    ],
  },

  {
    key: 'systemUtilization',
    category: '経済・制度',
    item: '制度利用',
    isInfoOnly: false,
    options: [
      { ...UNKNOWN_OPTION },
      {
        value: '未申請',
        label: '未申請',
        score: 0,
        comment: '制度未整備で退院困難',
        criteria: '障害者手帳/自立支援/介護保険など未申請',
      },
      {
        value: '申請中',
        label: '申請中',
        score: 1,
        comment: '今後の整備次第で可',
        criteria: '申請・更新手続き中',
      },
      {
        value: '利用中',
        label: '利用中',
        score: 3,
        comment: '制度整備済みで退院可能',
        criteria: '手帳/自立支援/介護保険等が有効',
      },
    ],
  },
];

// ===== ユーティリティ =====

/** 採点対象の全項目（isInfoOnly=false）*/
export const SCORED_ITEMS = MASTER_DATA.filter(item => !item.isInfoOnly);

/** 最大スコア = 22項目 × 3点 = 66点 */
export const MAX_SCORE = 66;

/** カテゴリ別に項目をグループ化 */
export const ITEMS_BY_CATEGORY = CATEGORIES.reduce<Record<string, EvaluationItem[]>>(
  (acc, category) => {
    acc[category] = MASTER_DATA.filter(item => item.category === category);
    return acc;
  },
  {}
);

/** 判定コメント（スコアレンジ → 判定テキスト） */
export function getJudgment(totalScore: number): {
  level: 'low' | 'mid' | 'high';
  text: string;
} {
  if (totalScore <= 22) {
    return {
      level: 'low',
      text: '集中支援フェーズ／生活全般に重大な課題／施設入所を検討',
    };
  }
  if (totalScore <= 44) {
    return {
      level: 'mid',
      text: '退院に向けた支援継続が必要／重点課題への集中的介入を',
    };
  }
  return {
    level: 'high',
    text: '退院調整可能／地域移行に向けた具体的計画を進める',
  };
}
