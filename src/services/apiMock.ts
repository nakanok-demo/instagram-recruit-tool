// ---------------------------------------------------------------
// Mock API — 将来は各関数を実際のFetch/Axios呼び出しに差し替える
// ---------------------------------------------------------------

export interface GeneratedPostData {
  imageIndex: number;
  caption: string;
  theme: string;
}

export interface TrendItem {
  label: string;
  growth: string;
  hot: boolean;
}

export interface BestTime {
  day: string;
  time: string;
  note: string;
}

export interface TrendData {
  title: string;
  description: string;
  trends: TrendItem[];
  bestTimes: BestTime[];
  contentHints: string[];
}

// ダミー画像の設定（DummyImage コンポーネントで参照）
export const IMAGE_CONFIGS = [
  { gradient: 'from-orange-300 to-amber-400', emoji: '🍱', label: '社内ランチ' },
  { gradient: 'from-blue-400 to-cyan-500', emoji: '👩‍💼', label: '社員インタビュー' },
  { gradient: 'from-green-400 to-emerald-500', emoji: '🏢', label: 'オフィス風景' },
  { gradient: 'from-purple-400 to-indigo-500', emoji: '💡', label: 'チームMTG' },
  { gradient: 'from-pink-400 to-rose-500', emoji: '📚', label: '研修・勉強会' },
  { gradient: 'from-yellow-400 to-orange-500', emoji: '🎉', label: 'イベント' },
  { gradient: 'from-sky-400 to-blue-600', emoji: '💻', label: 'リモートワーク' },
  { gradient: 'from-emerald-400 to-teal-600', emoji: '✨', label: '福利厚生' },
  { gradient: 'from-violet-400 to-purple-600', emoji: '🌈', label: 'ダイバーシティ' },
] as const;

// パターン別投稿テンプレート（patternIndex で切り替わる）
const POST_TEMPLATES: GeneratedPostData[][] = [
  // Pattern 0 — 社内雰囲気・カルチャー訴求
  [
    {
      imageIndex: 0,
      theme: '社内ランチ',
      caption:
        '🍱 今日のランチタイム！\n\nチームみんなで近くのカフェへ☕\n「食事の時間こそ、チームの絆を深める大切な時間」というのが私たちの考えです。\n\nあなたもこんな仲間と一緒に働きませんか？\n\n#採用情報 #ランチタイム #社内の雰囲気 #一緒に働く仲間募集',
    },
    {
      imageIndex: 1,
      theme: '先輩社員インタビュー',
      caption:
        '👩‍💼 先輩社員インタビュー Vol.3\n\n「最初は不安でしたが、先輩たちがとても丁寧にサポートしてくれました」\n— 入社2年目・田中さん（マーケティング部）\n\n未経験からでも安心のオンボーディング制度があります🌱\n\n詳しくは プロフィールのリンクから👆\n\n#新卒採用 #キャリア形成 #働き方 #成長できる環境',
    },
    {
      imageIndex: 2,
      theme: 'オフィス紹介',
      caption:
        '🏢 私たちのオフィスをご紹介✨\n\n渋谷駅徒歩5分！開放的な窓から緑が見える明るいオフィスです。\nフリーアドレス制で、毎日気分に合わせて席を選べます。\n\n「場所に縛られない働き方」を実現中🌿\n\n#オフィス環境 #働きやすい職場 #フリーアドレス #採用募集中',
    },
  ],
  // Pattern 1 — 成長・スキルアップ訴求
  [
    {
      imageIndex: 3,
      theme: 'チームMTG',
      caption:
        '💡 朝のアイデアタイム！\n\n毎朝15分のスタンドアップMTGで、チーム全員が同じ方向を向いています。\n「一人の小さなアイデアが、大きな変化を生む」\n\nそんな文化を大切にしています🚀\n\n#チームワーク #朝活 #ミーティング文化 #採用情報',
    },
    {
      imageIndex: 4,
      theme: '社内勉強会',
      caption:
        '📚 社内勉強会レポート\n\n今日はデザイン思考ワークショップを開催🎨\n部署を超えたメンバーが集まり、新しい視点でプロダクトを考えました。\n\n学び続ける文化が、私たちの強みです💪\n\n#勉強会 #デザイン思考 #スキルアップ #働きながら学ぶ',
    },
    {
      imageIndex: 5,
      theme: '社内イベント',
      caption:
        '🎉 季節の社内イベント開催！\n\n年4回の全社交流イベント。今回はBBQ大会を開催しました🔥\n仕事を離れてリラックスした雰囲気での交流は、チームの絆をさらに深めてくれます。\n\n一緒に楽しい職場を作りませんか？\n\n#社内イベント #チームビルディング #懇親会 #採用絶賛募集中',
    },
  ],
  // Pattern 2 — 多様性・制度・リモート訴求
  [
    {
      imageIndex: 6,
      theme: 'リモートワーク',
      caption:
        '💻 リモートワークの一コマ\n\nフルリモートOK！自分のペースで、最高のパフォーマンスを発揮できる環境を用意しています。\n\n東京だけでなく、全国どこからでも活躍できます🌏\n\n#リモートワーク #フルリモート #場所にとらわれない働き方 #採用情報',
    },
    {
      imageIndex: 7,
      theme: '福利厚生紹介',
      caption:
        '✨ 充実の福利厚生をご紹介！\n\n・書籍購入補助（月5,000円）\n・ジム通い補助\n・誕生日休暇あり🎂\n・副業OK\n\n「社員の挑戦を応援する」ための制度を整えています。\n\n詳細はプロフィールのリンクから👆\n\n#福利厚生 #働きやすい会社 #採用情報 #求人',
    },
    {
      imageIndex: 8,
      theme: 'ダイバーシティ',
      caption:
        '🌈 多様なバックグラウンドが強み\n\n現在、10カ国以上の国籍のメンバーが活躍中！\n異なる視点やアイデアが、革新的なプロダクトを生み出しています。\n\nあなたの個性と経験を、ぜひ私たちに教えてください🤝\n\n#ダイバーシティ #インクルージョン #グローバルチーム #採用情報',
    },
  ],
];

const TREND_PATTERNS: TrendData[] = [
  {
    title: 'Q2 採用トレンドレポート',
    description: '社員の「リアルな声」コンテンツが高エンゲージメントを獲得中。',
    trends: [
      { label: '社員インタビュー動画', growth: '+42%', hot: true },
      { label: 'オフィスツアー系', growth: '+28%', hot: true },
      { label: '1日密着コンテンツ', growth: '+19%', hot: false },
      { label: '求人票そのまま投稿', growth: '-15%', hot: false },
    ],
    bestTimes: [
      { day: '火曜・木曜', time: '12:00〜13:00', note: 'ランチタイムの閲覧率が高い' },
      { day: '日曜', time: '20:00〜22:00', note: '翌週の仕事を意識する時間帯' },
    ],
    contentHints: [
      '「社員の素顔」を見せるコンテンツが刺さります',
      'カジュアルな雰囲気 > 堅い公式感',
      'ハッシュタグは5〜8個が最適',
      '絵文字を冒頭に使うとタップ率UP',
    ],
  },
  {
    title: 'Q3 採用トレンドレポート',
    description: '「働き方の柔軟性」を訴求するコンテンツへの反応が急上昇中。',
    trends: [
      { label: 'リモートワーク系', growth: '+55%', hot: true },
      { label: '副業・パラレルワーク紹介', growth: '+33%', hot: true },
      { label: '入社前後ギャップ解消コンテンツ', growth: '+27%', hot: false },
      { label: '採用条件の羅列', growth: '-22%', hot: false },
    ],
    bestTimes: [
      { day: '月曜・水曜', time: '7:30〜8:30', note: '通勤中の閲覧ピーク' },
      { day: '土曜', time: '10:00〜12:00', note: '余裕のある週末の転職活動時間帯' },
    ],
    contentHints: [
      '「柔軟性」「自由」「選択肢」のキーワードが効果的',
      'リモートワーク環境の写真は高保存率',
      'ストーリーズとのクロス投稿でリーチ拡大',
      'CTAは「詳しくはプロフィールから」が最も機能',
    ],
  },
  {
    title: 'Q4 採用トレンドレポート',
    description: '年末に向けて「来期に向けたキャリアチェンジ」への関心が高まっています。',
    trends: [
      { label: '年収・待遇の透明性訴求', growth: '+61%', hot: true },
      { label: 'キャリアパス紹介', growth: '+44%', hot: true },
      { label: '社内制度紹介（詳細版）', growth: '+31%', hot: false },
      { label: '抽象的なビジョン訴求のみ', growth: '-18%', hot: false },
    ],
    bestTimes: [
      { day: '木曜・金曜', time: '21:00〜23:00', note: '週末前の転職検討が増える時間帯' },
      { day: '日曜', time: '14:00〜16:00', note: '来週への気持ちの切り替えタイム' },
    ],
    contentHints: [
      '具体的な数字（年収例・昇給率）があると信頼感UP',
      '「〇年目の私の給与」系は高エンゲージメント',
      '年末年始は「来年こそは」メッセージが刺さる',
      'カルーセル投稿でキャリアパスを詳細解説',
    ],
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// トレンドパターンに応じてランダムにテンプレートを返す
export async function generateAIPost(patternIndex: number): Promise<GeneratedPostData> {
  await delay(1800);
  const templates = POST_TEMPLATES[patternIndex % POST_TEMPLATES.length];
  const idx = Math.floor(Math.random() * templates.length);
  return { ...templates[idx] };
}

// patternIndex に対応するトレンドデータを返す
export async function fetchTrendReport(patternIndex: number): Promise<TrendData> {
  await delay(400);
  return TREND_PATTERNS[patternIndex % TREND_PATTERNS.length];
}

// Instagram Graph API への投稿をシミュレート
export async function submitToInstagram(post: {
  imageIndex: number;
  caption: string;
  scheduledAt: string;
}): Promise<{ success: boolean; postId: string }> {
  await delay(800);
  void post;
  return { success: true, postId: `mock_${Date.now()}` };
}
