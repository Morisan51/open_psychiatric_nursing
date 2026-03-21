// PSW（精神保健福祉士）アセスメント マスターデータ
// 精神保健福祉アセスメント_v2.0.xlsm PSW_Master シートより移植

import type { EvaluationItem, EvaluationOption } from './masterData';

export const PSW_CATEGORY_COLORS: Record<string, string> = {
  '入院経緯':     'var(--accent-cyan)',
  '生活背景':     'var(--accent-green)',
  '権利擁護':     'var(--accent-purple)',
  '退院支援情報': 'var(--accent-blue)',
  '多職種情報':   'var(--accent-orange)',
  '制度情報':     'var(--accent-yellow)',
};

export const PSW_CATEGORIES = [
  '入院経緯',
  '生活背景',
  '権利擁護',
  '退院支援情報',
  '多職種情報',
  '制度情報',
] as const;

export type PswCategoryName = typeof PSW_CATEGORIES[number];

const U: EvaluationOption = {
  value: '不明',
  label: '不明',
  score: 0,
  comment: '【要確認】情報未収集。最優先で確認。',
  criteria: '',
  isUnknown: true,
};

export const PSW_MASTER_DATA: EvaluationItem[] = [

  // ===== 入院経緯 =====

  {
    key: 'psw_admission_type',
    category: '入院経緯',
    item: '入院形態',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '任意入院',
        label: '任意入院',
        score: 3,
        comment: '【有利】本人同意が前提。退院日程調整がスムーズ。',
        criteria: '本人署名の任意入院同意書あり。退院の意思表明を本人が随時できる状態。',
      },
      {
        value: '医療保護入院',
        label: '医療保護入院',
        score: 1,
        comment: '【調整必要】家族等同意者の退院同意取得が前提条件。',
        criteria: '家族等同意者の署名あり。退院時も同意者への説明・同意が必要。',
      },
      {
        value: '措置入院',
        label: '措置入院',
        score: 0,
        comment: '【ハードル高】指定医2名の診察・症状消退確認が退院条件。法的手続き並行必要。',
        criteria: '措置症状の消退を指定医2名が確認するまで退院不可。行政手続きを連携確認。',
      },
    ],
  },

  {
    key: 'psw_admission_awareness',
    category: '入院経緯',
    item: '本人の入院認識',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '否定・拒否',
        label: '否定・拒否',
        score: 0,
        comment: '【難渋ケース】入院を不当と感じている。入院の意味合わせから始める必要あり。',
        criteria: '「退院させろ」「入院は不当」と訴える。服薬拒否・病識欠如を伴うことが多い。',
      },
      {
        value: '部分的理解',
        label: '部分的理解',
        score: 1,
        comment: '【支援で動く】調子が良い日は協力的。面接のタイミングと言葉選びで動く。',
        criteria: '「薬を飲んでいなかった」など経緯を部分的に語れる。病識は不安定。',
      },
      {
        value: '受け入れあり',
        label: '受け入れあり',
        score: 3,
        comment: '【退院支援の好条件】入院の意味を理解。退院後の生活イメージを一緒に作れる段階。',
        criteria: '入院の経緯を自分の言葉で語れる。服薬の必要性・通院の重要性を理解している。',
      },
    ],
  },

  {
    key: 'psw_hospitalization_history',
    category: '入院経緯',
    item: '入院・退院歴',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '初回入院',
        label: '初回入院',
        score: 1,
        comment: '【地域生活のイメージなし】退院後の生活を具体的にイメージできていない。丁寧に組み立てる。',
        criteria: '今回が初めての精神科入院。制度利用経験ゼロ。各種申請が未済の可能性が高い。',
      },
      {
        value: '再入院（安定歴あり）',
        label: '再入院（安定歴あり）',
        score: 2,
        comment: '【パターン分析が鍵】前回退院後の安定要因・再発トリガーを今回の計画に活かす。',
        criteria: '直近退院から6ヶ月以上安定していた期間がある。前回の支援記録を確認。',
      },
      {
        value: '再入院（短期繰り返し）',
        label: '再入院（短期繰り返し）',
        score: 0,
        comment: '【体制の根本見直し】「同じ体制では同じ結果」前提で計画を立て直す。',
        criteria: '退院後6ヶ月以内の再入院を2回以上繰り返している。',
      },
    ],
  },

  // ===== 生活背景 =====

  {
    key: 'psw_living_env',
    category: '生活背景',
    item: '入院前居住環境',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '路上・施設外',
        label: '路上・施設外',
        score: 0,
        comment: '【退院先確保が最優先】住所なし＝退院できない。生活保護申請・GH照会を即開始。',
        criteria: '入院前から路上生活・ネットカフェ等。住民票なし・住所不定のケースも含む。',
      },
      {
        value: '単身（支援なし）',
        label: '単身（支援なし）',
        score: 1,
        comment: '【孤立リスク高】退院後に毎日状態確認できる人がいない。訪問看護・相談支援の定期接触が核心。',
        criteria: '単身アパート等で生活していたが、訪問系サービス・見守り体制がない状態。',
      },
      {
        value: 'GH・支援付き住居',
        label: 'GH・支援付き住居',
        score: 2,
        comment: '【戻れる可能性を確認】元のGHへの退院が最も現実的。早期に受け入れ確認。',
        criteria: '入院前はグループホーム・支援付きアパート等に居住。',
      },
      {
        value: '家族同居',
        label: '家族同居',
        score: 3,
        comment: '【家族の意向が退院のカギ】家族疲弊・拒否感を丁寧にアセスメント。',
        criteria: '配偶者・親・兄弟等と同居していた。家族の受け入れ継続意向を家族面接で確認。',
      },
    ],
  },

  {
    key: 'psw_key_person',
    category: '生活背景',
    item: 'キーパーソン関与度',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '不在',
        label: '不在',
        score: 0,
        comment: '【身寄りなし対応】成年後見・相談支援専門員を「疑似キーパーソン」として機能させる体制を作る。',
        criteria: '家族に連絡が取れない（絶縁・所在不明・死別等）。または関与を完全に拒否。',
      },
      {
        value: '消極的関与',
        label: '消極的関与',
        score: 1,
        comment: '【関係構築が必要】支援への参加を求める前に家族の疲弊・不安・希望を一度じっくり聴く。',
        criteria: '連絡は取れる・面会には来るが積極参加を避けている。家族疲弊感が高い可能性。',
      },
      {
        value: '積極的関与',
        label: '積極的関与',
        score: 3,
        comment: '【最大の味方】支援会議に参加・役割分担を明確化することで退院後の安定度が大幅に上がる。',
        criteria: '面会に定期的に来ている。退院支援会議への参加意向あり。具体的役割を担える意思がある。',
      },
    ],
  },

  {
    key: 'psw_economy',
    category: '生活背景',
    item: '経済状況',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '無収入・管理困難',
        label: '無収入・管理困難',
        score: 0,
        comment: '【生活基盤なし】生活保護申請・障害年金請求・福祉資金貸付を並行して動かす。',
        criteria: '収入ゼロ・無年金・生活保護未申請のいずれか、または金銭管理が破綻している。',
      },
      {
        value: '要支援（申請中）',
        label: '要支援（申請中）',
        score: 1,
        comment: '【動いてはいる】「申請中」で満足せず受給開始予定日を確認し退院日程と調整する。',
        criteria: '生活保護申請中・障害年金請求中など制度整備が進行中。受給開始まで空白期間あり。',
      },
      {
        value: '収入・管理あり',
        label: '収入・管理あり',
        score: 3,
        comment: '【経済基盤OK】退院後の家賃・食費・医療費の目処が立つ。退院計画が立てやすい。',
        criteria: '障害年金・生活保護・給与等の定期収入あり。金銭管理も概ね機能している。',
      },
    ],
  },

  // ===== 権利擁護 =====

  {
    key: 'psw_discharge_will',
    category: '権利擁護',
    item: '退院意向（本人）',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '退院拒否',
        label: '退院拒否',
        score: 0,
        comment: '【長期入院リスク】退院を強制せず、不安の正体を一緒に整理することから始める。',
        criteria: '「退院したくない」と明示。または退院の話題を出すと拒絶・沈黙する。',
      },
      {
        value: '曖昧・揺らぎあり',
        label: '曖昧・揺らぎあり',
        score: 1,
        comment: '【働きかけで動く】不安を一つずつ整理し、「こういう支援があればできる」という絵を一緒に描く。',
        criteria: '退院したい気持ちはあるが条件・時期・場所が漠然としている。日によって変わる。',
      },
      {
        value: '明確な退院希望',
        label: '明確な退院希望',
        score: 3,
        comment: '【意欲を活かす】この意欲を軸に退院計画を組み立てる。現実的調整と情報提供を行う。',
        criteria: '退院希望を自分の言葉で明確に表明。退院後の生活についてイメージを持っている。',
      },
    ],
  },

  {
    key: 'psw_family_alignment',
    category: '権利擁護',
    item: '家族意向との一致',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '不一致（対立）',
        label: '不一致（対立）',
        score: 0,
        comment: '【最大の障壁】表面的対立の裏にある各自の本音を個別に聴く。家族会・調停的面接が有効。',
        criteria: '本人と家族で退院の方向性が正反対。PSWが橋渡し役を担う必要がある。',
      },
      {
        value: '部分的一致',
        label: '部分的一致',
        score: 1,
        comment: '【調整の余地あり】一致している部分を軸に、不一致の部分を支援で補う計画を立てる。',
        criteria: '退院の方向性は一致しているが退院先や役割分担で意見が分かれる。',
      },
      {
        value: '一致',
        label: '一致',
        score: 3,
        comment: '【合意形成済み】本人と家族が同じ方向を向いている。この合意が崩れないよう継続コンタクトを。',
        criteria: '本人・家族ともに退院先・時期・支援体制について同意。支援会議で建設的な話し合いができる。',
      },
    ],
  },

  {
    key: 'psw_decision_capacity',
    category: '権利擁護',
    item: '意思決定能力',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '著しく困難',
        label: '著しく困難',
        score: 0,
        comment: '【代理意思決定が必要】成年後見・日常生活自立支援事業の活用を検討。支援プロセスを記録に残す。',
        criteria: '基本情報の理解が困難。選択肢を示しても選べない、または直後に全く異なることを言う。',
      },
      {
        value: '支援下で可能',
        label: '支援下で可能',
        score: 1,
        comment: '【支援の設計が重要】繰り返し説明・平易な言葉・書面での確認等で理解が高まる。',
        criteria: '平易な言葉・繰り返し確認で理解・選択・表明ができる。複雑な情報では判断が揺らぐ。',
      },
      {
        value: '自立的に可能',
        label: '自立的に可能',
        score: 3,
        comment: '【本人主体の支援】選択肢を示し、選ぶプロセスを支えることが支援者の役割。',
        criteria: '複数の選択肢を比較して自分で選べる。選んだ理由を説明できる。同意書に署名・理解できる。',
      },
    ],
  },

  {
    key: 'psw_rights_protection',
    category: '権利擁護',
    item: '権利擁護制度利用',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未利用・未検討',
        label: '未利用・未検討',
        score: 0,
        comment: '【必要性を評価】意思決定能力に課題があるにもかかわらず制度未利用は危険。多職種で検討。',
        criteria: '成年後見・日常生活自立支援事業のいずれも利用していない。',
      },
      {
        value: '申請・検討中',
        label: '申請・検討中',
        score: 1,
        comment: '【手続きの進捗確認】審判確定の見込み時期を確認し、退院日程と調整する。',
        criteria: '成年後見の申立中、または日常生活自立支援事業の契約検討・相談中。',
      },
      {
        value: '利用中',
        label: '利用中',
        score: 3,
        comment: '【制度的保護あり】退院支援会議に後見人等を招集し、退院後の役割を明確にする。',
        criteria: '成年後見人または日常生活自立支援事業の担当者が就いている。',
      },
    ],
  },

  // ===== 退院支援情報 =====

  {
    key: 'psw_discharge_destination',
    category: '退院支援情報',
    item: '退院先候補',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '候補なし',
        label: '候補なし',
        score: 0,
        comment: '【住まいの確保が前提】退院先なしに退院日は決められない。複数機関に空き状況を照会。',
        criteria: '居住先として具体的に検討している場所がない。GH空き待ち・家族拒否等で調整困難。',
      },
      {
        value: '調整中',
        label: '調整中',
        score: 1,
        comment: '【スピードが重要】「いつ決まるか」「何が決まればOKか」を毎週確認する。',
        criteria: 'GH見学済み・申込済み、または家族が条件付きで同意している等、候補は絞られているが未確定。',
      },
      {
        value: '確定・内定',
        label: '確定・内定',
        score: 3,
        comment: '【退院日程を設定できる状態】残るは引越し・サービス開始日・外泊練習等の段取りのみ。',
        criteria: 'GH入居許可・家族受入れ合意・アパート契約締結等、居住場所が確定または内定している。',
      },
    ],
  },

  {
    key: 'psw_service_readiness',
    category: '退院支援情報',
    item: '必要サービス整備状況',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未整備',
        label: '未整備',
        score: 0,
        comment: '【サービス調整を今すぐ開始】退院後の支援体制がゼロ。障害支援区分申請と同時並行で動かす。',
        criteria: '訪問看護・ヘルパー・デイケア等の必要サービスが全く調整されていない。',
      },
      {
        value: '一部整備中',
        label: '一部整備中',
        score: 1,
        comment: '【残り何が必要かを明確に】「何が揃えば退院できるか」のチェックリストを関係者で共有。',
        criteria: '一部は申請・契約済みだが退院後の生活に必要な全サービスが確定していない。',
      },
      {
        value: '整備済み',
        label: '整備済み',
        score: 3,
        comment: '【サービス体制OK】必要サービスが確定し退院後すぐに利用できる状態。',
        criteria: '必要サービスが全て決定・受給者証交付済み・事業所も確定。退院日に合わせてサービス開始日設定済み。',
      },
    ],
  },

  {
    key: 'psw_care_manager_link',
    category: '退院支援情報',
    item: '相談支援専門員連携',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未連携',
        label: '未連携',
        score: 0,
        comment: '【地域の入口を開く】基幹相談支援センター・市町村担当課に連絡し担当者を決めるところから始める。',
        criteria: '相談支援専門員が就いておらず、退院後の地域生活コーディネート体制がない。',
      },
      {
        value: '連携中（調整中）',
        label: '連携中（調整中）',
        score: 1,
        comment: '【計画作成の進捗を確認】「計画案をいつまでに出せるか」を確認し、退院日程に反映させる。',
        criteria: '相談支援専門員が決まり初回面接済み。ただしサービス等利用計画（案）が未提出。',
      },
      {
        value: '連携済み（計画確定）',
        label: '連携済み（計画確定）',
        score: 3,
        comment: '【地域移行の準備完了】計画確定・支給決定済み。退院前カンファレンスに参加できると理想。',
        criteria: 'サービス等利用計画が確定し、市町村の支給決定が完了している。',
      },
    ],
  },

  {
    key: 'psw_medical_continuity',
    category: '退院支援情報',
    item: '医療継続の見通し',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未整備',
        label: '未整備',
        score: 0,
        comment: '【外来予約が最低ライン】退院後の医療体制ゼロは最大の再入院リスク。退院前に初回外来を設定。',
        criteria: '退院後の通院先・訪問看護・デイケア等が全く決まっていない。',
      },
      {
        value: '一部整備',
        label: '一部整備',
        score: 1,
        comment: '【外来だけで十分か再評価】服薬自己管理が不安なら訪問看護での投薬管理を追加検討。',
        criteria: '外来予約は取れているが訪問看護・デイケア等の追加サポートが調整中または未定。',
      },
      {
        value: '整備済み',
        label: '整備済み',
        score: 3,
        comment: '【医療体制OK】初回外来日を退院後1週間以内に設定できていると再発予防に効果的。',
        criteria: '外来予約日が確定。必要に応じて訪問看護・デイケアの利用開始日も確定済み。',
      },
    ],
  },

  // ===== 多職種情報 =====

  {
    key: 'psw_doctor_policy',
    category: '多職種情報',
    item: '主治医退院方針',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '退院困難',
        label: '退院困難',
        score: 0,
        comment: '【医療側の壁】「何が整えば退院できるか」を具体化する。条件を文書化して共有する。',
        criteria: '幻覚・妄想が持続・治療抵抗性・自傷他害リスク継続等を理由に退院時期未定。',
      },
      {
        value: '条件付き退院可',
        label: '条件付き退院可',
        score: 1,
        comment: '【条件を具体化して動く】条件を一つずつ潰していく作業がPSWの仕事。達成状況を定期報告。',
        criteria: '症状は落ち着いているが「退院後の支援体制が整うことが条件」と主治医が表明。',
      },
      {
        value: '退院可',
        label: '退院可',
        score: 3,
        comment: '【医療的ゴーサイン】あとは社会的調整のみ。「退院できるのに出られない」状態にならないよう加速。',
        criteria: '症状安定・服薬継続・治療協力が確認され、主治医が退院可と明示。',
      },
    ],
  },

  {
    key: 'psw_nursing_info',
    category: '多職種情報',
    item: '看護からの情報',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: 'ADL低下・問題行動あり',
        label: 'ADL低下・問題行動あり',
        score: 0,
        comment: '【退院前の準備が必要】「病棟でできないことは地域でもできない」。退院前の生活訓練・服薬指導を強化。',
        criteria: '食事・入浴・排泄等で頻繁な見守りが必要。服薬を拒否・隠す行動あり。問題行動が月複数回以上。',
      },
      {
        value: '部分的な課題あり',
        label: '部分的な課題あり',
        score: 1,
        comment: '【支援を組み合わせれば動ける】「できること・できないこと」を具体的に聴取し、サービス設計に反映。',
        criteria: '一部のADLに見守りが必要。服薬は見守りがあればできる。問題行動は月1〜2回程度。',
      },
      {
        value: 'ADL自立・安定',
        label: 'ADL自立・安定',
        score: 3,
        comment: '【地域生活のベースあり】支援量を過剰に設定しすぎず、本人の自立を尊重した計画を立てる。',
        criteria: 'ADLが自立または軽い見守りで可能。服薬を自己管理できている。病棟での対人関係も安定。',
      },
    ],
  },

  {
    key: 'psw_conference_direction',
    category: '多職種情報',
    item: 'カンファレンス方向性',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '退院困難（合意）',
        label: '退院困難（合意）',
        score: 0,
        comment: '【多職種の壁】「医療的に難しい」と「地域生活で対応できない」は別問題。PSWとして突破口を提示。',
        criteria: 'カンファレンスで複数職種から「退院困難」という意見が出ている。',
      },
      {
        value: '意見分かれる',
        label: '意見分かれる',
        score: 1,
        comment: '【合意形成が必要】各職種の懸念事項を整理し「この懸念が解消されれば退院可能か」を確認。',
        criteria: '職種間で判断が分かれている。または退院先について意見が分かれている。',
      },
      {
        value: '退院支援で一致',
        label: '退院支援で一致',
        score: 3,
        comment: '【チームで動ける】役割分担を明確にして退院準備を加速させる。',
        criteria: 'カンファレンスで主治医・看護・OT・PSW等が退院支援の方向性で合意している。',
      },
    ],
  },

  // ===== 制度情報 =====

  {
    key: 'psw_medical_payment',
    category: '制度情報',
    item: '医療費支払い状況',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未収・滞納あり',
        label: '未収・滞納あり',
        score: 0,
        comment: '【早急な制度整備が必要】生活保護・自立支援医療・高額療養費の申請で解決できることが多い。',
        criteria: '入院費の滞納・未払いが発生している。または「お金がなくて払えない」と申告。',
      },
      {
        value: '一部困難',
        label: '一部困難',
        score: 1,
        comment: '【申請の進捗を確認】受給者証の交付時期・適用開始日を確認し、退院後の医療費負担見込みを説明。',
        criteria: '自立支援医療（精神通院）または高額療養費の申請中。申請が通れば軽減見込み。',
      },
      {
        value: '支払い安定',
        label: '支払い安定',
        score: 3,
        comment: '【医療費の心配なし】受給者証の有効期限・更新時期を確認し、退院後も継続できる体制を確認。',
        criteria: '自立支援医療受給者証有効・高額療養費適用・生活保護医療扶助等で医療費が低負担で継続できる。',
      },
    ],
  },

  {
    key: 'psw_service_plan',
    category: '制度情報',
    item: '障害福祉サービス計画',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未作成',
        label: '未作成',
        score: 0,
        comment: '【計画なしにサービスは使えない】相談支援専門員を早急に確保し計画作成を依頼。計画〜受給者証まで1〜2ヶ月。',
        criteria: 'サービス等利用計画もセルフプランも作成されていない。受給者証も未交付。',
      },
      {
        value: '作成中',
        label: '作成中',
        score: 1,
        comment: '【完成・提出時期を確認】暫定計画で先行サービス利用できる場合もある。市町村提出スケジュールを確認。',
        criteria: 'サービス等利用計画を相談支援専門員が作成中、または暫定計画で一部先行利用中。',
      },
      {
        value: '確定済み',
        label: '確定済み',
        score: 3,
        comment: '【制度的基盤OK】計画確定・受給者証交付済み。支給量が実際の必要量と一致しているか最終確認。',
        criteria: 'サービス等利用計画が確定・市町村の支給決定完了・受給者証交付済み。',
      },
    ],
  },

  {
    key: 'psw_pension_welfare',
    category: '制度情報',
    item: '障害年金・生活保護状況',
    isInfoOnly: false,
    options: [
      { ...U },
      {
        value: '未申請・無受給',
        label: '未申請・無受給',
        score: 0,
        comment: '【生活基盤の構築が急務】障害年金か生活保護のどちらか、または両方を今すぐ申請する。',
        criteria: '障害年金も生活保護も未申請・無受給。退院後の家賃・食費の支払いめどが立たない。',
      },
      {
        value: '申請中・審査中',
        label: '申請中・審査中',
        score: 1,
        comment: '【受給開始時期を確認】受給開始までの「つなぎ」として福祉資金貸付等を検討。退院日と受給開始日のズレに注意。',
        criteria: '障害年金を年金事務所に請求中（審査中）、または生活保護を福祉事務所に申請中。',
      },
      {
        value: '受給中（継続要件確認済み）',
        label: '受給中（継続要件確認済み）',
        score: 3,
        comment: '【収入基盤OK】更新時期・現況届の提出時期を本人・家族と共有。退院後に手続き忘れで停止するケースが多い。',
        criteria: '障害年金または生活保護を受給中。次回更新時期・現況届の提出時期を確認済み。',
      },
    ],
  },
];

// ===== ユーティリティ =====

export const PSW_SCORED_ITEMS = PSW_MASTER_DATA.filter(item => !item.isInfoOnly);

/** カテゴリ別に項目をグループ化 */
export const PSW_ITEMS_BY_CATEGORY = PSW_CATEGORIES.reduce<Record<string, EvaluationItem[]>>(
  (acc, category) => {
    acc[category] = PSW_MASTER_DATA.filter(item => item.category === category);
    return acc;
  },
  {}
);

/** 最大スコア（実データから計算）*/
export const PSW_MAX_SCORE = PSW_SCORED_ITEMS.reduce((sum, item) => {
  const max = Math.max(...item.options.map(o => o.score ?? 0));
  return sum + max;
}, 0);

/** 判定コメント */
export function getPswJudgment(totalScore: number): {
  level: 'low' | 'mid' | 'high';
  text: string;
} {
  const third = Math.floor(PSW_MAX_SCORE / 3);
  if (totalScore <= third) {
    return {
      level: 'low',
      text: '集中支援フェーズ／退院調整に重大な障壁が複数あり／早急な多面的介入が必要',
    };
  }
  if (totalScore <= third * 2) {
    return {
      level: 'mid',
      text: '支援継続が必要／主要課題への集中的介入を継続しながら退院準備を進める',
    };
  }
  return {
    level: 'high',
    text: '退院調整可能／地域移行に向けた具体的な日程・体制の最終調整フェーズ',
  };
}
