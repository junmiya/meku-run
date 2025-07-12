import { WordCard } from '../types/WordCard';
import { generateId } from '../utils/storage';

// TOEIC700点レベル向け重要単語
export const toeic700Words: Omit<WordCard, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // ビジネス・職場関連
  {
    word: "accomplish",
    meaning: "達成する、成し遂げる",
    tags: ["動詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "acquire",
    meaning: "獲得する、身につける",
    tags: ["動詞", "ビジネス", "TOEIC"]
  },
  {
    word: "adequate",
    meaning: "適切な、十分な",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "administrator",
    meaning: "管理者、運営者",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "agenda",
    meaning: "議題、予定表",
    tags: ["名詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "allocate",
    meaning: "割り当てる、配分する",
    tags: ["動詞", "ビジネス", "TOEIC"]
  },
  {
    word: "annually",
    meaning: "年に一度、毎年",
    tags: ["副詞", "ビジネス", "TOEIC"]
  },
  {
    word: "anticipate",
    meaning: "予期する、期待する",
    tags: ["動詞", "ビジネス", "TOEIC"]
  },
  {
    word: "assessment",
    meaning: "評価、査定",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "authentic",
    meaning: "本物の、信頼できる",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },

  // 経済・金融関連
  {
    word: "budget",
    meaning: "予算、予算を組む",
    tags: ["名詞", "動詞", "経済", "TOEIC"],
    isStarred: true
  },
  {
    word: "commodity",
    meaning: "商品、日用品",
    tags: ["名詞", "経済", "TOEIC"]
  },
  {
    word: "comprehensive",
    meaning: "包括的な、総合的な",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "consecutive",
    meaning: "連続した、継続的な",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "corporate",
    meaning: "企業の、法人の",
    tags: ["形容詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "crucial",
    meaning: "極めて重要な、決定的な",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "deficit",
    meaning: "赤字、不足",
    tags: ["名詞", "経済", "TOEIC"]
  },
  {
    word: "economical",
    meaning: "経済的な、節約の",
    tags: ["形容詞", "経済", "TOEIC"]
  },
  {
    word: "eliminate",
    meaning: "除去する、削除する",
    tags: ["動詞", "ビジネス", "TOEIC"]
  },
  {
    word: "estimate",
    meaning: "見積もる、推定する",
    tags: ["動詞", "名詞", "ビジネス", "TOEIC"]
  },

  // 技術・製造関連
  {
    word: "implement",
    meaning: "実行する、実施する",
    tags: ["動詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "innovative",
    meaning: "革新的な、斬新な",
    tags: ["形容詞", "技術", "TOEIC"]
  },
  {
    word: "maintenance",
    meaning: "保守、維持管理",
    tags: ["名詞", "技術", "TOEIC"]
  },
  {
    word: "manufacture",
    meaning: "製造する、製造業",
    tags: ["動詞", "名詞", "製造", "TOEIC"]
  },
  {
    word: "operational",
    meaning: "運営の、操作の",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "procedure",
    meaning: "手順、手続き",
    tags: ["名詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "productivity",
    meaning: "生産性、生産力",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "proposal",
    meaning: "提案、企画書",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "regulation",
    meaning: "規則、規制",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "revenue",
    meaning: "収入、歳入",
    tags: ["名詞", "経済", "TOEIC"],
    isStarred: true
  },

  // 日常・一般
  {
    word: "accomplish",
    meaning: "達成する、完成させる",
    tags: ["動詞", "一般", "TOEIC"]
  },
  {
    word: "appropriate",
    meaning: "適切な、ふさわしい",
    tags: ["形容詞", "一般", "TOEIC"]
  },
  {
    word: "convenience",
    meaning: "便利さ、都合",
    tags: ["名詞", "一般", "TOEIC"]
  },
  {
    word: "demonstrate",
    meaning: "実演する、証明する",
    tags: ["動詞", "一般", "TOEIC"]
  },
  {
    word: "efficient",
    meaning: "効率的な、能率的な",
    tags: ["形容詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "foundation",
    meaning: "基礎、土台、財団",
    tags: ["名詞", "一般", "TOEIC"]
  },
  {
    word: "guarantee",
    meaning: "保証する、保証",
    tags: ["動詞", "名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "household",
    meaning: "家庭の、世帯",
    tags: ["形容詞", "名詞", "一般", "TOEIC"]
  },
  {
    word: "instruction",
    meaning: "指示、指導、説明書",
    tags: ["名詞", "一般", "TOEIC"]
  },
  {
    word: "merchandise",
    meaning: "商品、品物",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },

  // 頻出重要語彙
  {
    word: "negotiate",
    meaning: "交渉する、取り決める",
    tags: ["動詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "obligation",
    meaning: "義務、責任",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "outstanding",
    meaning: "優秀な、未払いの",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "personnel",
    meaning: "職員、人事",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "priority",
    meaning: "優先事項、優先権",
    tags: ["名詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "remarkable",
    meaning: "注目すべき、驚くべき",
    tags: ["形容詞", "一般", "TOEIC"]
  },
  {
    word: "reputation",
    meaning: "評判、名声",
    tags: ["名詞", "ビジネス", "TOEIC"]
  },
  {
    word: "strategy",
    meaning: "戦略、計画",
    tags: ["名詞", "ビジネス", "TOEIC"],
    isStarred: true
  },
  {
    word: "substantial",
    meaning: "かなりの、実質的な",
    tags: ["形容詞", "ビジネス", "TOEIC"]
  },
  {
    word: "transportation",
    meaning: "輸送、交通機関",
    tags: ["名詞", "一般", "TOEIC"]
  }
];

// サンプルデータを生成する関数
export const generateSampleData = (): WordCard[] => {
  const now = new Date();
  
  return toeic700Words.map((word, index) => ({
    ...word,
    id: generateId(),
    createdAt: new Date(now.getTime() - (toeic700Words.length - index) * 60000), // 1分ずつ古く
    updatedAt: new Date(now.getTime() - (toeic700Words.length - index) * 60000)
  }));
};

// カテゴリ別統計
export const getSampleDataStats = () => {
  const tags = toeic700Words.flatMap(word => word.tags || []);
  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalWords: toeic700Words.length,
    starredWords: toeic700Words.filter(word => word.isStarred).length,
    tagCounts
  };
};