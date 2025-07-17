/**
 * kimariji.html から TypeScript データ形式への変換スクリプト
 */

const fs = require('fs');
const path = require('path');

function convertHtmlToTypeScript() {
  const htmlPath = path.join(__dirname, '..', 'kimariji.html');
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'hyakunin-isshu-data-converted.ts');

  // HTMLファイルを読み込み
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // HTMLタグを除去する関数
  function removeHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '').trim();
  }
  
  // CSS変数を抽出するための正規表現（HTMLタグを考慮）
  const cardPattern = /--card-(\d+)-([^:]+):\s*([^;]+);/g;
  
  // カードデータを格納するオブジェクト
  const cards = {};
  
  // 全てのCSS変数を抽出
  let match;
  while ((match = cardPattern.exec(htmlContent)) !== null) {
    const cardId = parseInt(match[1]);
    const property = match[2];
    let value = match[3].trim();
    
    // 値から引用符を削除し、HTMLタグを除去
    value = value.replace(/^["']|["']$/g, '').trim();
    value = removeHtmlTags(value);
    
    // カードオブジェクトの初期化
    if (!cards[cardId]) {
      cards[cardId] = {
        id: cardId,
        reading: {},
        kimariji: {}
      };
    }
    
    // プロパティに基づいてデータを設定
    switch (property) {
      case 'id':
        cards[cardId].id = parseInt(value);
        break;
      case 'kami-no-ku':
        cards[cardId].kamiNoKu = value;
        break;
      case 'shimo-no-ku':
        cards[cardId].shimoNoKu = value;
        break;
      case 'author':
        cards[cardId].author = value;
        break;
      case 'reading-kami':
        cards[cardId].reading.kamiNoKu = value;
        break;
      case 'reading-shimo':
        cards[cardId].reading.shimoNoKu = value;
        break;
      case 'reading-author':
        cards[cardId].reading.author = value;
        break;
      case 'kimariji-pattern':
        cards[cardId].kimariji.pattern = value;
        break;
      case 'kimariji-length':
        cards[cardId].kimariji.length = parseInt(value);
        break;
      case 'kimariji-category':
        cards[cardId].kimariji.category = parseInt(value);
        break;
      case 'kimariji-difficulty':
        cards[cardId].kimariji.difficulty = value;
        break;
      case 'meaning':
        cards[cardId].meaning = value;
        break;
      case 'notes':
        cards[cardId].kimariji.notes = value;
        break;
    }
  }
  
  // カードデータを配列に変換（IDでソート）
  const cardsArray = Object.values(cards)
    .sort((a, b) => a.id - b.id)
    .map(card => ({
      ...card,
      kimariji: {
        ...card.kimariji,
        position: 0, // デフォルト値
        conflictCards: [] // デフォルト値
      }
    }));
  
  // TypeScriptファイルの生成
  const tsContent = `// 百人一首データ（kimariji.htmlから自動生成）
import { HyakuninIsshuCard } from '../types/WordCard';

export const hyakuninIsshuData: HyakuninIsshuCard[] = ${JSON.stringify(cardsArray, null, 2)
  .replace(/"([^"]+)":/g, '$1:')
  .replace(/"/g, "'")};

// 決まり字分類の分布統計
export const kimarijiStats = {
  '1': cardsArray.filter(card => card.kimariji.category === 1).length,
  '2': cardsArray.filter(card => card.kimariji.category === 2).length,
  '3': cardsArray.filter(card => card.kimariji.category === 3).length,
  '4': cardsArray.filter(card => card.kimariji.category === 4).length,
  '5': cardsArray.filter(card => card.kimariji.category === 5).length,
  '6': cardsArray.filter(card => card.kimariji.category === 6).length,
};

console.log('決まり字分類統計:', kimarijiStats);
`;
  
  // ファイルに書き込み
  fs.writeFileSync(outputPath, tsContent, 'utf8');
  
  console.log(`✅ 変換完了: ${outputPath}`);
  console.log(`📊 変換されたカード数: ${cardsArray.length}`);
  
  // 統計情報を表示
  const stats = {};
  cardsArray.forEach(card => {
    const category = card.kimariji.category;
    stats[category] = (stats[category] || 0) + 1;
  });
  
  console.log('決まり字分類統計:');
  Object.entries(stats).forEach(([category, count]) => {
    console.log(`  ${category}字決まり: ${count}枚`);
  });
  
  return cardsArray;
}

// スクリプトを実行
if (require.main === module) {
  convertHtmlToTypeScript();
}

module.exports = { convertHtmlToTypeScript };