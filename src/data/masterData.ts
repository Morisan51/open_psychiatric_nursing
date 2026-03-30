// Excelの「Master」シートを完全移植
// 退院支援補助ツール_v5_現場実装版.xlsx → TypeScript定数

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
        criteria: '単身生活・就労支援の活用が現実的',
        comment: '若年層：社会資源豊富で地域移行しやすい',
      },
      {
        value: '30〜44歳',
        label: '30〜44歳',
        score: null,
        criteria: '就労/自立支援の併用で生活設計が可能',
        comment: '若年〜中年：地域移行可能',
      },
      {
        value: '45〜64歳',
        label: '45〜64歳',
        score: null,
        criteria: '就労資源は限定的だが支援の組合せで可',
        comment: '中年期：資源は減るが生活は可能',
      },
      {
        value: '65〜74歳',
        label: '65〜74歳',
        score: null,
        criteria: '介護サービス前提で生活設計',
        comment: '高齢移行期：介護保険併用が必要',
      },
      {
        value: '75歳以上',
        label: '75歳以上',
        score: null,
        criteria: '特養/老健/介護医療院の選択が現実的',
        comment: '高齢：介護領域の施設検討が優位',
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
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '女性',
        label: '女性',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
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
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '双極性障害',
        label: '双極性障害',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: 'うつ病',
        label: 'うつ病',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '知的障害',
        label: '知的障害',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '自閉スペクトラム症',
        label: '自閉スペクトラム症',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: 'アルコール関連障害',
        label: 'アルコール関連障害',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '認知症',
        label: '認知症',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
      },
      {
        value: 'その他',
        label: 'その他',
        score: null,
        criteria: '評価点には反映しない',
        comment: '情報項目（点数対象外）',
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
        criteria: '吸引・在宅酸素・胃瘻・ストーマ・頻回採血のいずれかが日常的に必要',
        comment: '訪問診療＋訪問看護の体制確保が退院の前提条件',
      },
      {
        value: '中等度',
        label: '中等度',
        score: 1,
        criteria: 'インスリン自己注射・褥瘡処置・バルーン管理など、週1回以上の定期処置あり',
        comment: '訪問看護週1回以上＋かかりつけ医との連携で地域生活可能',
      },
      {
        value: 'なし',
        label: 'なし',
        score: 3,
        criteria: '処置不要。外来受診（月1〜2回）と内服管理のみで完結',
        comment: '外来通院と自己管理で対応可。医療的障壁なし',
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
        criteria: '直近1週間で毎日出現／対話・指示が通らない／独語・空笑が頻回で日課に参加不能',
        comment: '症状コントロール優先。退院支援は薬物調整後に再評価',
      },
      {
        value: '軽度',
        label: '軽度',
        score: 1,
        criteria: '週1〜2回出現するが自分で「幻聴だ」と認識できる／服薬で数時間以内に軽減',
        comment: '症状残存するが生活への影響限定的。外来フォロー体制を確保',
      },
      {
        value: 'なし',
        label: 'なし',
        score: 3,
        criteria: '直近3ヶ月以上、幻覚・妄想の訴え・観察所見なし',
        comment: '精神症状面での退院障壁なし',
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
        criteria: '直近1週間で急激な気分変動2回以上／希死念慮の表出あり／号泣・激昂で日課中断',
        comment: '気分安定化が最優先課題。薬物調整・環境調整を継続',
      },
      {
        value: 'やや不安定',
        label: 'やや不安定',
        score: 1,
        criteria: '月1〜2回の落ち込み・イライラあるが、スタッフの声かけ30分以内で回復',
        comment: '変動はあるが声かけ・環境調整で回復。退院後の支援頻度を検討',
      },
      {
        value: '安定',
        label: '安定',
        score: 3,
        criteria: '直近3ヶ月、気分変動による日課中断・対人トラブルなし',
        comment: '気分面での退院障壁なし',
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
        criteria: '直近1ヶ月以内に自傷行為（切傷・過量服薬等）または他者への暴力あり／身体拘束・隔離歴あり',
        comment: '安全確保が最優先。行動制限解除のステップを段階的に計画',
      },
      {
        value: '中',
        label: '中',
        score: 1,
        criteria: '直近6ヶ月以内に物を投げる・壁を叩く等の行動あり／環境調整（個室・人員配置）で軽減',
        comment: 'リスク残存。退院後の危機介入プラン（連絡先・対処手順）を事前策定',
      },
      {
        value: '低',
        label: '低',
        score: 2,
        criteria: '年1〜2回の口論・軽微な物品破損程度。他者への身体的接触なし',
        comment: '大きなリスクなし。通常の外来フォローで対応可',
      },
      {
        value: 'なし',
        label: 'なし',
        score: 3,
        criteria: '直近1年以上、自傷・他害・器物破損・行動制限の記録なし',
        comment: 'リスク面での退院障壁なし',
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
        criteria: '今日の日付・現在いる場所・担当者の名前を繰り返し聞いても答えられない',
        comment: '常時見守り体制が必要。GH・施設入所を優先検討',
      },
      {
        value: '一部保持',
        label: '一部保持',
        score: 1,
        criteria: '日付は曖昧だが病棟内の移動・食事場所は把握。メモを見れば服薬時間がわかる',
        comment: '日課表・メモ・声かけで補完可能。訪問看護での確認体制を構築',
      },
      {
        value: '問題なし',
        label: '問題なし',
        score: 3,
        criteria: '日時・場所・人物の見当識が正確。昨日の出来事を具体的に想起可能',
        comment: '認知面での退院障壁なし',
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
        criteria: '火の消し忘れ・詐欺電話への応答等の危険行動あり／契約書の内容を理解できない',
        comment: '成年後見制度・日常生活自立支援事業の利用を検討',
      },
      {
        value: '一部可能',
        label: '一部可能',
        score: 1,
        criteria: '食事・着替え・日課の選択は自分で可能。携帯の契約変更や保険手続きは理解困難',
        comment: '重要な判断（契約・金銭）は支援者が補助。日常判断は本人に委ねる',
      },
      {
        value: '可能',
        label: '可能',
        score: 3,
        criteria: '退院先・サービス利用について自分で比較検討し意思表示できる',
        comment: '判断力面での退院障壁なし',
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
        criteria: 'ベッド⇔車椅子移乗に常時2人介助／自力での立位保持不可',
        comment: '車椅子移乗に2人介助が必要。介護施設入所を優先検討',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        criteria: '手すり・歩行器使用で病棟内移動可能。段差・階段は介助が必要',
        comment: '手すり・歩行器で移動可。住環境のバリアフリー確認が必要',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: '屋内外を補助具なしで自由に移動可能。階段昇降も自立',
        comment: '移動面での退院障壁なし',
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
        criteria: 'スプーン・箸を持てない／嚥下障害で見守り下でもむせ込み頻発',
        comment: '経口摂取に全面介助が必要。栄養管理体制の確保が前提',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        criteria: 'おかずを小さく切る・蓋を開ける等の準備があれば自力摂取可能',
        comment: '配膳・食形態の工夫で自力摂取可能。訪問介護での食事支援を検討',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: '配膳から下膳まで自力で完結。箸・スプーンの使用に問題なし',
        comment: '食事動作面での退院障壁なし',
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
        criteria: 'トイレへの移動不可／尿意・便意の訴えなし／おむつ交換に全面介助',
        comment: '常時おむつ交換が必要。介護施設入所を優先検討',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        criteria: '尿意・便意はあるがトイレまでの移動に声かけ・誘導が必要／夜間のみ失禁',
        comment: 'トイレ誘導・パッド交換の支援で自立可能。訪問介護の回数を検討',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: 'トイレでの排泄が自立。後始末・手洗いまで自力で完結',
        comment: '排泄面での退院障壁なし',
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
        criteria: '浴槽のまたぎ不可／洗体・洗髪ともに全面介助／機械浴を使用',
        comment: '機械浴・特浴レベル。入浴介護の体制確保が退院の前提',
      },
      {
        value: '一部介助',
        label: '一部介助',
        score: 1,
        criteria: '洗体は自力可能だが浴槽のまたぎ・背中の洗浄に介助が必要',
        comment: '見守り・一部介助で入浴可能。訪問入浴or通所入浴を検討',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: '入浴準備から着衣まで自力で完結。整容（歯磨き・整髪）も自立',
        comment: '入浴面での退院障壁なし',
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
        criteria: '薬の名前・目的を質問しても答えられない／「何の薬？」に「わからない」',
        comment: '服薬管理は全面的に外部支援が必要。訪問看護での与薬確認を前提',
      },
      {
        value: '一部理解',
        label: '一部理解',
        score: 1,
        criteria: '「朝の薬は何？」に薬名は言えないが「眠れる薬」等の目的は答えられる',
        comment: '繰り返し説明で定着見込み。お薬カレンダー＋訪問看護の確認体制を構築',
      },
      {
        value: '理解あり',
        label: '理解あり',
        score: 3,
        criteria: '処方薬の名前・目的・副作用を説明可能。体調変化時に「受診した方がいい」と判断できる',
        comment: '服薬理解面での退院障壁なし',
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
        criteria: '薬をセットしても飲み忘れる／PTPシートから出せない／薬を隠す・捨てる行為あり',
        comment: '訪問看護での服薬確認（毎日or毎食）が退院の前提条件',
      },
      {
        value: '見守りで可',
        label: '見守りで可',
        score: 1,
        criteria: 'お薬カレンダーにセットすれば自力で内服可能。セット作業は支援が必要',
        comment: 'お薬カレンダー＋週1〜2回の訪問看護確認で自己管理に移行可能',
      },
      {
        value: '自己管理可',
        label: '自己管理可',
        score: 3,
        criteria: '自分でPTPシートから出し、お薬カレンダーにセットし、時間通りに内服。残薬管理も可能',
        comment: '服薬実行面での退院障壁なし',
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
        criteria: '月初に生活費を全額使い切る／通販の高額請求が繰り返し発生／お釣りの計算ができない',
        comment: '金銭管理は全面委任が必要。社協の日常生活自立支援事業を検討',
      },
      {
        value: '部分可',
        label: '部分可',
        score: 1,
        criteria: '週5,000円程度の小遣いは計画的に使える。家賃・光熱費の支払い手続きは理解困難',
        comment: '週単位の小遣い管理は可能。家計全体は支援者が管理',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: '月単位の収支管理が可能。家賃・光熱費・食費の振分けを自力で実行',
        comment: '金銭管理面での退院障壁なし',
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
        criteria: 'ガスコンロの点火・消火ができない／冷蔵庫の食材の腐敗に気づかない',
        comment: '配食サービス＋訪問介護での食事支援が退院の前提',
      },
      {
        value: '部分可',
        label: '部分可',
        score: 1,
        criteria: '電子レンジで冷凍食品を温められる。包丁・ガスコンロは危険で使用不可',
        comment: '電子レンジ調理＋配食サービス併用で対応可能',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: '献立を考え、買い物リストを作り、調理から片付けまで自力で完結',
        comment: '食事準備面での退院障壁なし',
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
        criteria: '何を買うか決められない／レジでの会計ができない／店までの移動手段がない',
        comment: '買い物代行サービスまたは訪問介護での同行支援が必要',
      },
      {
        value: '部分可',
        label: '部分可',
        score: 1,
        criteria: 'リストがあれば店で商品を選べる。ただし金額の合計計算は困難',
        comment: '買い物リスト＋同行支援があれば可能。頻度と支援方法を計画',
      },
      {
        value: '自立',
        label: '自立',
        score: 3,
        criteria: '予算を決めて必要な物を選び、支払いまで自力で完結',
        comment: '買い物面での退院障壁なし',
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
        criteria: '予約の電話ができない／公共交通機関の乗り方がわからない／受付手続きができない',
        comment: '送迎サービスまたは訪問診療への切替えを検討',
      },
      {
        value: '同行必要',
        label: '同行必要',
        score: 1,
        criteria: '行き先がわかっていれば移動は可能だが、受付・会計・処方箋受取りに同行が必要',
        comment: '同行支援（家族・ヘルパー・相談員）の体制を退院前に確保',
      },
      {
        value: '単独可',
        label: '単独可',
        score: 3,
        criteria: '自分で予約電話→交通手段で移動→受付→診察→処方箋→薬局まで自力で完結',
        comment: '通院面での退院障壁なし',
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
        criteria: '面会・電話を拒否／「もう関わりたくない」と明言／連絡先不通',
        comment: '家族支援ゼロ前提の退院計画が必要。GH・単身生活＋支援チーム体制を構築',
      },
      {
        value: '消極的',
        label: '消極的',
        score: 1,
        criteria: '電話は出るが面会は月1回未満／「何かあったら連絡して」程度の関与',
        comment: '家族に過度な負担をかけない計画を立案。公的サービスで補完',
      },
      {
        value: '条件付き',
        label: '条件付き',
        score: 2,
        criteria: '「通院の送迎はする」「金銭管理は引き受ける」等の具体的な役割合意あり',
        comment: '家族との役割分担を文書化。支援会議で合意内容を共有',
      },
      {
        value: '積極的',
        label: '積極的',
        score: 3,
        criteria: '週1回以上面会／退院後の同居or近居を希望／支援会議に毎回参加',
        comment: '家族が退院支援の中心的パートナー。定期的な情報共有体制を維持',
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
        criteria: '退院支援会議・サービス担当者会議に継続参加できる家族・親族がいない',
        comment: '相談支援専門員・PSWをキーパーソン代替として退院計画に位置づけ',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        criteria: '候補者（兄弟・親族・後見人）はいるが、役割引受けの同意が未確定',
        comment: 'キーパーソン確定を退院準備の前提タスクに設定',
      },
      {
        value: 'あり',
        label: 'あり',
        score: 3,
        criteria: '意思決定の相談・緊急連絡・サービス調整の窓口となる人が明確で連絡がつく',
        comment: '連携体制は整備済み。退院後の連絡ルートを確認',
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
        criteria: '区分未申請/不明',
        comment: '未整備のためサービス利用に制約',
      },
      {
        value: '申請中',
        label: '申請中',
        score: null,
        criteria: '申請・審査進行中',
        comment: '受給見込みあり',
      },
      {
        value: '区分1',
        label: '区分1',
        score: null,
        criteria: '区分1：時々支援',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '区分2',
        label: '区分2',
        score: null,
        criteria: '区分2：毎日いくつかの場面で支援',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '区分3',
        label: '区分3',
        score: null,
        criteria: '区分3：生活の多くで継続支援',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '区分4',
        label: '区分4',
        score: null,
        criteria: '区分4：ほぼ常時の見守り・複数介助',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '区分5',
        label: '区分5',
        score: null,
        criteria: '区分5：終日介護レベル',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '区分6',
        label: '区分6',
        score: null,
        criteria: '区分6：最重度の支援量',
        comment: '情報項目（点数対象外）',
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
        criteria: '介護保険非該当：介護保険の支援は原則不要（自立）',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要支援1',
        label: '要支援1',
        score: null,
        criteria: '要支援1：IADL中心に助言・見守りがときどき必要',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要支援2',
        label: '要支援2',
        score: null,
        criteria: '要支援2：IADL＋一部ADLに日常的な支援が必要',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要介護1',
        label: '要介護1',
        score: null,
        criteria: '要介護1：歩行・排泄・入浴で一部介助、見守り頻回',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要介護2',
        label: '要介護2',
        score: null,
        criteria: '要介護2：複数ADLで部分介助、継続的支援が必要',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要介護3',
        label: '要介護3',
        score: null,
        criteria: '要介護3：移乗・排泄・入浴に相当介助、屋内移動も支援',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要介護4',
        label: '要介護4',
        score: null,
        criteria: '要介護4：多くのADLで全面介助、常時見守りが必要',
        comment: '情報項目（点数対象外）',
      },
      {
        value: '要介護5',
        label: '要介護5',
        score: null,
        criteria: '要介護5：ほぼ全介助、臥床中心・医療連携が前提',
        comment: '情報項目（点数対象外）',
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
        criteria: '退院後に訪問看護・訪問介護・通所・就労支援等の利用予定が一切ない',
        comment: 'サービス利用計画の策定が退院準備の最優先タスク',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        criteria: '訪問看護or通所の見学・契約手続き中。利用開始日は未確定',
        comment: '調整中サービスの確定時期を退院目標日と連動させて管理',
      },
      {
        value: 'あり',
        label: 'あり',
        score: 3,
        criteria: '訪問看護・訪問介護・通所・就労支援等の利用計画が確定し、開始日も決定済み',
        comment: '退院後のサービス体制は整備済み',
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
        criteria: '退院先の候補（自宅・GH・施設・アパート）が一つもない',
        comment: '住居確保が退院の最大障壁。GH・施設・公営住宅の候補洗い出しから開始',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        criteria: 'GH・施設の見学済みor申込み済み。空き待ちor審査中',
        comment: '候補先の受入れ可否確認を退院目標日から逆算して管理',
      },
      {
        value: 'あり',
        label: 'あり',
        score: 3,
        criteria: '退院先が確定（自宅復帰の合意あり／GH・施設の受入れ内定あり）',
        comment: '住居面での退院障壁なし',
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
        criteria: '現時点で収入ゼロ。年金・生活保護・就労収入のいずれもなし',
        comment: '生活保護申請または障害年金申請を退院準備と並行で進める',
      },
      {
        value: '生活保護・受給中',
        label: '生活保護・受給中',
        score: 1,
        criteria: '生活保護受給中or申請済みで決定見込み。最低限の生活費は確保',
        comment: '生活保護受給中。転居先の福祉事務所への移管手続きを確認',
      },
      {
        value: '年金・給与あり',
        label: '年金・給与あり',
        score: 3,
        criteria: '障害年金・老齢年金・就労収入等により月額の生活費が安定的に確保されている',
        comment: '経済面での退院障壁なし',
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
        criteria: '精神障害者保健福祉手帳・自立支援医療・障害福祉サービス・介護保険のいずれも未申請',
        comment: '利用可能な制度の洗い出しとPSWによる申請支援を退院準備に組み込む',
      },
      {
        value: '申請中',
        label: '申請中',
        score: 1,
        criteria: '手帳・自立支援医療・介護保険等の申請済みで審査中or更新手続き中',
        comment: '審査結果の見込み時期を確認し退院スケジュールと連動',
      },
      {
        value: '利用中',
        label: '利用中',
        score: 3,
        criteria: '手帳・自立支援医療・介護保険等が有効期限内で利用中',
        comment: '制度面での退院障壁なし',
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
