// ojpp 認知症アセスメント — データ定義
// スペック: dementia_assessment_spec.txt

// ===== Types =====

export type DementiaDirectionKey = 'facility' | 'watch' | 'endoflife' | 'unknown';

export interface DementiaDirection {
  key: DementiaDirectionKey;
  label: string;
  sublabel: string;
  color: string;
}

export type DementiaItemType = 'radio' | 'checkbox' | 'text';

export interface DementiaOption {
  value: string;
  label: string;
}

export interface DementiaItem {
  key: string;
  section: 'A' | 'B' | 'C' | 'D1' | 'D2' | 'D3' | 'D4' | 'E';
  forBranch: DementiaDirectionKey | null; // null = 全分岐共通
  parentKey?: string; // 条件付き表示の親アイテムkey
  parentValues?: string[]; // 親がこの値の時に表示
  itemLabel: string;
  item: string;
  hint?: string;
  type: DementiaItemType;
  options?: DementiaOption[];
  placeholder?: string;
}

// ===== DIRECTIONS =====

export const DEMENTIA_DIRECTIONS: DementiaDirection[] = [
  {
    key: 'facility',
    label: '施設移行を前提に支援を進める',
    sublabel: '施設入所に向けた具体的な準備・調整',
    color: 'var(--accent-cyan)',
  },
  {
    key: 'watch',
    label: '今後の状況を見ながら施設移行を検討',
    sublabel: '待つのではなく、備えながら監視する',
    color: 'var(--accent-yellow)',
  },
  {
    key: 'endoflife',
    label: '病棟での看取りを中心に支援',
    sublabel: 'この場所での最期の時間を支える',
    color: 'var(--accent-pink)',
  },
  {
    key: 'unknown',
    label: '現時点では不明',
    sublabel: '判断材料の収集・整理が優先',
    color: '#888',
  },
];

// ===== SECTION LABELS =====

export const DEMENTIA_SECTIONS: Record<string, { label: string; sublabel: string }> = {
  A: { label: 'A. その人の世界', sublabel: '本人理解' },
  B: { label: 'B. 身体と生命の見通し', sublabel: '' },
  C: { label: 'C. 家族の時間', sublabel: '' },
  D1: { label: 'D1. 施設移行に向けた評価', sublabel: '分岐1専用' },
  D2: { label: 'D2. 待機中の管理', sublabel: '分岐2専用' },
  D3: { label: 'D3. 看取りケアの評価', sublabel: '分岐3専用' },
  D4: { label: 'D4. 判断材料の整理', sublabel: '分岐4専用' },
  E: { label: 'E. ケアの視点', sublabel: '全分岐共通' },
};

// ===== ITEMS =====

export const DEMENTIA_ITEMS: DementiaItem[] = [
  // ── SECTION A ──
  {
    key: 'A-1',
    section: 'A',
    forBranch: null,
    itemLabel: 'A-1',
    item: '意思表示の手がかり',
    type: 'radio',
    options: [
      { value: 'a', label: '言葉で意思を伝えられる場面がある' },
      { value: 'b', label: '表情や態度で快・不快を表現できる' },
      { value: 'c', label: '拒否行動で意思を示すことがある' },
      { value: 'd', label: '意思表示の手がかりがほとんど見られない' },
    ],
  },
  {
    key: 'A-2',
    section: 'A',
    forBranch: null,
    itemLabel: 'A-2',
    item: '「この人らしさ」の把握',
    type: 'radio',
    options: [
      { value: 'a', label: '生活歴・職歴・趣味などの情報があり、ケアに反映できている' },
      { value: 'b', label: '情報はあるが、ケアへの反映が不十分' },
      { value: 'c', label: '情報収集が不十分で、把握できていない' },
      { value: 'd', label: '家族等からの情報提供が得られない状況' },
    ],
  },
  {
    key: 'A-3',
    section: 'A',
    forBranch: null,
    itemLabel: 'A-3',
    item: 'BPSDの状態',
    hint: 'BPSD: 認知症に伴う行動・心理症状（徘徊、興奮、幻覚など）',
    type: 'radio',
    options: [
      { value: 'a', label: 'BPSDは見られない、または日常生活に支障がない程度' },
      { value: 'b', label: 'BPSDはあるが、対応方法が確立しており管理できている' },
      { value: 'c', label: 'BPSDがあり、対応に苦慮している場面がある' },
      { value: 'd', label: 'BPSDが頻回・重度で、安全確保に困難がある' },
    ],
  },
  {
    key: 'A-3-symptoms',
    section: 'A',
    forBranch: null,
    parentKey: 'A-3',
    parentValues: ['b', 'c', 'd'],
    itemLabel: 'A-3 補足',
    item: '主な症状（複数選択可）',
    type: 'checkbox',
    options: [
      { value: '徘徊・帰宅願望', label: '徘徊・帰宅願望' },
      { value: '興奮・焦燥', label: '興奮・焦燥' },
      { value: '暴言・暴力', label: '暴言・暴力' },
      { value: '拒否（食事・服薬・入浴等）', label: '拒否（食事・服薬・入浴等）' },
      { value: '幻覚・妄想', label: '幻覚・妄想' },
      { value: '昼夜逆転', label: '昼夜逆転' },
      { value: '不安・抑うつ', label: '不安・抑うつ' },
      { value: 'アパシー（無関心）', label: 'アパシー（無関心）' },
      { value: 'その他', label: 'その他' },
    ],
  },
  {
    key: 'A-3-background',
    section: 'A',
    forBranch: null,
    parentKey: 'A-3',
    parentValues: ['b', 'c', 'd'],
    itemLabel: 'A-3 補足',
    item: '背景にあると考えられるもの（複数選択可）',
    type: 'checkbox',
    options: [
      { value: '身体的苦痛・不快', label: '身体的苦痛・不快' },
      { value: '環境の変化・不適合', label: '環境の変化・不適合' },
      { value: '未充足のニーズ', label: '未充足のニーズ' },
      { value: '薬剤の影響', label: '薬剤の影響' },
      { value: '対人関係のストレス', label: '対人関係のストレス' },
      { value: '不明', label: '不明' },
    ],
  },

  // ── SECTION B ──
  {
    key: 'B-1',
    section: 'B',
    forBranch: null,
    itemLabel: 'B-1',
    item: '食事・嚥下の段階',
    hint: '嚥下: 飲み込む機能',
    type: 'radio',
    options: [
      { value: 'a', label: '通常食を自力摂取できている' },
      { value: 'b', label: '食事形態の調整が必要だが、経口摂取を維持できている' },
      { value: 'c', label: '介助が必要で、むせ込みや摂取量低下が見られる' },
      { value: 'd', label: '経口摂取が困難になりつつある' },
    ],
  },
  {
    key: 'B-2',
    section: 'B',
    forBranch: null,
    itemLabel: 'B-2',
    item: 'ADLの段階',
    hint: 'ADL: 日常生活動作（食事・移動・排泄・入浴など）',
    type: 'radio',
    options: [
      { value: 'a', label: '見守り程度で日常動作が可能' },
      { value: 'b', label: '一部介助が必要（移動・排泄・入浴のいずれか）' },
      { value: 'c', label: '全般的に介助が必要' },
      { value: 'd', label: 'ほぼ全介助、臥床傾向が進んでいる' },
    ],
  },
  {
    key: 'B-3',
    section: 'B',
    forBranch: null,
    itemLabel: 'B-3',
    item: '身体合併症の状況',
    type: 'radio',
    options: [
      { value: 'a', label: '特に管理が必要な合併症はない' },
      { value: 'b', label: '合併症はあるが、現在の治療で安定している' },
      { value: 'c', label: '合併症があり、治療の調整や経過観察が必要' },
      { value: 'd', label: '合併症が不安定で、内科的対応が優先される状況' },
    ],
  },
  {
    key: 'B-4',
    section: 'B',
    forBranch: null,
    itemLabel: 'B-4',
    item: '今後の身体的見通し',
    type: 'radio',
    options: [
      { value: 'a', label: '当面は大きな変化なく経過すると見込まれる' },
      { value: 'b', label: '緩やかな低下が予想される' },
      { value: 'c', label: '数ヶ月以内に状態の変化が予想される' },
      { value: 'd', label: '看取りの段階に近づいている' },
    ],
  },

  // ── SECTION C ──
  {
    key: 'C-1',
    section: 'C',
    forBranch: null,
    itemLabel: 'C-1',
    item: '家族の受け止め',
    type: 'radio',
    options: [
      { value: 'a', label: '患者の現状と今後について理解し、受け入れている' },
      { value: 'b', label: 'ある程度理解しているが、揺れがある' },
      { value: 'c', label: '現状を受け入れられていない、または向き合えていない' },
      { value: 'd', label: '家族との接触が取れない、または家族がいない' },
    ],
  },
  {
    key: 'C-2',
    section: 'C',
    forBranch: null,
    itemLabel: 'C-2',
    item: '面会と関わり',
    type: 'radio',
    options: [
      { value: 'a', label: '定期的に面会があり、積極的に関わっている' },
      { value: 'b', label: '面会はあるが、頻度は少ない' },
      { value: 'c', label: 'ほとんど面会がない' },
      { value: 'd', label: '家族がいない、または連絡が取れない' },
    ],
  },
  {
    key: 'C-3',
    section: 'C',
    forBranch: null,
    itemLabel: 'C-3',
    item: '今後の方針についての家族の意向',
    type: 'radio',
    options: [
      { value: 'a', label: '施設移行について前向きに考えている' },
      { value: 'b', label: '施設移行は理解しているが、まだ決められない' },
      { value: 'c', label: '「このまま病院にいてほしい」と希望している' },
      { value: 'd', label: '看取りの方向性について話し合いができている' },
      { value: 'e', label: '今後の方針について話し合いの場が持てていない' },
    ],
  },
  {
    key: 'C-4',
    section: 'C',
    forBranch: null,
    itemLabel: 'C-4',
    item: '延命・急変時の意向',
    type: 'radio',
    options: [
      { value: 'a', label: '家族間で方針が共有されている' },
      { value: 'b', label: '一部のキーパーソンの意向は確認できている' },
      { value: 'c', label: 'まだ話し合われていない' },
      { value: 'd', label: '家族間で意見が分かれている' },
    ],
  },

  // ── SECTION D1（施設移行） ──
  {
    key: 'D1-1',
    section: 'D1',
    forBranch: 'facility',
    itemLabel: 'D1-1',
    item: 'BPSDの施設許容度',
    hint: '施設側が対応できる程度まで落ち着いているか',
    type: 'radio',
    options: [
      { value: 'a', label: '施設で対応可能なレベルに安定している' },
      { value: 'b', label: 'おおむね安定しているが、一部対応が難しい場面がある' },
      { value: 'c', label: 'まだ施設での管理が難しいレベル' },
    ],
  },
  {
    key: 'D1-2',
    section: 'D1',
    forBranch: 'facility',
    itemLabel: 'D1-2',
    item: '薬剤調整の状況',
    type: 'radio',
    options: [
      { value: 'a', label: '調整完了、安定している' },
      { value: 'b', label: '微調整中だが、大きな変更の予定はない' },
      { value: 'c', label: 'まだ調整中で、経過観察が必要' },
    ],
  },
  {
    key: 'D1-3',
    section: 'D1',
    forBranch: 'facility',
    itemLabel: 'D1-3',
    item: '施設選定の進捗',
    type: 'radio',
    options: [
      { value: 'a', label: '具体的な施設が決まり、手続きを進めている' },
      { value: 'b', label: '候補施設があり、見学・相談中' },
      { value: 'c', label: '施設を探し始めた段階' },
      { value: 'd', label: 'まだ施設選定に着手していない' },
    ],
  },
  {
    key: 'D1-4',
    section: 'D1',
    forBranch: 'facility',
    itemLabel: 'D1-4',
    item: '要介護認定の状況',
    type: 'radio',
    options: [
      { value: 'a', label: '現在の認定区分で施設入所の条件を満たしている' },
      { value: 'b', label: '区分変更の申請中' },
      { value: 'c', label: '区分変更の申請が必要だが、まだ行っていない' },
      { value: 'd', label: '要介護認定を受けていない' },
    ],
  },
  {
    key: 'D1-5',
    section: 'D1',
    forBranch: 'facility',
    itemLabel: 'D1-5',
    item: '家族の合意状況',
    type: 'radio',
    options: [
      { value: 'a', label: '家族全体で施設移行に合意している' },
      { value: 'b', label: 'キーパーソンは合意しているが、他の家族に未説明' },
      { value: 'c', label: '家族間で意見が分かれている' },
      { value: 'd', label: '家族への説明がこれから' },
    ],
  },
  {
    key: 'D1-6',
    section: 'D1',
    forBranch: 'facility',
    itemLabel: 'D1-6',
    item: '移行に向けた準備（自由記述）',
    hint: '施設への申し送り情報の整備状況、体験入所の予定、移行までの想定スケジュール',
    type: 'text',
    placeholder: '例）申し送り書の作成中。来月に体験入所を予定。認定区分の変更申請済み。',
  },

  // ── SECTION D2（経過観察） ──
  {
    key: 'D2-1',
    section: 'D2',
    forBranch: 'watch',
    itemLabel: 'D2-1',
    item: '今クリアすべき課題（複数選択可）',
    type: 'checkbox',
    options: [
      { value: 'BPSDの安定化', label: 'BPSDの安定化' },
      { value: '薬剤調整の完了', label: '薬剤調整の完了' },
      { value: '身体合併症の治療', label: '身体合併症の治療' },
      { value: 'ADLの見極め', label: 'ADLの見極め（安定か低下傾向か）' },
      { value: '家族の心理的準備', label: '家族の心理的準備' },
      { value: '施設の空き待ち', label: '施設の空き待ち' },
      { value: '要介護認定の取得・変更', label: '要介護認定の取得・変更' },
      { value: 'その他', label: 'その他' },
    ],
  },
  {
    key: 'D2-2',
    section: 'D2',
    forBranch: 'watch',
    itemLabel: 'D2-2',
    item: '次の判断時期の設定',
    type: 'radio',
    options: [
      { value: 'a', label: '2週間後に再評価' },
      { value: 'b', label: '1ヶ月後に再評価' },
      { value: 'c', label: '3ヶ月後に再評価' },
      { value: 'd', label: '特定の状態変化が起きた時（備考欄に記述）' },
    ],
  },
  {
    key: 'D2-3',
    section: 'D2',
    forBranch: 'watch',
    itemLabel: 'D2-3',
    item: '判断のトリガー（複数選択可）',
    hint: '何が変われば方向性が決まるか',
    type: 'checkbox',
    options: [
      { value: 'BPSDが一定期間安定すれば → 施設移行へ', label: 'BPSDが安定すれば → 施設移行へ' },
      { value: '薬剤調整が完了すれば → 施設移行へ', label: '薬剤調整が完了すれば → 施設移行へ' },
      { value: '身体状態が悪化すれば → 看取りへ', label: '身体状態が悪化すれば → 看取りへ' },
      { value: 'ADLの不可逆的低下が進めば → 看取りへ', label: 'ADLの不可逆的低下が進めば → 看取りへ' },
      { value: '家族が合意すれば → 施設移行へ', label: '家族が合意すれば → 施設移行へ' },
      { value: '施設の空きが出れば → 施設移行へ', label: '施設の空きが出れば → 施設移行へ' },
    ],
  },
  {
    key: 'D2-4',
    section: 'D2',
    forBranch: 'watch',
    itemLabel: 'D2-4',
    item: '待機中に進めておくこと（複数選択可）',
    type: 'checkbox',
    options: [
      { value: '地域の施設情報の収集', label: '地域の施設情報の収集（種別・空き状況・受入条件）' },
      { value: '家族との定期的な面談', label: '家族との定期的な面談（関係構築・段階的説明）' },
      { value: '要介護認定の申請・区分変更', label: '要介護認定の申請・区分変更' },
      { value: '本人の生活パターン・反応の記録蓄積', label: '本人の生活パターン・反応の記録蓄積' },
      { value: 'カンファレンスでの方向性共有', label: 'カンファレンスでの方向性共有' },
      { value: 'その他', label: 'その他' },
    ],
  },
  {
    key: 'D2-5',
    section: 'D2',
    forBranch: 'watch',
    itemLabel: 'D2-5',
    item: '現在の入院継続の妥当性',
    type: 'radio',
    options: [
      { value: 'a', label: '医学的に入院継続が必要な状態' },
      { value: 'b', label: '医学的には施設でも可能だが、移行準備中' },
      { value: 'c', label: '社会的な理由（施設の空き・家族の事情）で入院が継続している' },
      { value: 'd', label: '入院継続の理由を再検討すべき状況' },
    ],
  },

  // ── SECTION D3（看取り） ──
  {
    key: 'D3-1',
    section: 'D3',
    forBranch: 'endoflife',
    itemLabel: 'D3-1',
    item: '看取りの段階',
    type: 'radio',
    options: [
      { value: 'a', label: '看取りの方向性をチームで共有した段階' },
      { value: 'b', label: '家族への説明・意向確認の段階' },
      { value: 'c', label: '看取りケアを実施している段階' },
      { value: 'd', label: '終末期に入っている' },
    ],
  },
  {
    key: 'D3-2',
    section: 'D3',
    forBranch: 'endoflife',
    itemLabel: 'D3-2',
    item: '家族との看取りに関する合意',
    type: 'radio',
    options: [
      { value: 'a', label: '家族と方針を共有し、合意が得られている' },
      { value: 'b', label: '家族に説明したが、まだ揺れがある' },
      { value: 'c', label: '家族への説明がこれから' },
      { value: 'd', label: '家族との連絡が取れない' },
    ],
  },
  {
    key: 'D3-3',
    section: 'D3',
    forBranch: 'endoflife',
    itemLabel: 'D3-3',
    item: '本人の安楽の確保',
    type: 'radio',
    options: [
      { value: 'a', label: '苦痛の訴えや兆候は見られず、穏やかに過ごせている' },
      { value: 'b', label: '苦痛が疑われる場面があり、対応を検討中' },
      { value: 'c', label: '苦痛緩和のための介入を行っている' },
      { value: 'd', label: '苦痛の評価が困難な状態' },
    ],
  },
  {
    key: 'D3-4',
    section: 'D3',
    forBranch: 'endoflife',
    itemLabel: 'D3-4',
    item: '不要な医療介入の見直し',
    type: 'radio',
    options: [
      { value: 'a', label: '検査・処置の見直しが行われ、整理されている' },
      { value: 'b', label: '一部見直しが必要' },
      { value: 'c', label: 'まだ見直しに着手していない' },
    ],
  },
  {
    key: 'D3-5',
    section: 'D3',
    forBranch: 'endoflife',
    itemLabel: 'D3-5',
    item: '家族が最期の時間にどう関わりたいか',
    type: 'radio',
    options: [
      { value: 'a', label: 'できるだけそばにいたいと希望している' },
      { value: 'b', label: '病棟に任せたいと希望している' },
      { value: 'c', label: 'まだ具体的に考えられていない' },
      { value: 'd', label: '確認できていない' },
    ],
  },

  // ── SECTION D4（不明） ──
  {
    key: 'D4-1',
    section: 'D4',
    forBranch: 'unknown',
    itemLabel: 'D4-1',
    item: '判断できない主な理由（複数選択可）',
    type: 'checkbox',
    options: [
      { value: '入院して間もなく、状態の見極めができていない', label: '入院して間もなく、状態の見極めができていない' },
      { value: 'BPSDが不安定で、今後の見通しが立たない', label: 'BPSDが不安定で、今後の見通しが立たない' },
      { value: '身体合併症の治療経過が不明', label: '身体合併症の治療経過が不明' },
      { value: '家族の意向が確認できていない', label: '家族の意向が確認できていない' },
      { value: '本人の状態が日によって大きく変動する', label: '本人の状態が日によって大きく変動する' },
      { value: 'チーム内で方向性の意見が分かれている', label: 'チーム内で方向性の意見が分かれている' },
    ],
  },
  {
    key: 'D4-2',
    section: 'D4',
    forBranch: 'unknown',
    itemLabel: 'D4-2',
    item: '判断に必要な情報（複数選択可）',
    type: 'checkbox',
    options: [
      { value: '一定期間の経過観察（BPSDの推移）', label: '一定期間の経過観察（BPSDの推移）' },
      { value: '薬剤調整の効果の確認', label: '薬剤調整の効果の確認' },
      { value: '身体合併症の検査結果・治療方針', label: '身体合併症の検査結果・治療方針' },
      { value: '家族面談の実施', label: '家族面談の実施' },
      { value: 'チームカンファレンスでの検討', label: 'チームカンファレンスでの検討' },
      { value: 'その他', label: 'その他' },
    ],
  },
  {
    key: 'D4-3',
    section: 'D4',
    forBranch: 'unknown',
    itemLabel: 'D4-3',
    item: '次の評価時期',
    type: 'radio',
    options: [
      { value: 'a', label: '1週間後' },
      { value: 'b', label: '2週間後' },
      { value: 'c', label: '1ヶ月後' },
      { value: 'd', label: '特定の条件が揃った時（備考欄に記述）' },
    ],
  },

  // ── SECTION E（全分岐共通） ──
  {
    key: 'E-1',
    section: 'E',
    forBranch: null,
    itemLabel: 'E-1',
    item: '現在のケアで機能していること',
    hint: 'この人に対して今うまくいっているケア、有効な関わり方',
    type: 'text',
    placeholder: '例）食事前に好きな音楽をかけると穏やかになる。名前で呼ぶと視線が合う。',
  },
  {
    key: 'E-2',
    section: 'E',
    forBranch: null,
    itemLabel: 'E-2',
    item: '現在のケアで見直しが必要なこと',
    hint: 'ルーチンに埋もれていないか、この人に合っていないケアはないか',
    type: 'text',
    placeholder: '例）入浴のタイミングが固定されており、本人の状態に合わせていない。',
  },
  {
    key: 'E-3',
    section: 'E',
    forBranch: null,
    itemLabel: 'E-3',
    item: '日常の中の「小さな心地よさ」',
    hint: 'この人が穏やかな表情を見せる場面、好む環境や刺激',
    type: 'text',
    placeholder: '例）窓際の席に座っている時。毛布を胸に抱えている時。昔の話をしている時。',
  },
  {
    key: 'E-4',
    section: 'E',
    forBranch: null,
    itemLabel: 'E-4',
    item: '行動制限の有無と妥当性',
    type: 'radio',
    options: [
      { value: 'a', label: '行動制限なし' },
      { value: 'b', label: '行動制限あり — 現時点で必要と判断' },
      { value: 'c', label: '行動制限あり — 解除の検討が必要' },
      { value: 'd', label: '行動制限あり — 妥当性の再評価が必要' },
    ],
  },
];

// ===== Helper: 表示すべき項目を取得 =====

export function getDementiaVisibleItems(
  direction: DementiaDirectionKey | null,
  radioAnswers: Record<string, string>
): DementiaItem[] {
  return DEMENTIA_ITEMS.filter(item => {
    // 分岐専用項目のフィルタ
    if (item.forBranch !== null && item.forBranch !== direction) return false;
    // 条件付き表示（A-3の補足など）
    if (item.parentKey) {
      const parentVal = radioAnswers[item.parentKey];
      if (!parentVal) return false;
      if (item.parentValues && !item.parentValues.includes(parentVal)) return false;
    }
    return true;
  });
}

// ===== AI Prompt Generators =====

export interface DementiaBasicInfo {
  gender: string;
  age: string;
  diagnosis: string;
  comorbidities: string;
}

export interface DementiaAssessmentData {
  basicInfo: DementiaBasicInfo;
  direction: DementiaDirectionKey | null;
  directionReason: string;
  radioAnswers: Record<string, string>;
  checkboxAnswers: Record<string, string[]>;
  textAnswers: Record<string, string>;
  memo: string;
}

function getLabel(itemKey: string, value: string): string {
  const item = DEMENTIA_ITEMS.find(i => i.key === itemKey);
  if (!item || item.type !== 'radio') return value;
  return item.options?.find(o => o.value === value)?.label ?? value;
}

function getDirectionLabel(key: DementiaDirectionKey | null): string {
  return DEMENTIA_DIRECTIONS.find(d => d.key === key)?.label ?? '未選択';
}

export function generateDementiaSignalPrompt(data: DementiaAssessmentData): string {
  const visibleItems = getDementiaVisibleItems(data.direction, data.radioAnswers);

  const formatItem = (item: DementiaItem): string => {
    if (item.type === 'radio') {
      const val = data.radioAnswers[item.key];
      return `[${item.itemLabel}] ${item.item}: ${val ? getLabel(item.key, val) : '未回答'}`;
    }
    if (item.type === 'checkbox') {
      const vals = data.checkboxAnswers[item.key] ?? [];
      return `[${item.itemLabel}] ${item.item}: ${vals.length > 0 ? vals.join(' / ') : '未選択'}`;
    }
    if (item.type === 'text') {
      const val = data.textAnswers[item.key] ?? '';
      return `[${item.itemLabel}] ${item.item}: ${val || '（記述なし）'}`;
    }
    return '';
  };

  let prompt = `あなたは精神科認知症病棟の臨床支援AIです。
以下のアセスメント情報を元に、SIGNAL形式の出力を生成してください。

【SIGNAL形式の出力項目】
- 方向性：選択された分岐とその根拠の要約（1文）
- 今の状態：現在の患者の状況（2文以内）
- 成り行きの見立て：今後の予測（2文以内）
- 今すべきこと：具体的アクション（2〜3項目）
- 注意すべき変化のサイン：観察ポイント（2〜3項目）
- 次の評価時期：日付または条件

---
【アセスメントデータ】

■ 基本情報
性別: ${data.basicInfo.gender || '未入力'}
年齢: ${data.basicInfo.age || '未入力'}
疾患名: ${data.basicInfo.diagnosis || '未入力'}
身体合併症: ${data.basicInfo.comorbidities || '未入力'}

■ 方向性の判断
${getDirectionLabel(data.direction)}
判断根拠: ${data.directionReason || '（記述なし）'}

`;

  for (const sec of ['A', 'B', 'C']) {
    const secDef = DEMENTIA_SECTIONS[sec];
    const items = visibleItems.filter(i => i.section === sec);
    if (items.length === 0) continue;
    prompt += `■ ${secDef.label}\n`;
    items.forEach(i => { prompt += `${formatItem(i)}\n`; });
    prompt += '\n';
  }

  // D section
  if (data.direction) {
    const dKey = { facility: 'D1', watch: 'D2', endoflife: 'D3', unknown: 'D4' }[data.direction];
    const secDef = DEMENTIA_SECTIONS[dKey];
    const items = visibleItems.filter(i => i.section === dKey);
    if (items.length > 0) {
      prompt += `■ ${secDef.label}\n`;
      items.forEach(i => { prompt += `${formatItem(i)}\n`; });
      prompt += '\n';
    }
  }

  const eItems = visibleItems.filter(i => i.section === 'E');
  if (eItems.length > 0) {
    prompt += `■ ${DEMENTIA_SECTIONS['E'].label}\n`;
    eItems.forEach(i => { prompt += `${formatItem(i)}\n`; });
    prompt += '\n';
  }

  if (data.memo) {
    prompt += `■ 備考\n${data.memo}\n\n`;
  }

  prompt += `---
上記データを踏まえ、SIGNAL形式で出力してください。
「問題点の列挙」ではなく「この人の今と、これからをどう支えるか」を軸にした記述にしてください。`;

  return prompt;
}

export function generateDementiaBriefPrompt(data: DementiaAssessmentData): string {
  const visibleItems = getDementiaVisibleItems(data.direction, data.radioAnswers);

  const formatItem = (item: DementiaItem): string => {
    if (item.type === 'radio') {
      const val = data.radioAnswers[item.key];
      return `  [${item.itemLabel}] ${item.item}: ${val ? getLabel(item.key, val) : '未回答'}`;
    }
    if (item.type === 'checkbox') {
      const vals = data.checkboxAnswers[item.key] ?? [];
      return `  [${item.itemLabel}] ${item.item}: ${vals.length > 0 ? vals.join(' / ') : '未選択'}`;
    }
    if (item.type === 'text') {
      const val = data.textAnswers[item.key] ?? '';
      return `  [${item.itemLabel}] ${item.item}:\n    ${val || '（記述なし）'}`;
    }
    return '';
  };

  let prompt = `あなたは精神科認知症病棟の臨床支援AIです。
以下のアセスメント情報を元に、BRIEF形式（カンファレンス・教育用の詳細版）の出力を生成してください。

【BRIEF形式の出力項目】
1. 方向性の判断とその根拠
2. A〜Eの各領域の現状と根拠のまとめ
3. 今後の方向性（短期：1〜2週間 ／ 中長期：1〜3ヶ月）
4. 家族への伝え方の提案
5. チームへの共有事項・提案
6. 「この人の人生の先輩としての姿」を踏まえた支援の視点

---
【アセスメントデータ】

■ 基本情報
性別: ${data.basicInfo.gender || '未入力'}
年齢: ${data.basicInfo.age || '未入力'}
疾患名: ${data.basicInfo.diagnosis || '未入力'}
身体合併症: ${data.basicInfo.comorbidities || '未入力'}

■ 方向性の判断
${getDirectionLabel(data.direction)}
判断根拠: ${data.directionReason || '（記述なし）'}

`;

  for (const sec of ['A', 'B', 'C']) {
    const secDef = DEMENTIA_SECTIONS[sec];
    const items = visibleItems.filter(i => i.section === sec);
    if (items.length === 0) continue;
    prompt += `■ ${secDef.label}\n`;
    items.forEach(i => { prompt += `${formatItem(i)}\n`; });
    prompt += '\n';
  }

  if (data.direction) {
    const dKey = { facility: 'D1', watch: 'D2', endoflife: 'D3', unknown: 'D4' }[data.direction];
    const secDef = DEMENTIA_SECTIONS[dKey];
    const items = visibleItems.filter(i => i.section === dKey);
    if (items.length > 0) {
      prompt += `■ ${secDef.label}\n`;
      items.forEach(i => { prompt += `${formatItem(i)}\n`; });
      prompt += '\n';
    }
  }

  const eItems = visibleItems.filter(i => i.section === 'E');
  if (eItems.length > 0) {
    prompt += `■ ${DEMENTIA_SECTIONS['E'].label}\n`;
    eItems.forEach(i => { prompt += `${formatItem(i)}\n`; });
    prompt += '\n';
  }

  if (data.memo) {
    prompt += `■ 備考\n${data.memo}\n\n`;
  }

  prompt += `---
上記データを踏まえ、BRIEF形式で出力してください。
前提姿勢:
- この患者は人生の先輩である
- 入院継続が「失敗」ではなく「臨床的に正当な判断」である場合がある
- 不明な情報は「不明（確認が必要）」と明示し、推測で埋めない
- 定期再評価の時期設定を必ず含める`;

  return prompt;
}
