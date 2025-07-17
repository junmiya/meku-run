// 百人一首データ - 第1-10首のサンプル
// 本格実装時は100首すべてのデータを含める

import { HyakuninIsshuCard } from '../types/WordCard';

// 百人一首データ（サンプル - 最初の10首）
export const hyakuninIsshuData: HyakuninIsshuCard[] = [
  {
    id: 1,
    kamiNoKu: "秋の田の かりほの庵の 苫をあらみ",
    shimoNoKu: "わが衣手は 露にぬれつつ",
    author: "天智天皇",
    reading: {
      kamiNoKu: "あきのたの かりほのいおの とまをあらみ",
      shimoNoKu: "わがころもでは つゆにぬれつつ",
      author: "てんちてんのう"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あきの",
      category: 3,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "秋の田の仮小屋の屋根の苫が粗いので、私の着物の袖は露に濡れてばかりいる"
  },
  {
    id: 2,
    kamiNoKu: "春すぎて 夏来にけらし 白妙の",
    shimoNoKu: "衣ほすてふ 天の香具山",
    author: "持統天皇",
    reading: {
      kamiNoKu: "はるすぎて なつきにけらし しろたえの",
      shimoNoKu: "ころもほすちょう あまのかぐやま",
      author: "じとうてんのう"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "はるす",
      category: 3,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "春が過ぎて夏がやってきたらしい。白い衣を干すという天の香具山に"
  },
  {
    id: 3,
    kamiNoKu: "あしひきの 山鳥の尾の しだり尾の",
    shimoNoKu: "ながながし夜を ひとりかも寝む",
    author: "柿本人麻呂",
    reading: {
      kamiNoKu: "あしひきの やまどりのおの しだりおの",
      shimoNoKu: "ながながしよを ひとりかもねん",
      author: "かきのもとのひとまろ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "あし",
      category: 2,
      conflictCards: [1, 2],
      difficulty: "medium"
    },
    meaning: "山鳥の長い尾のように、長い夜を一人で寝ることか"
  },
  {
    id: 4,
    kamiNoKu: "田子の浦に うち出でて見れば 白妙の",
    shimoNoKu: "富士の高嶺に 雪は降りつつ",
    author: "山辺赤人",
    reading: {
      kamiNoKu: "たごのうらに うちいでてみれば しろたえの",
      shimoNoKu: "ふじのたかねに ゆきはふりつつ",
      author: "やまべのあかひと"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "たごの",
      category: 3,
      conflictCards: [5],
      difficulty: "medium"
    },
    meaning: "田子の浦に出て見ると、白い富士山の高い峰に雪が降り続いている"
  },
  {
    id: 5,
    kamiNoKu: "奥山に 紅葉踏み分け 鳴く鹿の",
    shimoNoKu: "声聞く時ぞ 秋は悲しき",
    author: "猿丸大夫",
    reading: {
      kamiNoKu: "おくやまに もみじふみわけ なくしかの",
      shimoNoKu: "こえきくときぞ あきはかなしき",
      author: "さるまるだゆう"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "おく",
      category: 2,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "奥山で紅葉を踏み分けて鳴く鹿の声を聞く時こそ、秋は悲しいものだ"
  },
  {
    id: 6,
    kamiNoKu: "むらさめの 露もまだひぬ まきの葉に",
    shimoNoKu: "霧立ちのぼる 秋の夕暮れ",
    author: "寂蓮法師",
    reading: {
      kamiNoKu: "むらさめの つゆもまだひぬ まきのはに",
      shimoNoKu: "きりたちのぼる あきのゆうぐれ",
      author: "じゃくれんほうし"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "かさ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "むらさめの露もまだ乾かない槇の葉に霧が立ちのぼる秋の夕暮れよ"
  },
  {
    id: 7,
    kamiNoKu: "天の原 ふりさけ見れば 春日なる",
    shimoNoKu: "三笠の山に 出でし月かも",
    author: "安倍右大臣",
    reading: {
      kamiNoKu: "あまのはら ふりさけみれば かすがなる",
      shimoNoKu: "みかさのやまに いでしつきかも",
      author: "あべのうだいじん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あまの",
      category: 3,
      conflictCards: [8],
      difficulty: "medium"
    },
    meaning: "大空を振り仰いで見ると、春日にある三笠山に出ていた月と同じ月だなあ"
  },
  {
    id: 8,
    kamiNoKu: "わが庵は 都の辰巳 しかぞ住む",
    shimoNoKu: "世をうじ山と 人はいふなり",
    author: "喜撰法師",
    reading: {
      kamiNoKu: "わがいおは みやこのたつみ しかぞすむ",
      shimoNoKu: "よをうじやまと ひとはいうなり",
      author: "きせんほうし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "わがい",
      category: 3,
      conflictCards: [7],
      difficulty: "medium"
    },
    meaning: "私の庵は都の東南にある、このように住んでいると、世をうじ山（憂き山）と人は言うらしい"
  },
  {
    id: 9,
    kamiNoKu: "花の色は うつりにけりな いたづらに",
    shimoNoKu: "わが身世にふる ながめせしまに",
    author: "小野小町",
    reading: {
      kamiNoKu: "はなのいろは うつりにけりな いたずらに",
      shimoNoKu: "わがみよにふる ながめせしまに",
      author: "おののこまち"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "はなの",
      category: 3,
      conflictCards: [10],
      difficulty: "medium"
    },
    meaning: "花の色は移ろってしまったなあ、私がこの世に生きて物思いにふけっている間に"
  },
  {
    id: 10,
    kamiNoKu: "これやこの 行くも帰るも 別れては",
    shimoNoKu: "知るも知らぬも 逢坂の関",
    author: "蝉丸",
    reading: {
      kamiNoKu: "これやこの いくもかえるも わかれては",
      shimoNoKu: "しるもしらぬも おうさかのせき",
      author: "せみまる"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "これ",
      category: 2,
      conflictCards: [9],
      difficulty: "medium"
    },
    meaning: "これがあの有名な、行く人も帰る人も、また知る人も知らない人も別れを交わすという逢坂の関なのか"
  },
  {
    id: 11,
    kamiNoKu: "わたの原 八十島かけて 漕ぎ出でぬと",
    shimoNoKu: "人には告げよ 海人の釣船",
    author: "参議篁",
    reading: {
      kamiNoKu: "わたのはら やそしまかけて こぎいでぬと",
      shimoNoKu: "ひとにはつげよ あまのつりぶね",
      author: "さんぎたかむら"
    },
    kimariji: {
      position: 0,
      length: 6,
      pattern: "わたのはらや",
      category: 6,
      conflictCards: [76],
      difficulty: "medium"
    },
    meaning: "大海原の多くの島々を目指して漕ぎ出したと、人に告げてくれ、海人の釣り舟よ"
  },
  {
    id: 12,
    kamiNoKu: "天つ風 雲の通ひ路 吹きとぢよ",
    shimoNoKu: "乙女の姿 しばしとどめむ",
    author: "僧正遍昭",
    reading: {
      kamiNoKu: "あまつかぜ くものかよいじ ふきとじよ",
      shimoNoKu: "おとめのすがた しばしとどめん",
      author: "そうじょうへんじょう"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あまつ",
      category: 3,
      conflictCards: [11],
      difficulty: "medium"
    },
    meaning: "天の風よ、雲の通り道を吹き閉ざしてくれ、乙女の姿をしばらく留めておこう"
  },
  {
    id: 13,
    kamiNoKu: "筑波嶺の 峰より落つる みなの川",
    shimoNoKu: "恋ぞ積もりて 淵となりぬる",
    author: "陽成院",
    reading: {
      kamiNoKu: "つくばねの みねよりおつる みなのがわ",
      shimoNoKu: "こいぞつもりて ふちとなりぬる",
      author: "ようぜいいん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "つく",
      category: 2,
      conflictCards: [14],
      difficulty: "medium"
    },
    meaning: "筑波峰の峰から落ちる水無川のように、恋が積もって深い淵となってしまった"
  },
  {
    id: 14,
    kamiNoKu: "陸奥の しのぶもぢずり 誰ゆえに",
    shimoNoKu: "乱れそめにし 我ならなくに",
    author: "河原左大臣",
    reading: {
      kamiNoKu: "みちのくの しのぶもじずり たれゆえに",
      shimoNoKu: "みだれそめにし われならなくに",
      author: "かわらのさだいじん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "みち",
      category: 2,
      conflictCards: [13],
      difficulty: "medium"
    },
    meaning: "陸奥の忍摺のように、誰のせいで心が乱れ始めたのか、私のせいではないのに"
  },
  {
    id: 15,
    kamiNoKu: "君がため 春の野に出でて 若菜摘む",
    shimoNoKu: "わが衣手に 雪は降りつつ",
    author: "光孝天皇",
    reading: {
      kamiNoKu: "きみがため はるののにいでて わかなつむ",
      shimoNoKu: "わがころもでに ゆきはふりつつ",
      author: "こうこうてんのう"
    },
    kimariji: {
      position: 0,
      length: 6,
      pattern: "きみがためは",
      category: 6,
      conflictCards: [50],
      difficulty: "easy"
    },
    meaning: "あなたのために春の野に出て若菜を摘む、私の袖に雪が降り続いている"
  },
  {
    id: 16,
    kamiNoKu: "立ち別れ いなばの山の 峰に生ふる",
    shimoNoKu: "まつとし聞かば 今帰り来む",
    author: "中納言行平",
    reading: {
      kamiNoKu: "たちわかれ いなばのやまの みねにおう",
      shimoNoKu: "まつとしきかば いまかえりこん",
      author: "ちゅうなごんゆきひら"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "たち",
      category: 2,
      conflictCards: [17],
      difficulty: "medium"
    },
    meaning: "別れて因幡の山の峰に生える松のように、待つと聞けばすぐに帰ってこよう"
  },
  {
    id: 17,
    kamiNoKu: "ちはやぶる 神代も聞かず 竜田川",
    shimoNoKu: "からくれなゐに 水くくるとは",
    author: "在原業平朝臣",
    reading: {
      kamiNoKu: "ちはやぶる かみよもきかず たつたがわ",
      shimoNoKu: "からくれないに みずくくるとは",
      author: "ありわらのなりひらあそん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "ちは",
      category: 2,
      conflictCards: [18],
      difficulty: "medium"
    },
    meaning: "勢いの激しい神代でも聞いたことがない、竜田川が唐紅に水をくくるとは"
  },
  {
    id: 18,
    kamiNoKu: "住の江の 岸に寄る波 よるさへや",
    shimoNoKu: "夢の通ひ路 人目よくらむ",
    author: "藤原敏行朝臣",
    reading: {
      kamiNoKu: "すみのえの きしによるなみ よるさえや",
      shimoNoKu: "ゆめのかよいじ ひとめよくらん",
      author: "ふじわらのとしゆきあそん"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "す",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "住の江の岸に寄せる波のように、夜でさえも夢の通い路で人目を避けているのだろうか"
  },
  {
    id: 19,
    kamiNoKu: "難波潟 短き蘆の ふしの間も",
    shimoNoKu: "逢はでこの世を 過ぐしてよとや",
    author: "伊勢",
    reading: {
      kamiNoKu: "なにわがた みじかきあしの ふしのまも",
      shimoNoKu: "あわでこのよを すぐしてよとや",
      author: "いせ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "なに",
      category: 2,
      conflictCards: [88, 89],
      difficulty: "medium"
    },
    meaning: "難波潟の短い蘆の節の間ほどの短い間も、逢わないでこの世を過ごせというのか"
  },
  {
    id: 20,
    kamiNoKu: "わびぬれば 今はたおなじ 難波なる",
    shimoNoKu: "みをつくしても 逢はむとぞ思ふ",
    author: "元良親王",
    reading: {
      kamiNoKu: "わびぬれば いまはたおなじ なにわなる",
      shimoNoKu: "みをつくしても あわんとぞおもう",
      author: "もとよししんのう"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "わび",
      category: 2,
      conflictCards: [21],
      difficulty: "medium"
    },
    meaning: "悩み疲れたので、今はもう同じこと、難波の澪標のように身を尽くしても逢おうと思う"
  },
  {
    id: 21,
    kamiNoKu: "今来むと いひしばかりに 長月の",
    shimoNoKu: "有明の月を 待ち出でつるかな",
    author: "素性法師",
    reading: {
      kamiNoKu: "いまこんと いいしばかりに ながつきの",
      shimoNoKu: "ありあけのつきを まちいでつるかな",
      author: "そせいほうし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "いまこ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "今来ると言ったばかりに、長月の有明の月を待ち続けて出してしまったなあ"
  },
  {
    id: 22,
    kamiNoKu: "吹くからに 秋の草木の しをるれば",
    shimoNoKu: "むべ山風を 嵐といふらむ",
    author: "文屋康秀",
    reading: {
      kamiNoKu: "ふくからに あきのくさきの しおるれば",
      shimoNoKu: "むべやまかぜを あらしというらん",
      author: "ぶんやのやすひで"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "ふ",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "吹くと同時に秋の草木がしおれるので、なるほど山風を嵐というのだろう"
  },
  {
    id: 23,
    kamiNoKu: "月見れば ちぢに物こそ 悲しけれ",
    shimoNoKu: "わが身ひとつの 秋にはあらねど",
    author: "大江千里",
    reading: {
      kamiNoKu: "つきみれば ちじにものこそ かなしけれ",
      shimoNoKu: "わがみひとつの あきにはあらねど",
      author: "おおえのちさと"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "つき",
      category: 2,
      conflictCards: [22],
      difficulty: "medium"
    },
    meaning: "月を見ると、いろいろと物悲しいことよ、私一人だけの秋ではないのに"
  },
  {
    id: 24,
    kamiNoKu: "このたびは 幣も取りあへず 手向山",
    shimoNoKu: "紅葉の錦 神のまにまに",
    author: "菅家",
    reading: {
      kamiNoKu: "このたびは ぬさもとりあえず たむけやま",
      shimoNoKu: "もみじのにしき かみのまにまに",
      author: "かんけ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "このた",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "この度は幣も用意できず、手向山の紅葉の錦を神の御心のままに"
  },
  {
    id: 25,
    kamiNoKu: "名にし負はば 逢坂山の さねかづら",
    shimoNoKu: "人に知られで 来るよしもがな",
    author: "三条右大臣",
    reading: {
      kamiNoKu: "なにしおわば おうさかやまの さねかずら",
      shimoNoKu: "ひとにしられで くるよしもがな",
      author: "さんじょうのうだいじん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "なにし",
      category: 3,
      conflictCards: [88, 89],
      difficulty: "medium"
    },
    meaning: "名前の通りなら、逢坂山のさねかづらのように、人に知られないで来る方法があればよいのに"
  },
  {
    id: 26,
    kamiNoKu: "小倉山 峰のもみぢ葉 心あらば",
    shimoNoKu: "今ひとたびの みゆき待たなむ",
    author: "貞信公",
    reading: {
      kamiNoKu: "おぐらやま みねのもみじば こころあらば",
      shimoNoKu: "いまひとたびの みゆきまたなん",
      author: "ていしんこう"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "をぐ",
      category: 2,
      conflictCards: [25],
      difficulty: "medium"
    },
    meaning: "小倉山の峰の紅葉よ、心があるなら、もう一度の行幸をお待ちしなさい"
  },
  {
    id: 27,
    kamiNoKu: "みかの原 わきて流るる 泉川",
    shimoNoKu: "いつ見きとてか 恋しかるらむ",
    author: "中納言兼輔",
    reading: {
      kamiNoKu: "みかのはら わきてながるる いずみがわ",
      shimoNoKu: "いつみきとてか こいしかるらん",
      author: "ちゅうなごんかねすけ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "みかの",
      category: 3,
      conflictCards: [28],
      difficulty: "medium"
    },
    meaning: "みかの原を分けて流れる泉川、いつ見たというので恋しいのだろう"
  },
  {
    id: 28,
    kamiNoKu: "山里は 冬ぞ寂しさ まさりける",
    shimoNoKu: "人目も草も かれぬと思へば",
    author: "源宗于朝臣",
    reading: {
      kamiNoKu: "やまざとは ふゆぞさびしさ まさりける",
      shimoNoKu: "ひとめもくさも かれぬとおもえば",
      author: "みなもとのむねゆきあそん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "やまざ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "山里は冬こそ寂しさが勝るのだ、人影も草も枯れてしまうと思うと"
  },
  {
    id: 29,
    kamiNoKu: "心あてに 折らばや折らむ 初霜の",
    shimoNoKu: "置きまどはせる 白菊の花",
    author: "凡河内躬恒",
    reading: {
      kamiNoKu: "こころあてに おらばやおらん はつしもの",
      shimoNoKu: "おきまどわせる しらぎくのはな",
      author: "おおしこうちのみつね"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "ここ",
      category: 2,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "当て推量で折ろうか折ろう、初霜が置いて見分けがつかなくなった白菊の花を"
  },
  {
    id: 30,
    kamiNoKu: "有明の つれなく見えし 別れより",
    shimoNoKu: "暁ばかり 憂きものはなし",
    author: "壬生忠岑",
    reading: {
      kamiNoKu: "ありあけの つれなくみえし わかれより",
      shimoNoKu: "あかつきばかり うきものはなし",
      author: "みぶのただみね"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "ありあ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "有明の月がつれなく見えた別れ以来、暁ほど憂鬱なものはない"
  },
  {
    id: 31,
    kamiNoKu: "朝ぼらけ 有明の月と 見るまでに",
    shimoNoKu: "吉野の里に 降れる白雪",
    author: "坂上是則",
    reading: {
      kamiNoKu: "あさぼらけ ありあけのつきと みるまでに",
      shimoNoKu: "よしののさとに ふれるしらゆき",
      author: "さかのうえのこれのり"
    },
    kimariji: {
      position: 0,
      length: 6,
      pattern: "あさぼらけあ",
      category: 6,
      conflictCards: [64],
      difficulty: "medium"
    },
    meaning: "夜明けに有明の月と見えるまでに、吉野の里に降った白雪よ"
  },
  {
    id: 32,
    kamiNoKu: "山川に 風のかけたる しがらみは",
    shimoNoKu: "流れもあへず 紅葉なりけり",
    author: "春道列樹",
    reading: {
      kamiNoKu: "やまがわに かぜのかけたる しがらみは",
      shimoNoKu: "ながれもあえず もみじなりけり",
      author: "はるみちのつらき"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "やまが",
      category: 3,
      conflictCards: [31],
      difficulty: "medium"
    },
    meaning: "山川に風がかけた柵は、流れることもできない紅葉であったなあ"
  },
  {
    id: 33,
    kamiNoKu: "ひさかたの 光のどけき 春の日に",
    shimoNoKu: "しづ心なく 花の散るらむ",
    author: "紀友則",
    reading: {
      kamiNoKu: "ひさかたの ひかりのどけき はるのひに",
      shimoNoKu: "しずこころなく はなのちるらん",
      author: "きのとものり"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "ひさ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "空の光がのどかな春の日に、なぜ落ち着きなく花が散るのだろう"
  },
  {
    id: 34,
    kamiNoKu: "誰をかも 知る人にせむ 高砂の",
    shimoNoKu: "松も昔の 友ならなくに",
    author: "藤原興風",
    reading: {
      kamiNoKu: "たれをかも しるひとにせん たかさごの",
      shimoNoKu: "まつもむかしの ともならなくに",
      author: "ふじわらのおきかぜ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "たれ",
      category: 2,
      conflictCards: [33],
      difficulty: "medium"
    },
    meaning: "誰を知人にしようか、高砂の松も昔の友ではないのに"
  },
  {
    id: 35,
    kamiNoKu: "人はいさ 心も知らず ふるさとの",
    shimoNoKu: "花ぞ昔の 香ににほひける",
    author: "紀貫之",
    reading: {
      kamiNoKu: "ひとはいさ こころもしらず ふるさとの",
      shimoNoKu: "はなぞむかしの かににおいける",
      author: "きのつらゆき"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "ひとは",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "人はどうか、心も知らないが、故郷の花は昔の香りに匂っていることよ"
  },
  {
    id: 36,
    kamiNoKu: "夏の夜は まだ宵ながら 明けぬるを",
    shimoNoKu: "雲のいづこに 月宿るらむ",
    author: "清原深養父",
    reading: {
      kamiNoKu: "なつのよは まだよいながら あけぬるを",
      shimoNoKu: "くものいずこに つきやどるらん",
      author: "きよはらのふかやぶ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "なつ",
      category: 2,
      conflictCards: [37],
      difficulty: "medium"
    },
    meaning: "夏の夜はまだ宵のうちに明けてしまうのに、雲のどこに月が宿るのだろう"
  },
  {
    id: 37,
    kamiNoKu: "白露に 風の吹きしく 秋の野は",
    shimoNoKu: "つらぬきとめぬ 玉ぞ散りける",
    author: "文屋朝康",
    reading: {
      kamiNoKu: "しらつゆに かぜのふきしく あきののは",
      shimoNoKu: "つらぬきとめぬ たまぞちりける",
      author: "ぶんやのあさやす"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "しら",
      category: 2,
      conflictCards: [36],
      difficulty: "medium"
    },
    meaning: "白露に風が吹き重なる秋の野は、糸に貫き留めない玉が散ったようだ"
  },
  {
    id: 38,
    kamiNoKu: "忘らるる 身をば思はず 誓ひてし",
    shimoNoKu: "人の命の 惜しくもあるかな",
    author: "右近",
    reading: {
      kamiNoKu: "わすらるる みをばおもわず ちかいてし",
      shimoNoKu: "ひとのいのちの おしくもあるかな",
      author: "うこん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "わすら",
      category: 3,
      conflictCards: [39],
      difficulty: "medium"
    },
    meaning: "忘れられる身は思わないが、誓った人の命が惜しいことよ"
  },
  {
    id: 39,
    kamiNoKu: "浅茅生の 小野の篠原 忍ぶれど",
    shimoNoKu: "あまりてなどか 人の恋しき",
    author: "参議等",
    reading: {
      kamiNoKu: "あさじうの おののしのはら しのぶれど",
      shimoNoKu: "あまりてなどか ひとのこいしき",
      author: "さんぎひとし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あさぢ",
      category: 3,
      conflictCards: [38],
      difficulty: "medium"
    },
    meaning: "浅茅生の小野の篠原のように忍んでいるが、あまりにもなぜ人が恋しいのか"
  },
  {
    id: 40,
    kamiNoKu: "しのぶれど 色に出でにけり わが恋は",
    shimoNoKu: "ものや思ふと 人の問ふまで",
    author: "平兼盛",
    reading: {
      kamiNoKu: "しのぶれど いろにいでにけり わがこいは",
      shimoNoKu: "ものやおもうと ひとのとうまで",
      author: "たいらのかねもり"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "しの",
      category: 2,
      conflictCards: [41],
      difficulty: "medium"
    },
    meaning: "忍んでいるが、色に出てしまった我が恋は、物思いをしているのかと人が問うまでに"
  },
  {
    id: 41,
    kamiNoKu: "恋すてふ わが名はまだき 立ちにけり",
    shimoNoKu: "人知れずこそ 思ひそめしか",
    author: "壬生忠見",
    reading: {
      kamiNoKu: "こいすちょう わがなはまだき たちにけり",
      shimoNoKu: "ひとしれずこそ おもいそめしか",
      author: "みぶのただみ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "こひ",
      category: 2,
      conflictCards: [40],
      difficulty: "medium"
    },
    meaning: "恋をするという我が名は早くも立ってしまった、人知れず思い始めたのに"
  },
  {
    id: 42,
    kamiNoKu: "契りきな かたみに袖を しぼりつつ",
    shimoNoKu: "末の松山 波越さじとは",
    author: "清原元輔",
    reading: {
      kamiNoKu: "ちぎりきな かたみにそでを しぼりつつ",
      shimoNoKu: "すえのまつやま なみこさじとは",
      author: "きよはらのもとすけ"
    },
    kimariji: {
      position: 0,
      length: 4,
      pattern: "ちぎりき",
      category: 4,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "約束したなあ、互いに袖を絞りつつ、末の松山を波が越すことはないと"
  },
  {
    id: 43,
    kamiNoKu: "逢ひ見ての のちの心に くらぶれば",
    shimoNoKu: "昔は物を 思はざりけり",
    author: "権中納言敦忠",
    reading: {
      kamiNoKu: "あいみての のちのこころに くらぶれば",
      shimoNoKu: "むかしはものを おもわざりけり",
      author: "ごんちゅうなごんあつただ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "あひ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "逢って見た後の心に比べれば、昔は物を思わなかったのだなあ"
  },
  {
    id: 44,
    kamiNoKu: "逢ふことの 絶えてしなくは なかなかに",
    shimoNoKu: "人をも身をも 恨みざらまし",
    author: "中納言朝忠",
    reading: {
      kamiNoKu: "あうことの たえてしなくは なかなかに",
      shimoNoKu: "ひとをもみをも うらみざらまし",
      author: "ちゅうなごんあさただ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あふこ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "逢うことが全くなければ、かえって人をも身をも恨まなかったろうに"
  },
  {
    id: 45,
    kamiNoKu: "あはれとも いふべき人は 思ほえで",
    shimoNoKu: "身のいたづらに なりぬべきかな",
    author: "謙徳公",
    reading: {
      kamiNoKu: "あわれとも いうべきひとは おもおえで",
      shimoNoKu: "みのいたずらに なりぬべきかな",
      author: "けんとくこう"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あはれ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "あはれと言ってくれる人は思い浮かばず、身が無駄になってしまいそうだ"
  },
  {
    id: 46,
    kamiNoKu: "由良の門を 渡る舟人 かぢを絶え",
    shimoNoKu: "ゆくへも知らぬ 恋の道かな",
    author: "曾禰好忠",
    reading: {
      kamiNoKu: "ゆらのとを わたるふなびと かじをたえ",
      shimoNoKu: "ゆくえもしらぬ こいのみちかな",
      author: "そねのよしただ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "ゆら",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "由良の門を渡る舟人が舵を絶って、行方も知らない恋の道だなあ"
  },
  {
    id: 47,
    kamiNoKu: "八重むぐら しげれる宿の さびしきに",
    shimoNoKu: "人こそ見えね 秋は来にけり",
    author: "恵慶法師",
    reading: {
      kamiNoKu: "やえむぐら しげれるやどの さびしきに",
      shimoNoKu: "ひとこそみえね あきはきにけり",
      author: "えぎょうほうし"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "やへ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "八重むぐらが茂った宿の寂しさに、人こそ見えないが秋は来たのだなあ"
  },
  {
    id: 48,
    kamiNoKu: "風をいたみ 岩うつ波の おのれのみ",
    shimoNoKu: "くだけて物を 思ふころかな",
    author: "源重之",
    reading: {
      kamiNoKu: "かぜをいたみ いわうつなみの おのれのみ",
      shimoNoKu: "くだけてものを おもうころかな",
      author: "みなもとのしげゆき"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "かぜを",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "風が激しいので岩に打つ波が、自分だけ砕けて物を思う頃だなあ"
  },
  {
    id: 49,
    kamiNoKu: "みかきもり 衛士のたく火の 夜は燃え",
    shimoNoKu: "昼は消えつつ 物をこそ思へ",
    author: "大中臣能宣朝臣",
    reading: {
      kamiNoKu: "みかきもり えじのたくひの よるはもえ",
      shimoNoKu: "ひるはきえつつ ものをこそおもえ",
      author: "おおなかとみのよしのぶあそん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "みかき",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "宮廷の警備の番人が焚く火のように、夜は燃え昼は消えつつ物を思う"
  },
  {
    id: 50,
    kamiNoKu: "君がため 惜しからざりし 命さへ",
    shimoNoKu: "長くもがなと 思ひけるかな",
    author: "藤原義孝",
    reading: {
      kamiNoKu: "きみがため おしからざりし いのちさえ",
      shimoNoKu: "ながくもがなと おもいけるかな",
      author: "ふじわらのよしたか"
    },
    kimariji: {
      position: 0,
      length: 6,
      pattern: "きみがためを",
      category: 6,
      conflictCards: [15],
      difficulty: "easy"
    },
    meaning: "あなたのために惜しくなかった命さえ、長くあってほしいと思ったことよ"
  },
  {
    id: 51,
    kamiNoKu: "かくとだに えやは伊吹の さしも草",
    shimoNoKu: "さしも知らじな 燃ゆる思ひを",
    author: "藤原実方朝臣",
    reading: {
      kamiNoKu: "かくとだに えやはいぶきの さしもぐさ",
      shimoNoKu: "さしもしらじな もゆるおもいを",
      author: "ふじわらのさねかたあそん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "かく",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "このようにとさえ、どうして伊吹のさしも草、そんなに知らないだろうな、燃える思いを"
  },
  {
    id: 52,
    kamiNoKu: "明けぬれば 暮るるものとは 知りながら",
    shimoNoKu: "なほ恨めしき 朝ぼらけかな",
    author: "藤原道信朝臣",
    reading: {
      kamiNoKu: "あけぬれば くるるものとは しりながら",
      shimoNoKu: "なおうらめしき あさぼらけかな",
      author: "ふじわらのみちのぶあそん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "あけ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "夜が明けると暮れるものと知りながら、やはり恨めしい朝ぼらけだなあ"
  },
  {
    id: 53,
    kamiNoKu: "嘆きつつ ひとり寝る夜の 明くる間は",
    shimoNoKu: "いかに久しき ものとかは知る",
    author: "右大将道綱母",
    reading: {
      kamiNoKu: "なげきつつ ひとりねるよの あくるまは",
      shimoNoKu: "いかにひさしき ものとかはしる",
      author: "うだいしょうみちつなのはは"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "なげき",
      category: 3,
      conflictCards: [54],
      difficulty: "medium"
    },
    meaning: "嘆きつつ一人寝る夜の明けるまでは、どんなに長いものかと知っている"
  },
  {
    id: 54,
    kamiNoKu: "忘れじの 行く末までは かたければ",
    shimoNoKu: "今日を限りの 命ともがな",
    author: "儀同三司母",
    reading: {
      kamiNoKu: "わすれじの ゆくすえまでは かたければ",
      shimoNoKu: "きょうをかぎりの いのちともがな",
      author: "ぎどうさんしのはは"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "わすれ",
      category: 3,
      conflictCards: [53],
      difficulty: "medium"
    },
    meaning: "忘れないでいる行く末までは難しいので、今日を限りの命であってほしい"
  },
  {
    id: 55,
    kamiNoKu: "滝の音は 絶えて久しく なりぬれど",
    shimoNoKu: "名こそ流れて なほ聞こえけれ",
    author: "大納言公任",
    reading: {
      kamiNoKu: "たきのおとは たえてひさしく なりぬれど",
      shimoNoKu: "なこそながれて なおきこえけれ",
      author: "だいなごんきんとう"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "たき",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "滝の音は絶えて久しくなったが、名前は流れてやはり聞こえる"
  },
  {
    id: 56,
    kamiNoKu: "あらざらむ この世のほかの 思ひ出に",
    shimoNoKu: "いまひとたびの 逢ふこともがな",
    author: "和泉式部",
    reading: {
      kamiNoKu: "あらざらん このよのほかの おもいでに",
      shimoNoKu: "いまひとたびの あうこともがな",
      author: "いずみしきぶ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あらざ",
      category: 3,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "もはやこの世にいないであろう、この世以外の思い出に、もう一度逢うことがあればよいのに"
  },
  {
    id: 57,
    kamiNoKu: "めぐり逢ひて 見しやそれとも わかぬまに",
    shimoNoKu: "雲がくれにし 夜半の月かな",
    author: "紫式部",
    reading: {
      kamiNoKu: "めぐりあいて みしやそれとも わかぬまに",
      shimoNoKu: "くもがくれにし よわのつきかな",
      author: "むらさきしきぶ"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "め",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "めぐり逢って、見たのはそれかどうかもわからないうちに、雲に隠れてしまった夜半の月だなあ"
  },
  {
    id: 58,
    kamiNoKu: "有馬山 猪名の笹原 風吹けば",
    shimoNoKu: "いでそよ人を 忘れやはする",
    author: "大弐三位",
    reading: {
      kamiNoKu: "ありまやま いなのささはら かぜふけば",
      shimoNoKu: "いでそよひとを わすれやはする",
      author: "だいにのさんみ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "ありま",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "有馬山の猪名の笹原に風が吹けば、さあそよそよと、人を忘れようか、忘れはしない"
  },
  {
    id: 59,
    kamiNoKu: "やすらはで 寝なましものを さ夜更けて",
    shimoNoKu: "かたぶくまでの 月を見しかな",
    author: "赤染衛門",
    reading: {
      kamiNoKu: "やすらわで ねなましものを さよふけて",
      shimoNoKu: "かたぶくまでの つきをみしかな",
      author: "あかぞめえもん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "やす",
      category: 2,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "ためらわないで寝てしまえばよかったものを、夜が更けて傾くまでの月を見たことよ"
  },
  {
    id: 60,
    kamiNoKu: "大江山 いく野の道の 遠ければ",
    shimoNoKu: "まだ文も見ず 天の橋立",
    author: "小式部内侍",
    reading: {
      kamiNoKu: "おおえやま いくののみちの とおければ",
      shimoNoKu: "まだふみもみず あまのはしだて",
      author: "こしきぶのないし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "おほえ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "大江山を越えて生野の道が遠いので、まだ文も見ていない天の橋立"
  },
  {
    id: 61,
    kamiNoKu: "いにしへの 奈良の都の 八重桜",
    shimoNoKu: "けふ九重に 匂ひぬるかな",
    author: "伊勢大輔",
    reading: {
      kamiNoKu: "いにしえの ならのみやこの やえざくら",
      shimoNoKu: "きょうここのえに においぬるかな",
      author: "いせのたいふ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "いに",
      category: 2,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "昔の奈良の都の八重桜が、今日宮中で匂っていることよ"
  },
  {
    id: 62,
    kamiNoKu: "夜をこめて 鳥の空音は はかるとも",
    shimoNoKu: "よに逢坂の 関は許さじ",
    author: "清少納言",
    reading: {
      kamiNoKu: "よをこめて とりのそらねは はかるとも",
      shimoNoKu: "よにおうさかの せきはゆるさじ",
      author: "せいしょうなごん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "よを",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "夜が明けないうちに鶏の偽の鳴き声で騙そうとも、決して逢坂の関は許すまい"
  },
  {
    id: 63,
    kamiNoKu: "今はただ 思ひ絶えなむ とばかりを",
    shimoNoKu: "人づてならで 言ふよしもがな",
    author: "左京大夫道雅",
    reading: {
      kamiNoKu: "いまはただ おもいたえなん とばかりを",
      shimoNoKu: "ひとづてならで いうよしもがな",
      author: "さきょうのだいぶみちまさ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "いまは",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "今はただ思いを絶とうというだけを、人づてでなく言う方法があればよいのに"
  },
  {
    id: 64,
    kamiNoKu: "朝ぼらけ 宇治の川霧 たえだえに",
    shimoNoKu: "あらはれわたる 瀬々の網代木",
    author: "権中納言定頼",
    reading: {
      kamiNoKu: "あさぼらけ うじのかわぎり たえだえに",
      shimoNoKu: "あらわれわたる せぜのあじろぎ",
      author: "ごんちゅうなごんさだより"
    },
    kimariji: {
      position: 0,
      length: 6,
      pattern: "あさぼらけう",
      category: 6,
      conflictCards: [31],
      difficulty: "easy"
    },
    meaning: "夜明けに宇治の川霧がところどころ切れて、現れて見える瀬々の網代木"
  },
  {
    id: 65,
    kamiNoKu: "恨みわび ほさぬ袖だに あるものを",
    shimoNoKu: "恋に朽ちなむ 名こそ惜しけれ",
    author: "相模",
    reading: {
      kamiNoKu: "うらみわび ほさぬそでだに あるものを",
      shimoNoKu: "こいにくちなん なこそおしけれ",
      author: "さがみ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "うら",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "恨み疲れて、乾かない袖さえあるのに、恋に朽ちてしまう名前こそ惜しい"
  },
  {
    id: 66,
    kamiNoKu: "もろともに あはれと思へ 山桜",
    shimoNoKu: "花よりほかに 知る人もなし",
    author: "前大僧正行尊",
    reading: {
      kamiNoKu: "もろともに あわれとおもえ やまざくら",
      shimoNoKu: "はなよりほかに しるひともなし",
      author: "さきのだいそうじょうぎょうそん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "もろ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "一緒にあはれと思ってくれ、山桜よ、花よりほかに知る人もいない"
  },
  {
    id: 67,
    kamiNoKu: "春の夜の 夢ばかりなる 手枕に",
    shimoNoKu: "かひなく立たむ 名こそ惜しけれ",
    author: "周防内侍",
    reading: {
      kamiNoKu: "はるのよの ゆめばかりなる たまくらに",
      shimoNoKu: "かいなくたたん なこそおしけれ",
      author: "すおうのないし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "はるの",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "春の夜の夢ほどのことである手枕に、甲斐なく立つであろう名前こそ惜しい"
  },
  {
    id: 68,
    kamiNoKu: "心にも あらで憂き世に ながらへば",
    shimoNoKu: "恋しかるべき 夜半の月かな",
    author: "三条院",
    reading: {
      kamiNoKu: "こころにも あらでうきよに ながらえば",
      shimoNoKu: "こいしかるべき よわのつきかな",
      author: "さんじょういん"
    },
    kimariji: {
      position: 0,
      length: 4,
      pattern: "こころに",
      category: 4,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "心にもなく憂き世に長らえば、恋しいであろう夜半の月だなあ"
  },
  {
    id: 69,
    kamiNoKu: "嵐吹く 三室の山の もみぢ葉は",
    shimoNoKu: "竜田の川の 錦なりけり",
    author: "能因法師",
    reading: {
      kamiNoKu: "あらしふく みむろのやまの もみじばは",
      shimoNoKu: "たつたのかわの にしきなりけり",
      author: "のういんほうし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あらし",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "嵐が吹く三室の山の紅葉は、竜田川の錦であったなあ"
  },
  {
    id: 70,
    kamiNoKu: "さびしさに 宿を立ち出でて ながむれば",
    shimoNoKu: "いづくも同じ 秋の夕暮",
    author: "良暹法師",
    reading: {
      kamiNoKu: "さびしさに やどをたちいでて ながむれば",
      shimoNoKu: "いずくもおなじ あきのゆうぐれ",
      author: "りょうぜんほうし"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "さ",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "寂しさに宿を出て眺めると、どこも同じ秋の夕暮れ"
  },
  {
    id: 71,
    kamiNoKu: "夕されば 門田の稲葉 おとづれて",
    shimoNoKu: "蘆のまろ屋に 秋風ぞ吹く",
    author: "大納言経信",
    reading: {
      kamiNoKu: "ゆうされば かどたのいなば おとずれて",
      shimoNoKu: "あしのまろやに あきかぜぞふく",
      author: "だいなごんつねのぶ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "ゆふ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "夕方になると門田の稲葉に音を立てて、蘆の粗末な家に秋風が吹く"
  },
  {
    id: 72,
    kamiNoKu: "音に聞く 高師の浜の あだ波は",
    shimoNoKu: "かけじや袖の ぬれもこそすれ",
    author: "祐子内親王家紀伊",
    reading: {
      kamiNoKu: "おとにきく たかしのはまの あだなみは",
      shimoNoKu: "かけじやそでの ぬれもこそすれ",
      author: "ゆうしないしんのうけのきい"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "おと",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "音に聞く高師の浜のあだ波は、かけまい、袖が濡れるかもしれない"
  },
  {
    id: 73,
    kamiNoKu: "高砂の 尾上の桜 咲きにけり",
    shimoNoKu: "外山の霞 立たずもあらなむ",
    author: "権中納言匡房",
    reading: {
      kamiNoKu: "たかさごの おのえのさくら さきにけり",
      shimoNoKu: "とやまのかすみ たたずもあらなん",
      author: "ごんちゅうなごんまさふさ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "たか",
      category: 2,
      conflictCards: [],
      difficulty: "medium"
    },
    meaning: "高砂の尾上の桜が咲いた、外山の霞よ立たないでいてくれ"
  },
  {
    id: 74,
    kamiNoKu: "憂かりける 人を初瀬の 山おろしよ",
    shimoNoKu: "はげしかれとは 祈らぬものを",
    author: "源俊頼朝臣",
    reading: {
      kamiNoKu: "うかりける ひとをはつせの やまおろしよ",
      shimoNoKu: "はげしかれとは いのらぬものを",
      author: "みなもとのとしよりあそん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "うか",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "つらかった人を初瀬の山おろしよ、激しくあれとは祈らなかったのに"
  },
  {
    id: 75,
    kamiNoKu: "契りおきし させもが露を 命にて",
    shimoNoKu: "あはれ今年の 秋もいぬめり",
    author: "藤原基俊",
    reading: {
      kamiNoKu: "ちぎりおきし させもがつゆを いのちにて",
      shimoNoKu: "あわれことしの あきもいぬめり",
      author: "ふじわらのもととし"
    },
    kimariji: {
      position: 0,
      length: 4,
      pattern: "ちぎりお",
      category: 4,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "約束した指させもが露を命として、ああ今年の秋も去っていくようだ"
  },
  {
    id: 76,
    kamiNoKu: "わたの原 漕ぎ出でて見れば ひさかたの",
    shimoNoKu: "雲居にまがふ 沖つ白波",
    author: "法性寺入道前関白太政大臣",
    reading: {
      kamiNoKu: "わたのはら こぎいでてみれば ひさかたの",
      shimoNoKu: "くもいにまがう おきつしらなみ",
      author: "ほうしょうじにゅうどうさきのかんぱくだいじょうだいじん"
    },
    kimariji: {
      position: 0,
      length: 6,
      pattern: "わたのはらこ",
      category: 6,
      conflictCards: [11],
      difficulty: "easy"
    },
    meaning: "大海原に漕ぎ出て見ると、空の雲居に見紛う沖の白波"
  },
  {
    id: 77,
    kamiNoKu: "瀬をはやみ 岩にせかるる 滝川の",
    shimoNoKu: "われても末に 逢はむとぞ思ふ",
    author: "崇徳院",
    reading: {
      kamiNoKu: "せをはやみ いわにせかるる たきがわの",
      shimoNoKu: "われてもすえに あわんとぞおもう",
      author: "すとくいん"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "せ",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "瀬が早いので岩に堰かれる滝川のように、分かれても最後に逢おうと思う"
  },
  {
    id: 78,
    kamiNoKu: "淡路島 通ふ千鳥の 鳴く声に",
    shimoNoKu: "いく夜寝覚めぬ 須磨の関守",
    author: "源兼昌",
    reading: {
      kamiNoKu: "あわじしま かようちどりの なくこえに",
      shimoNoKu: "いくよねざめぬ すまのせきもり",
      author: "みなもとのかねまさ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あはぢ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "淡路島を通う千鳥の鳴く声に、幾夜寝覚めることか、須磨の関守は"
  },
  {
    id: 79,
    kamiNoKu: "秋風に たなびく雲の 絶え間より",
    shimoNoKu: "もれ出づる月の 影のさやけさ",
    author: "左京大夫顕輔",
    reading: {
      kamiNoKu: "あきかぜに たなびくくもの たえまより",
      shimoNoKu: "もれいずるつきの かげのさやけさ",
      author: "さきょうのだいぶあきすけ"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "あきか",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "秋風になびく雲の絶え間から、漏れ出る月の光の清らかさよ"
  },
  {
    id: 80,
    kamiNoKu: "ながからむ 心も知らず 黒髪の",
    shimoNoKu: "乱れてけさは 物をこそ思へ",
    author: "待賢門院堀河",
    reading: {
      kamiNoKu: "ながからん こころもしらず くろかみの",
      shimoNoKu: "みだれてけさは ものをこそおもえ",
      author: "たいけんもんいんのほりかわ"
    },
    kimariji: {
      position: 0,
      length: 4,
      pattern: "ながから",
      category: 4,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "長く続くであろう心も知らず、黒髪が乱れて今朝は物を思う"
  },
  {
    id: 81,
    kamiNoKu: "ほととぎす 鳴きつる方を ながむれば",
    shimoNoKu: "ただ有明の 月ぞ残れる",
    author: "後徳大寺左大臣",
    reading: {
      kamiNoKu: "ほととぎす なきつるかたを ながむれば",
      shimoNoKu: "ただありあけの つきぞのこれる",
      author: "ごとくだいじのさだいじん"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "ほ",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "ほととぎすが鳴いた方を眺めると、ただ有明の月だけが残っている"
  },
  {
    id: 82,
    kamiNoKu: "思ひわび さても命は あるものを",
    shimoNoKu: "憂きに堪へぬは 涙なりけり",
    author: "道因法師",
    reading: {
      kamiNoKu: "おもいわび さてもいのちは あるものを",
      shimoNoKu: "うきにたえぬは なみだなりけり",
      author: "どういんほうし"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "おも",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "思い悩んで、それでも命はあるものを、憂きに堪えないのは涙であったなあ"
  },
  {
    id: 83,
    kamiNoKu: "世の中よ 道こそなけれ 思ひ入る",
    shimoNoKu: "山の奥にも 鹿ぞ鳴くなる",
    author: "皇太后宮大夫俊成",
    reading: {
      kamiNoKu: "よのなかよ みちこそなけれ おもいいる",
      shimoNoKu: "やまのおくにも しかぞなくなる",
      author: "こうたいごうぐうのだいぶしゅんぜい"
    },
    kimariji: {
      position: 0,
      length: 5,
      pattern: "よのなかよ",
      category: 5,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "世の中よ、道こそないなあ、思い入る山の奥にも鹿が鳴いている"
  },
  {
    id: 84,
    kamiNoKu: "長らへば またこのごろや しのばれむ",
    shimoNoKu: "憂しと見し世ぞ 今は恋しき",
    author: "藤原清輔朝臣",
    reading: {
      kamiNoKu: "ながらえば またこのごろや しのばれん",
      shimoNoKu: "うしとみしよぞ いまはこいしき",
      author: "ふじわらのきよすけあそん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "ながら",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "長らえば、またこの頃のことが懐かしまれるだろう、憂しと見た世が今は恋しい"
  },
  {
    id: 85,
    kamiNoKu: "夜もすがら 物思ふころは 明けやらで",
    shimoNoKu: "閨のひまさへ つれなかりけり",
    author: "俊恵法師",
    reading: {
      kamiNoKu: "よもすがら ものおもうころは あけやらで",
      shimoNoKu: "ねやのひまさえ つれなかりけり",
      author: "しゅんえほうし"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "よも",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "夜もすがら物思いする頃は、明けきらないで、閨の隙間さえつれないことよ"
  },
  {
    id: 86,
    kamiNoKu: "嘆けとて 月やはものを 思はする",
    shimoNoKu: "かこち顔なる わが涙かな",
    author: "西行法師",
    reading: {
      kamiNoKu: "なげけとて つきやはものを おもわする",
      shimoNoKu: "かこちがおなる わがなみだかな",
      author: "さいぎょうほうし"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "なげけ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "嘆けと言って月が物を思わせるのか、恨めしそうな顔をしている我が涙だなあ"
  },
  {
    id: 87,
    kamiNoKu: "村雨の 露もまだ干ぬ 真木の葉に",
    shimoNoKu: "霧立ちのぼる 秋の夕暮",
    author: "寂蓮法師",
    reading: {
      kamiNoKu: "むらさめの つゆもまだひぬ まきのはに",
      shimoNoKu: "きりたちのぼる あきのゆうぐれ",
      author: "じゃくれんほうし"
    },
    kimariji: {
      position: 0,
      length: 1,
      pattern: "む",
      category: 1,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "通り雨の露もまだ乾かない真木の葉に、霧が立ち上る秋の夕暮れ"
  },
  {
    id: 88,
    kamiNoKu: "難波江の 蘆のかりねの ひとよゆゑ",
    shimoNoKu: "身を尽くしてや 恋ひわたるべき",
    author: "皇嘉門院別当",
    reading: {
      kamiNoKu: "なにわえの あしのかりねの ひとよゆえ",
      shimoNoKu: "みをつくしてや こいわたるべき",
      author: "こうかもんいんのべっとう"
    },
    kimariji: {
      position: 0,
      length: 4,
      pattern: "なにはえ",
      category: 4,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "難波江の蘆の仮寝の一夜のために、身を尽くして恋い続けるべきなのか"
  },
  {
    id: 89,
    kamiNoKu: "玉の緒よ 絶えなば絶えね ながらへば",
    shimoNoKu: "忍ぶることの 弱りもぞする",
    author: "式子内親王",
    reading: {
      kamiNoKu: "たまのおよ たえなばたえね ながらえば",
      shimoNoKu: "しのぶることの よわりもぞする",
      author: "しきしないしんのう"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "たま",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "玉の緒よ、絶えるなら絶えてしまえ、長らえば忍ぶ力が弱くなりそうだ"
  },
  {
    id: 90,
    kamiNoKu: "見せばやな 雄島の海人の 袖だにも",
    shimoNoKu: "濡れにぞ濡れし 色は変らず",
    author: "殷富門院大輔",
    reading: {
      kamiNoKu: "みせばやな おじまのあまの そでだにも",
      shimoNoKu: "ぬれにぞぬれし いろはかわらず",
      author: "いんぷもんいんのだいふ"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "みせ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "見せたいものだ、雄島の海人の袖でさえ、濡れに濡れたが色は変わらず"
  },
  {
    id: 91,
    kamiNoKu: "きりぎりす 鳴くや霜夜の さむしろに",
    shimoNoKu: "衣かたしき ひとりかも寝む",
    author: "後京極摂政前太政大臣",
    reading: {
      kamiNoKu: "きりぎりす なくやしもよの さむしろに",
      shimoNoKu: "ころもかたしき ひとりかもねん",
      author: "ごきょうごくせっしょうさきのだいじょうだいじん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "きり",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "きりぎりすが鳴く霜夜の寒い筵に、衣を片敷いて一人で寝ることか"
  },
  {
    id: 92,
    kamiNoKu: "わが袖は 潮干に見えぬ 沖の石の",
    shimoNoKu: "人こそ知らね 乾く間もなし",
    author: "二条院讃岐",
    reading: {
      kamiNoKu: "わがそでは しおひにみえぬ おきのいしの",
      shimoNoKu: "ひとこそしらね かわくまもなし",
      author: "にじょういんのさぬき"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "わがそ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "我が袖は潮干に見えない沖の石のように、人こそ知らないが乾く間もない"
  },
  {
    id: 93,
    kamiNoKu: "世の中は 常にもがもな 渚こぐ",
    shimoNoKu: "海人の小舟の 綱手かなしも",
    author: "鎌倉右大臣",
    reading: {
      kamiNoKu: "よのなかは つねにもがもな なぎさこぐ",
      shimoNoKu: "あまのおぶねの つなでかなしも",
      author: "かまくらのうだいじん"
    },
    kimariji: {
      position: 0,
      length: 5,
      pattern: "よのなかは",
      category: 5,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "世の中は常であってほしいものだ、渚を漕ぐ海人の小舟の綱手が悲しいことよ"
  },
  {
    id: 94,
    kamiNoKu: "み吉野の 山の秋風 小夜更けて",
    shimoNoKu: "ふるさと寒く 衣打つなり",
    author: "参議雅経",
    reading: {
      kamiNoKu: "みよしのの やまのあきかぜ さよふけて",
      shimoNoKu: "ふるさとさむく ころもうつなり",
      author: "さんぎまさつね"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "みよ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "吉野の山の秋風が夜更けて、故郷は寒く衣を打つ音がする"
  },
  {
    id: 95,
    kamiNoKu: "おほけなく 憂き世の民に おほふかな",
    shimoNoKu: "わが立つ杣に 墨染の袖",
    author: "前大僧正慈円",
    reading: {
      kamiNoKu: "おおけなく うきよのたみに おおうかな",
      shimoNoKu: "わがたつそまに すみぞめのそで",
      author: "さきのだいそうじょうじえん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "おほけ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "おこがましく憂き世の民を覆うことよ、我が立つ杣に墨染の袖で"
  },
  {
    id: 96,
    kamiNoKu: "花さそふ 嵐の庭の 雪ならで",
    shimoNoKu: "ふりゆくものは わが身なりけり",
    author: "入道前太政大臣",
    reading: {
      kamiNoKu: "はなさそう あらしのにわの ゆきならで",
      shimoNoKu: "ふりゆくものは わがみなりけり",
      author: "にゅうどうさきのだいじょうだいじん"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "はなさ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "花を誘う嵐の庭の雪ではなく、老いていくものは我が身であったなあ"
  },
  {
    id: 97,
    kamiNoKu: "来ぬ人を 松帆の浦の 夕なぎに",
    shimoNoKu: "焼くや藻塩の 身もこがれつつ",
    author: "権中納言定家",
    reading: {
      kamiNoKu: "こぬひとを まつほのうらの ゆうなぎに",
      shimoNoKu: "やくやもしおの みもこがれつつ",
      author: "ごんちゅうなごんていか"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "こぬ",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "来ない人を松帆の浦の夕なぎに、焼く藻塩のように身も焦がれつつ"
  },
  {
    id: 98,
    kamiNoKu: "風そよぐ 楢の小川の 夕暮は",
    shimoNoKu: "みそぎぞ夏の しるしなりける",
    author: "従二位家隆",
    reading: {
      kamiNoKu: "かぜそよぐ ならのおがわの ゆうぐれは",
      shimoNoKu: "みそぎぞなつの しるしなりける",
      author: "じゅにいいえたか"
    },
    kimariji: {
      position: 0,
      length: 3,
      pattern: "かぜそ",
      category: 3,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "風がそよぐ楢の小川の夕暮れは、みそぎこそ夏のしるしであったなあ"
  },
  {
    id: 99,
    kamiNoKu: "人も愛し 人も恨めし あぢきなく",
    shimoNoKu: "世を思ふゆゑに 物思ふ身は",
    author: "後鳥羽院",
    reading: {
      kamiNoKu: "ひともいとし ひともうらめし あじきなく",
      shimoNoKu: "よをおもうゆえに ものおもうみは",
      author: "ごとばいん"
    },
    kimariji: {
      position: 0,
      length: 4,
      pattern: "ひともお",
      category: 4,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "人も愛しく人も恨めしく、つまらなく世を思うゆえに物思う身は"
  },
  {
    id: 100,
    kamiNoKu: "百敷や 古き軒端の しのぶにも",
    shimoNoKu: "なほ余りある 昔なりけり",
    author: "順徳院",
    reading: {
      kamiNoKu: "ももしきや ふるきのきばの しのぶにも",
      shimoNoKu: "なおあまりある むかしなりけり",
      author: "じゅんとくいん"
    },
    kimariji: {
      position: 0,
      length: 2,
      pattern: "もも",
      category: 2,
      conflictCards: [],
      difficulty: "easy"
    },
    meaning: "宮中の古い軒端の忍草にも、やはり余りある昔であったなあ"
  }
];