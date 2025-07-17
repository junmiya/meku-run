'use client';

import React from 'react';

// レイアウトテスト用ページ - メインページの簡略版
export default function LayoutTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* ヘッダー */}
      <header className="mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
            🎴 百人一首レイアウトテスト
          </h1>
          
          {/* 統計・制御パネル */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-blue-100 px-3 py-1 rounded-full">
                  デバイス: PC
                </span>
                <span className="bg-green-100 px-3 py-1 rounded-full">
                  表示: 10枚/ページ
                </span>
                <span className="bg-purple-100 px-3 py-1 rounded-full">
                  覚えた: 0/100首
                </span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  画面: 1920×1080
                </span>
              </div>
              
              <div className="flex gap-2">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  🔀 シャッフル
                </button>
                <button className="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors">
                  決まり字 OFF
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto">
        {/* カードグリッド */}
        <div className="grid grid-cols-5 gap-4 max-w-7xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((cardId) => (
            <div
              key={cardId}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer relative"
            >
              {/* カード番号 */}
              <div className="absolute top-2 left-2 text-xs text-gray-500 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
                {cardId}
              </div>

              {/* 覚えたボタン */}
              <button className="absolute top-2 right-2 w-6 h-6 rounded-full text-xs bg-gray-200 text-gray-600 hover:bg-gray-300">
                ✓
              </button>

              {/* 表面（上の句） */}
              <div className="h-40 flex flex-col justify-center">
                <div
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'upright',
                    direction: 'rtl',
                  }}
                  className="text-lg leading-relaxed mx-auto h-32 flex items-center justify-center"
                >
                  テストカード{cardId}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ページネーション */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            ← 前へ
          </button>
          
          <span className="text-gray-700">
            1 / 10
          </span>
          
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md">
            次へ →
          </button>
        </div>
      </main>
    </div>
  );
}